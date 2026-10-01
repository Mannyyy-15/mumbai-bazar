# Mumbai Bazar — SEO Action Plan

Last updated: 2026-10-01 · Site: https://www.mumbaibazar.com (Hydrogen on Oxygen)

What is already done in code is at the bottom. Everything above it needs a
person: the client's accounts, the client's knowledge of their own business, or
outreach to other websites. **Backlinks cannot be created by editing this site** —
they are earned on other sites, so this file lists exactly where and how.

Ordered by impact per hour.

---

## Week 1 — do these first (≈4 hours total, biggest wins)

### 1. Google Business Profile — the single highest-value SEO action
Google's AI Overview currently says Mumbai Bazar has *no official website*. That is
an entity problem, not a website problem, and GBP is how it is fixed.

For **each** of the 4 verified stores (Nalasopara East, Virar West, Bhayandar East,
Goregaon West):

- [ ] Claim / verify the listing at business.google.com
- [ ] **Website field:** the store's own page, not the homepage —
      `https://www.mumbaibazar.com/stores/nalasopara` (etc.). This ties each
      listing to the page that ranks for "saree shop in nalasopara east".
- [ ] **Name exactly "Mumbai Bazar"** — single "a". No keywords stuffed into the
      name (Google suspends listings for that).
- [ ] Primary category **Sari Shop**; secondary **Clothing Store**, **Bridal Shop**
- [ ] Hours identical to the website (`SITE.hours` in `app/lib/seo.ts`).
      **Confirm the real hours with each store first** — this has never been done.
- [ ] 15+ real photos per store: storefront, interior, racks, staff draping
- [ ] Add products (top 10 sarees) with prices linking to their product pages
- [ ] Post weekly: new arrivals, Navratri, Diwali. Each post links to a page.

### 2. Reviews — ask every in-store customer
Rankings in the local map pack follow review **count and recency** more than
anything on the website.

- [ ] Print a QR code to each store's GBP review link; put it at the billing counter
- [ ] Staff ask at billing: "If you liked shopping with us, a Google review helps us a lot"
- [ ] Reply to every review within 48 hours, good or bad
- [ ] Target: 10 new reviews per store per month
- ⚠️ Never buy reviews or offer discounts for reviews — Google removes them and can
  suspend the listing.

### 3. Search Console
- [ ] Add the **www** property (`https://www.mumbaibazar.com`) — the site now serves
      www, but verification was set up on the apex
- [ ] Submit `https://www.mumbaibazar.com/sitemap.xml`
- [ ] URL Inspection → **Request indexing** for these, in this order:
      1. `/guides/navratri-colours-2026` — **urgent, Navratri starts 11 October**
      2. `/sarees-under-1000`
      3. `/sarees-in/vasai-virar`
      4. `/faq`
- [ ] Also add the site to **Bing Webmaster Tools** (import from GSC in one click) —
      Bing feeds ChatGPT search and Copilot

### 4. Fix the 15 "Rajwadi" products in Shopify admin
The code now writes proper meta descriptions for these, but the product data itself
is still weak:

- [ ] **6 products share the identical title** "Women's Kalamkari-Style Multicolor
      Printed" (rajwadi-2704, -2719, -2726, -2755, -2810, -2811). Google treats them
      as duplicates and will rank one at best. Give each a distinct name with its
      colour/motif, like the others ("Neel Tarang Turquoise Blue…").
- [ ] **URLs are supplier codes** (`/products/rajwadi-2688`). In Shopify admin,
      edit each product's URL handle to match its name — e.g.
      `rangrez-multicolour-patchwork-printed-art-silk-saree`.
      **Tick "Create a URL redirect"** when you do, or the old URL 404s.
- [ ] Replace the one-word descriptions ("Pink", "Blue") with 2–3 real sentences:
      fabric, border, occasion, care.

---

## Weeks 2–4 — backlinks and citations (where links actually come from)

Rule for all of these: **identical name, address and phone everywhere**. Copy them
from `app/lib/locations.ts`. Mismatches across directories weaken local ranking.

### Directory citations (free, ~20 min each)
| Site | Why | Notes |
|---|---|---|
| **JustDial** | Highest-traffic local directory in India | Existing Nalasopara listing says "Mumbai **Bazaar**" — correct it to "Mumbai Bazar" |
| **Sulekha** | Ranks on page 1 for "saree shop vasai virar" | Claim/create each store |
| **Bing Places** | Feeds Bing, Copilot, ChatGPT | Can import from GBP |
| **Apple Business Connect** | Apple Maps on iPhone | Free |
| **Magicpin** | Local discovery in Mumbai suburbs | |
| **Facebook page** | Citation + link | Address + website filled in |
| **Instagram bios** (both store accounts) | Traffic + entity signal | Link to the store page, not just the homepage |

