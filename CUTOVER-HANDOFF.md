# Cutover Handoff — Mumbai Bazar → Hydrogen/Oxygen

**Session date:** 2026-09-28
**Store:** `1ttsg4-3a.myshopify.com` (Hydrogen storefront ID `gid://shopify/HydrogenStorefront/1000181071`, SHOP_ID `80711974948`)
**Live site state:** still the OLD TanStack/Vite app on Vercel. **Not cut over.**
**Codebase:** `hydrogen/` is the target. The separate clone at `Clients\Clients\Mumbai Baazar` is the legacy TanStack app.

This file supersedes nothing. `HYDROGEN-HANDOFF.md` holds the original migration inventory.

---

## 1. Read this first — two hard-won lessons

**Lesson 1: never move DNS before a production deployment exists.**
Mid-session the apex A record was changed to Shopify's `23.227.38.65` while no Oxygen deployment existed. Shopify had nothing to serve and issued:

```
mumbaibazar.com
  -> 301 -> mumbai-bazar-ec7747deb9818e03a093.o2.myshopify.dev
  -> 403 -> accounts.shopify.com/select
```

Every real visitor landed on a Shopify **account login page** with a 403. It reads as a hijack. Rolled back by setting apex A to `76.76.21.21`.

**Lesson 2: the local machine's DNS cache lies.**
The local router (`192.168.1.1`) served a stale Shopify IP for 20+ minutes after the rollback. A plain `curl` showed `403` and Cloudflare headers while the site was in fact serving Vercel correctly. This nearly produced a false "still broken" verdict, and the same illusion will hide a *successful* cutover.

**Therefore: always verify with public resolvers AND a forced IP.**

```powershell
ipconfig /flushdns
Resolve-DnsName mumbaibazar.com -Type A -Server 8.8.8.8  -DnsOnly
Resolve-DnsName mumbaibazar.com -Type A -Server 1.1.1.1  -DnsOnly
curl.exe -s -o NUL -w "%{http_code}" --resolve "mumbaibazar.com:443:76.76.21.21" https://mumbaibazar.com/
```

A plain `curl https://mumbaibazar.com/` is not evidence of anything.

---

## 2. Current verified state

### DNS (checked against 8.8.8.8 and 1.1.1.1)

| Host | Record | Value | Serves |
|---|---|---|---|
| `mumbaibazar.com` | A | `76.76.21.21` | Vercel — old TanStack site, `200` |
| `www.mumbaibazar.com` | CNAME | `cname.vercel-dns.com` | Vercel, `301` → apex |
| `checkout.mumbaibazar.com` | CNAME | `shops.myshopify.com.` | `23.227.38.74` — **Shopify checkout, live** |

