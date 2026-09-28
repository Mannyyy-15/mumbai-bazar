# Mumbai Baazar → Shopify Hydrogen / Oxygen migration

**Paste everything below the line into a fresh session, with this repo as the working directory.**

---

You are migrating **Mumbai Baazar** (https://mumbaibazar.com) from TanStack Start on Vercel to **Shopify Hydrogen on Oxygen**. Work in `d:\ThePieCraft Marketing\Web Development\Mumbai Baazar`.

I have already migrated a sister store (Avirena Jewels) the same way. Where this prompt states a fact about the current codebase, it was verified by inspection on 28 Sep 2026 — trust it as a starting point, but re-verify anything you are about to act on, because the code may have moved.

## What this codebase actually is

- **TanStack Start** (`@tanstack/react-start` 1.168, `@tanstack/react-router` 1.170), Vite 7, React 19, Tailwind v4.
- **~23,000 lines**: 37 routes (10.3k), 20 site components (3.8k), 20 lib modules (7.9k), 3 hooks.
- Deployed on **Vercel**. `vercel.json` does a 301 from `www.` to apex and sets security headers.
- **Already on the Shopify Storefront API** (`src/lib/shopify.ts`, 733 lines, API version 2024-10) against `mumbai-baazar-store.myshopify.com`. This is the single biggest reason the migration is tractable.
- **Capacitor mobile apps** for Android and iOS (`com.mumbaibazar.store`) that load `https://mumbaibazar.com` remotely.
- GSAP + Lenis smooth scrolling, same stack as Avirena.
- 103 URLs in the live sitemap.

Business: sarees. Categories are silk / wedding / festive / everyday, plus **7 store locations**, **3 local-area SEO pages** (Nalasopara, Vasai-Virar, Virar), a **guides** section, and a **Trousseau Builder**.

## The five things that will actually bite you

Address each one explicitly. Do not treat them as background detail.

### 1. The hardcoded product catalogue (highest priority)

`src/lib/shopify-catalog-data.ts` is **2,644 lines** containing all 34 products snapshotted from Shopify — prices ("₹ 999"), compare-at prices, variant GIDs, image URLs and tags, committed to source as a "zero-latency cache and resilient offline fallback".

This is the exact failure mode that caused months of problems on the sister store: a mock catalogue that silently diverges from Shopify, so the site advertises prices and stock that no longer exist.

**In Hydrogen it must be deleted, not ported.** Hydrogen's `storefront.query` with `CacheShort()` gives you the latency this file was working around, from live data. If a genuine offline fallback is needed for the mobile apps, that is a separate decision to raise with me — do not assume it and do not keep prices in it.

### 2. Country context — this silently breaks every cart

Set `i18n: {language: 'EN', country: 'IN'}` **and** `buyerIdentity: {countryCode: 'IN'}` in `app/lib/context.ts`, and verify it in the deployed build, not just locally.

On the sister store the Hydrogen skeleton default `country: 'US'` shipped to production. Shopify Markets does not sell to the US, so **every product returned `availableForSale: false, quantityAvailable: 0`** and **every** `cartCreate` failed with `MERCHANDISE_OUT_OF_STOCK`. The store could not take a single order, and the symptom looked like an inventory problem — Admin showed stock, the product pages looked fine, and only checkout failed. Prove it with:

```
query @inContext(country: IN){ product(handle:"..."){ availableForSale variants(first:1){edges{node{quantityAvailable}}} } }
```

Run the same query with `country: US` and watch it report zero. Then add-to-cart one real product on the deployed URL and confirm the drawer says **1 item** with a real total.

### 3. The cart is client-side and must become server-side

`src/lib/cart-context.tsx` keeps the cart in `localStorage` (`mb_cart_v1`) with a stored `shopifyCartId` and `checkoutUrl`. Hydrogen replaces this with a session-backed cart (`createCartHandler`, `CartForm`, `cart.get()`).

Do not port the context. Rebuild on Hydrogen's cart, then verify: add → drawer shows correct qty and total → **Proceed to Checkout lands on `checkout.<domain>` with `/en-in` in the URL and no `stock-problems` page**.

Note `cart-context.tsx` already contains defensive code checking `checkoutUrl.includes("www.mumbaibazar.com")` — evidence that a wrong checkout URL has bitten this site before. Hydrogen's `cart.checkoutUrl` is the only source of truth; never construct one.

### 4. The Storefront token is hardcoded in source

`src/lib/shopify.ts` falls back to a literal domain and token when env vars are missing, and `.env.local` is committed. That token is in git history.

Move it to Oxygen env vars with no literal fallback. **Tell me to rotate the token in Shopify admin** — do not assume I have.

### 5. The mobile apps point at the live domain

`capacitor.config.ts` sets `server.url = https://mumbaibazar.com`. Published Android and iOS apps load the site remotely, so **a DNS cutover changes the apps' behaviour without an app release**.

That is an advantage if the new site works and a live incident if it does not. Before cutover, verify the Hydrogen build in a mobile viewport and through the Capacitor `server.url` override, and confirm `.well-known/apple-app-site-association` and `assetlinks.json` still serve correctly — both exist as routes today (`src/routes/[.]well-known.*`) and both must survive, or deep links break.

## SEO: 103 indexed URLs to preserve

Inventory every live URL **before** you change routing, and keep the same paths. Do not "improve" a URL during the migration; a handle change on a headless Shopify site does not get a Shopify redirect, so it 404s.

Routes that must survive with identical paths:

- `/`, `/shop`, `/collections`, `/products/$id`
- Category pages: `/silk-sarees`, `/wedding-sarees`, `/festive-edit`, `/everyday-sarees`, `/new-arrivals`
- `/stores`, `/stores/$slug` (7 locations), `/sarees-in/$area` (3 areas)
- `/guides`, `/guides/$slug`
- `/about`, `/our-story`, `/contact`, `/faq`, `/care-guide`, `/trousseau-builder`
- All policies: `/privacy-policy`, `/refund-policy`, `/shipping-policy`, `/terms-of-service`, `/legal-notice`, `/contact-information`, `/shipping-returns`, `/policies/$policy`
- Machine routes: `/robots.txt`, `/sitemap.xml`, `/llms.txt`, `/indexnow-key.txt`, `/$indexnowkey.txt`, `/app-version.json`, both `.well-known` files

Port `src/lib/structured-data.ts` and `src/lib/seo.ts` deliberately. Verify after migration that each product page emits **Product + Offer** schema with a correct price and `InStock`/`OutOfStock`, and that collection pages emit **CollectionPage + ItemList** built from the same products the page renders.

`src/routes/llms[.]txt.ts` is read by AI answer engines. Check its claims against the live catalogue — on the sister store this file confidently told ChatGPT the store sold only one category, long after that stopped being true.

## Order of work

Do these in order and confirm each before moving on. Do not batch them into one deploy.

1. **Inventory and baseline.** Record all 103 sitemap URLs with their current title, meta description and status. Screenshot the homepage, a category, a PDP and the cart at desktop and mobile widths. You will diff against these.
2. **Scaffold Hydrogen** alongside the existing app in a `hydrogen/` subfolder. Do not delete the TanStack app until cutover; it is the fallback.
3. **Storefront layer first.** Port `shopify.ts` to Hydrogen's `storefront.query`, delete `shopify-catalog-data.ts`, set country to IN, and prove products and prices render from live data.
4. **Cart and checkout.** Hydrogen cart handler, then the end-to-end proof in §3 above.
5. **Routes, in traffic order**: home → shop/collections → PDP → category pages → stores and local areas → guides → policies → machine routes.
6. **Components**: Header, Footer, ProductCard, CartDrawer, WishlistDrawer, TrousseauBuilder, BlouseCustomizationModal, plus GSAP/Lenis smooth scroll. Watch for `data-lenis-prevent` blocking page scroll — it blocks all axes, which broke scrolling on the sister store.
7. **SEO and schema** parity check against the §"SEO" list.
8. **Mobile verification** per §5.
9. **Cutover**: deploy to Oxygen, smoke-test on the `*.myshopify.dev` preview URL, then point DNS. Keep the Vercel deployment live as rollback.

## Ground rules

- **Never invent social proof.** No fabricated reviews, ratings, stock counts, "X people viewing", or purchase notifications. If a component needs data the store does not have, say so and leave it out. The sister store had to strip fake reviews and a fake purchase toast after a Merchant Center disapproval.
- **Never state a claim the product data does not support.** Check anything about materials, fabric, guarantees or returns windows against Shopify and the policy pages. `npm run check:seo` already exists (`scripts/check-seo-claims.mjs`) — read it, keep it, and run it after any copy change.
- **Deploys are manual**: `npx shopify hydrogen deploy --env production`. Pushing to git does not deploy. Verify on the live URL after every deploy, not just locally.
- **Verify before reporting.** Do not tell me something works because the code looks right — fetch the page, check the response, and show me the output. If a test contradicts your expectation, investigate rather than explaining it away.
- Match the existing code's comment density and naming. Explain *why* in comments, not *what*.
- Commit in logical steps with real messages. Do not `git add -A` blindly; this repo has `.env.local`, `node_modules`, `android/`, `ios/`, `.output` and `dist-mobile` in it.

## Decisions to bring to me, not assume

1. Whether the offline product fallback is genuinely needed for the mobile apps (§1).
2. Whether to keep `/policies/$policy` alongside the individual policy routes, or consolidate.
3. Whether Trousseau Builder and Blouse Customization write anything to Shopify (cart attributes / line-item properties) or are display-only — this changes how they port.
4. Cutover timing, given the mobile apps follow the domain (§5).

## First reply

Before writing any code, give me:

- A route-by-route migration table: path → Hydrogen route file → risk (low/medium/high) → note.
- What you found in `shopify.ts` that does not map cleanly onto Hydrogen's client.
- Anything in this prompt that is already out of date.
- The three things most likely to break at cutover, and how you will verify each.

Then start at step 1 and stop for my confirmation before step 3.