### Wedding directories (high relevance for the in-store bridal range)
| Site | Category to list under |
|---|---|
| **WedMeGood** | Mumbai → Bridal Wear → *Wedding Sarees* — free vendor sign-up |
| **WeddingWire India / ShaadiSaga** | Bridal wear, Mumbai |

Use real photos of in-store bridal pieces. These listings link to the site and are
exactly where brides research before visiting a shop.

### Local press and content links (slower, strongest links)
- [ ] Pitch the **Navratri colours guide** and the **Vasai-Virar shopping guide** to
      local outlets that cover the area: Mid-Day, Free Press Journal, Lokmat, local
      Vasai-Virar news pages and Instagram pages. Angle: "8-store local business,
      16 years on the Western line" — a real local story.
- [ ] Sponsor or supply sarees for a local event (college farewell, Navratri garba,
      society function) in exchange for a credited mention with a link
- [ ] Ask your fabric suppliers and any brands you stock to list you as a stockist
      on their websites

### What NOT to do
- ❌ Buying links, "SEO packages" selling 500 backlinks, PBNs — Google penalises these
- ❌ Fake reviews, or reviews written by staff
- ❌ Keyword-stuffing the GBP name ("Mumbai Bazar Best Saree Shop Vasai Virar")

---

## Content — next pages to write (in order of demand seen in Google autocomplete)

| Page | Searches it targets | Notes |
|---|---|---|
| Diwali saree guide 2026 | "diwali saree collection 2026", "diwali saree look" | Publish by **15 October**; Diwali is early November |
| Saree for farewell | "saree for farewell", "saree under 1000 for farewell" | Strong fit for current stock |
| Office wear sarees | "office wear saree for women", "office wear sarees online" | Point at `/everyday-sarees` |
| Which saree for wedding / engagement / reception | "which saree is best for wedding/engagement/reception" | Answer-style guide |
| Haldi / Mehendi saree | "haldi saree for bride", "mehendi saree" | Yellow/green stock exists |
| Nauvari saree | "nauvari saree shop in vasai", "…in goregaon west" | **Only if the stores stock nauvari** — ask first |
| Wholesale | "wholesale saree shop in virar west / vasai west" | **Only if Mumbai Bazar genuinely sells wholesale** |

---

## ⚠️ Facts that need confirming with the client

These are on the live site, some inside FAQPage schema where Google reads them as
factual claims about the business. They were written as reasonable estimates and
**have never been confirmed**:

- [ ] **In-store price bands** on `/faq`, `/sarees-in/vasai-virar` and the Vasai-Virar
      guide: "bridal ₹12,000–₹40,000+", "designer lehengas ₹5,000–₹15,000",
      "sarees from ₹800". The online shop only sells ₹649–₹1,699, so these describe
      the stores — are they right?
- [ ] **Store hours**: 10:00–21:00 daily, all stores
- [ ] Does the bridal range really sit at Nalasopara East as the largest?
- [ ] Are blouse stitching and fall-and-pico offered at every store?
- [ ] **7-day exchange** and **free delivery on prepaid** — confirm both, and that the
      ₹50 COD fee is configured in Shopify admin (the site only *states* it)

---

## Already done in code (2026-10-01)

- Full crawl of all 103 sitemap URLs: all 200, self canonicals, one H1, schema, none noindexed
- **Fixed: every guide had empty H2 headings** and never rendered its tables or
  step-by-step sections — the site's main ranking content was missing its structure
- **Fixed: product meta descriptions** were one word ("Pink") for 15 products
- `/wedding-sarees` and `/silk-sarees` rewritten to match what is actually sold online
- **New `/sarees-under-1000`** (47 products) — linked from the main navigation
- **New Navratri 2026 colours guide**, each colour linked to matching stock
- Meta descriptions clamped site-wide; 8 over-long titles shortened; store titles extended
- SEO claim guard (`npm run check:seo`) blocks unverifiable claims from returning

## Measuring it

Re-export Search Console in **4 weeks** and compare against the baseline
(30 Aug – 6 Sep 2026: 799 impressions, 15 clicks, homepage CTR 2.07%, **zero**
impressions for "saree shop vasai virar" / "saree shop near me"). The numbers to watch:

1. Impressions for non-brand local queries moving off zero
2. Homepage CTR moving off 2%
3. Impressions for "saree under 1000" and "navratri colours 2026"