`checkout.mumbaibazar.com` is fully healthy: `200 OK`, TLS `CN=checkout.mumbaibazar.com` (Let's Encrypt), serves real Shopify checkout. A live cart was confirmed handing off to
`https://checkout.mumbaibazar.com/checkouts/cn/.../en-in`.

### Deployments (both to Oxygen)

| Env | URL |
|---|---|
| Preview (1st) | `01m3kp07vm4t60jrp6bwbb4z37-0c115900e09d309daaff.myshopify.dev` |
| Preview (2nd, post-fix) | `01m3kq8tr7evnx7da4txw9t3jf-0c115900e09d309daaff.myshopify.dev` |
| **Production** | `01m3kqj814sj7rwwkhd0qv4y9h-ec7747deb9818e03a093.myshopify.dev` |
| O2 tenant | `mumbai-bazar-ec7747deb9818e03a093.o2.myshopify.dev` |

Production suffix `ec7747deb9818e03a093` is the O2 tenant — **the same tenant Shopify already 301s `mumbaibazar.com` to.** The domain is therefore already associated with the Hydrogen storefront server-side, so the remaining cutover is likely a single A-record change rather than a full target+DNS sequence. **Verify this in the admin before assuming it.**

### Auth gate (expected, not a fault)

Every Hydrogen hostname returns `302` → `accounts.shopify.com` then `429` for unauthenticated requests. Preview, production and the O2 tenant all behave this way. A logged-in store-owner browser session is required. This is why the production route suite has **not** been run yet and cannot be from an unauthenticated shell.

---

## 3. Code changes made this session

### 3.1 `hydrogen/app/entry.server.tsx` — CSP (the important one)

Hydrogen's `createContentSecurityPolicy` default allows only `'self'`, `cdn.shopify.com` and the nonce. The site was loading Google Fonts and the Meta Pixel against that policy, so **both were blocked**:

- `fonts.googleapis.com` → blocked by `style-src`. Site fell back to system serif.
- `connect.facebook.net/en_US/fbevents.js` → blocked by `default-src`. **Zero Meta Pixel tracking** — no attribution, no retargeting, no conversion data.

Added explicit directives: `defaultSrc`, `scriptSrc` (+ `connect.facebook.net`, `www.facebook.com`), `styleSrc` (+ `fonts.googleapis.com`), `fontSrc` (+ `fonts.gstatic.com`), `imgSrc`, `connectSrc` (+ Facebook graph/beacon hosts). Marked with a `ponytail:` comment naming the removal path.

**Verified safe:** read Hydrogen's own `createCSPHeader` source in `node_modules/@shopify/hydrogen/dist/development/index.js`. Overrides are *unioned* with defaults via `addCspDirective`, and `nonceString` is appended to `scriptSrc` (falling back to `defaultSrc`) **after** the merge. The inline pixel script keeps its nonce. Confirmed present in the built worker:

```
connect.facebook.net (x2)  fonts.googleapis.com (x2)  fonts.gstatic.com (x2)  graph.facebook.com (x1)
```

### 3.2 `hydrogen/.env`

Added `PUBLIC_CHECKOUT_DOMAIN=checkout.mumbaibazar.com`. `app/root.tsx:94` and `app/entry.server.tsx:19` both read it, and it was absent — Hydrogen's `Analytics.Provider` threw `consent.checkoutDomain is required` on every page.

**Local `.env` is not enough.** Deploys read env vars from the Shopify dashboard. The user added it to the Shopify admin (Preview + Production) and the error disappeared. This is the trap: the variable must exist in both places.

### 3.3 `hydrogen/.env.example` — created

Did not exist. Documents all 11 keys including `PUBLIC_CHECKOUT_DOMAIN`, with a note that the subdomain checkout is architecturally mandatory and must be registered in Razorpay.

### 3.4 Verified as *not* broken

- Pixel ID `1663032738861857` is consistent between `app/root.tsx:182` and `.env`. No double-init.
- `app/lib/meta-pixel.ts` is imported by 4 files (`CartSummary.tsx`, `ProductCard.tsx`, `products.$handle.tsx`, `search.tsx`). Not dead code.
- `capacitor.config.ts:28` already allows `*.mumbaibazar.com`, so the app webview can reach `checkout.mumbaibazar.com` with no change.
- `cart.checkoutUrl` comes from the Shopify Cart API (`CartSummary.tsx:55`), so the branded checkout host needs no code.

---

## 4. Errors triaged

| Error | Verdict |
|---|---|
| CSP violation (fonts) | **Real.** Fixed in 3.1. |
| CSP violation (fbevents) | **Real, costed money.** Fixed in 3.1. |
| `consent.checkoutDomain is required` | **Real.** Fixed via dashboard env var. |
| `ERR_BLOCKED_BY_CLIENT` on `fbevents.js` and `consent-tracking-api.js` | **Not a bug — the user's ad blocker.** Also blocked `cdn.shopify.com/shopifycloud/...`, which nobody's own CSP would block. Verify the pixel in Incognito. |
| React #418 / #423 hydration mismatch | **Open, cosmetic.** Server HTML ≠ client render; page displays and recovers. Suspected cause is the `Analytics.Provider` throw, which has since been fixed. Not re-checked after that fix. |

---

## 5. NOT done — the remaining gates

**Do not touch DNS until both of these pass.**

1. **Fonts check.** Open the production URL. Are headings in Cormorant Garamond (thin, high-contrast serif) or a plain Times fallback? Never answered by the user. If fallback, `style-src` is still not reaching the browser.
2. **₹1 real Razorpay order.** Add to cart → confirm the checkout URL is `checkout.mumbaibazar.com/...` → pay ₹1 → confirm the success screen **and** the order in Shopify Admin → Orders.

Gate 2 is the one Avirena skipped and a customer hit instead — see §6.

### Remaining sequence

- **Step 7** — Shopify Admin → Settings → Domains: confirm `mumbaibazar.com` Target = production Hydrogen storefront, Primary; `www` = redirect domain → apex. Read the **exact A record from the admin**, never from a documented default.
- **Step 8** — GoDaddy: `@` A → that value; `www` CNAME → `shops.myshopify.com.`. **Do not touch MX or TXT** (email). Leave `checkout` alone.
- **Step 9** — verify with public resolvers + forced IP per §1.
- **Step 10** — hold the Vercel deployment 7 days as rollback. Reverting is one A-record edit to `76.76.21.21`.

**Commands** (in a real PowerShell window — OAuth needs a browser):

```powershell
cd "D:\ThePieCraft Marketing\Web Development\Mumbai Baazar\hydrogen"
npx shopify auth login                 # `--shop` flag does NOT exist in this CLI version
npx shopify hydrogen link
npx shopify hydrogen deploy --preview --force --no-lockfile-check
npx shopify hydrogen deploy --force --no-lockfile-check
```

---

## 6. Razorpay — the highest-risk item

Avirena Jewels lost **five real payments (₹3,445)** because cutover moved checkout to a domain never registered in Razorpay. All five failed with `payment_risk_check_failed` / *"Business – Website Mismatch"*, before the bank ever saw them. No money moved; anything debited auto-refunds in 5–7 days.

Per that project's HANDOFF §10, a domain change breaks the payment gateway **before it breaks anything visible**.

The user reports Step 2 (Razorpay) complete. Required in Razorpay → Settings → Website & App Settings:

```
mumbaibazar.com
www.mumbaibazar.com
checkout.mumbaibazar.com
1ttsg4-3a.myshopify.com
```

**Re-confirm all four are actually listed before the cutover.** This is a silent, customer-facing failure.

---

## 7. Other known items (non-blocking)

- `npm run typecheck` reports 13 pre-existing errors across `app/components/ProductItem.tsx`, `app/lib/context.ts`, `app/lib/structured-data.ts`, `app/lib/wishlist-context.tsx`, `app/routes/guides.$slug.tsx`, `app/routes/products.$handle.tsx`. **The production build passes** (exit 0).
- Legacy TanStack `src/routes/products.$id.tsx:123` — `const d = product.details!;` crashes the PDP when `details` is absent. Only matters for rollback to Vercel. Unfixed in both clones.
- The legacy clone at `Clients\Clients\Mumbai Baazar` has **uncommitted** external-agent changes (`.prettierrc`, `eslint.config.js`, `CartDrawer.tsx`, `SmoothScroll.tsx`, `shop.tsx`). Diff reviewed and appears sound. Its `npm run preview` is broken (expects `dist/server/server.js`; actual output is Nitro `.output`).
- Build noise that is **not** a failure: `hydrogen:bundle-analyzer` / `metafile.server.json` ENOENT (CLI plugin incompatible with Rolldown), and the `envFile` deprecation warning.
- Android App Links and iOS Universal Links stay 404 by design until signing material exists. `app/lib/mobile-app.ts` gates on empty fingerprints/Team ID. Correct behaviour, do not "fix".
- Security: real credentials live in `hydrogen/.env` (gitignored). Tokens were exposed in earlier tool output in this session and should be rotated in Shopify admin.

---

## 8. Git state

```
8ce56a7 feat: add Hydrogen/Oxygen storefront with full SEO and app-link parity
bc719a9 feat(nav): link navbar tags to filtered shop, ...
```

Uncommitted:

```
 M hydrogen/app/entry.server.tsx     <- CSP fix
?? hydrogen/.env.example             <- new
```

Local `main` is ahead of `origin/main` by one commit; **nothing has been pushed.** The CSP fix and `.env.example` are also uncommitted. Commit them before or alongside cutover so the deployed worker matches a commit.
