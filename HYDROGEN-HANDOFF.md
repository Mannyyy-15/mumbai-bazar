# Mumbai Baazar — Shopify Hydrogen Migration Master Handoff

**Project:** Mumbai Baazar Storefront Migration  
**Live Production Site:** [https://mumbaibazar.com](https://mumbaibazar.com) (TanStack Start / React 19 / Tailwind v4)  
**Target Architecture:** Shopify Hydrogen on Oxygen (React 18 / React Router 7 / Tailwind v4)  
**Repository Workspace Root:** `d:\ThePieCraft Marketing\Web Development\Mumbai Baazar`  
**Hydrogen Directory:** `d:\ThePieCraft Marketing\Web Development\Mumbai Baazar\hydrogen`  
**Original TanStack Source Directory:** `d:\ThePieCraft Marketing\Web Development\Mumbai Baazar\src`  
**Date of Handoff:** 28 September 2026  

---

## 1. Executive Summary & Objective

The objective is an **EXACT SAME TO SAME** migration of Mumbai Baazar from TanStack Start to Shopify Hydrogen on Oxygen.
- **Zero Visual Discrepancy:** The design, colors (`#641F2A` royal maroon, `#D4AF37` rich gold, `#FAF7F2` warm ivory), fonts (`Cormorant Garamond` + `Plus Jakarta Sans`), margins, borders, and animations match 100%.
- **Mobile-First Priority:** Touch-friendly buttons, bottom navigation tab bar, sticky floating actions on Product Detail Pages (PDP), smooth drawer transitions, and safe-area padding (`pb-safe`).
- **Full Tracking Parity:** Meta Pixel ID `1663032738861857` is injected in `root.tsx` with automated route-transition pageview tracking.
- **Error-Free Execution:** Zero 500 server errors, clean SSR, clean hydration, and all interactive buttons fully wired.

---

## 2. Storefront Credentials & Configuration

Stored in `hydrogen/.env` (configured directly from Oxygen deployment settings) and
mirrored in the password manager under `Mumbai Baazar / Shopify`.
**Secrets are redacted here — this file is committed to git.**

```env
SESSION_SECRET="<redacted - password manager>"
PUBLIC_STORE_DOMAIN="1ttsg4-3a.myshopify.com"
PUBLIC_STOREFRONT_API_TOKEN="<redacted - password manager>"
PUBLIC_STOREFRONT_ID="1000181071"
PUBLIC_STOREFRONT_API_VERSION="2024-10"
PRIVATE_STOREFRONT_API_TOKEN="<redacted - password manager>"
PUBLIC_CUSTOMER_ACCOUNT_API_CLIENT_ID="3d696a70-41ac-49ab-ab9a-0a8e7600b592"
PUBLIC_CUSTOMER_ACCOUNT_API_URL="https://shopify.com/80711974948"
SHOP_ID="80711974948"
PUBLIC_META_PIXEL_ID="1663032738861857"
```

> **Note on Storefront Domain:** `1ttsg4-3a.myshopify.com` is the Shopify backend domain linked to Oxygen (Store ID `80711974948`), which is the canonical store for `mumbai-baazar-store.myshopify.com`.

---

## 3. Investigation & Resolution of the "Oops 500 Unexpected Server Error"

During local preview, a 500 error was observed. The exact causes were diagnosed and permanently resolved:

1. **`fetcher is not defined` in `ProductCard.tsx` (Line 204):**
   - **Root Cause:** When converting `<CartForm>` to a programmatic `useFetcher().submit(...)` button to prevent nested HTML anchor/form hydration conflicts, `const fetcher = useFetcher();` was missing inside the component body. During SSR, evaluating `fetcher.state` threw a `ReferenceError`, triggering the route error boundary.
   - **Fix Applied:** Added `useFetcher` import from `react-router` and instantiated `const fetcher = useFetcher();` in `ProductCard.tsx`.
2. **`unauthenticated_read_product_inventory` Access Denied in `shopify.server.ts`:**
   - **Root Cause:** The GraphQL query `PRODUCT_FRAGMENT` requested `quantityAvailable` on product variants. The public Storefront API token did not have the unauthenticated inventory scope, causing Shopify GraphQL to return an `Access denied for quantityAvailable field` error.
   - **Fix Applied:** Removed `quantityAvailable` from `PRODUCT_FRAGMENT`. Variant availability is determined via `availableForSale` which is fully permitted and standard in Hydrogen.
3. **Route Collision on `/collections`:**
   - **Root Cause:** Both `collections.tsx` and `collections._index.tsx` existed simultaneously. In React Router v7, `collections.tsx` was treated as an outlet-less layout, causing `/collections/$handle` to return 404.
   - **Fix Applied:** Removed redundant `collections.tsx`. `collections._index.tsx` serves `/collections`, while `collections.$handle.tsx` handles redirects to category pages (`/wedding-sarees`, `/silk-sarees`, etc.).
4. **Customer Account Login Fallback:**
   - **Root Cause:** If Customer Account API keys are not linked or redirect URIs are mismatched on localhost, `context.customerAccount.login` throws.
   - **Fix Applied:** Wrapped `account_.login.tsx` and `account.tsx` in try/catch with graceful redirects instead of crashing.

---

## 4. Hardcoded Data Audit (`src/`) vs Live Shopify Data

Per client instruction: *"whatever was there, which was hardocded or stuff , tell me what it was first , then i ll tell you to convert it into real in shopify and stuff , no current function or anythng should be lost or etc."*

Here is the exhaustive inventory of what was hardcoded in `src/`:

### A. Static Product Cache (`src/lib/shopify-catalog-data.ts`)
- **What it was:** A 2,644-line hardcoded JSON snapshot of 34 products with static rupee prices, static variant IDs, and offline descriptions.
- **Why it was there:** To support Capacitor mobile app offline browsing and instant hydration before GraphQL queries completed.
- **Current Hydrogen Status:** Replaced with live GraphQL querying (`fetchLiveProducts` in `shopify.server.ts`) with fallback support.

### B. High-Resolution Marketplace Galleries (`src/lib/product-enrichment.ts`)
- **What it was:** `FLIPKART_GALLERIES` mapping table providing 4 to 8 multi-angle high-resolution photographs for sarees where the Shopify admin catalog only had 1 or 2 images.
- **Current Hydrogen Status:** Fully ported into `hydrogen/app/lib/product-enrichment.ts`. When a product handle matches, it automatically provides the rich multi-angle gallery while retaining live Shopify pricing, inventory, and variant IDs.
- **Future Shopify Plan:** Once the client uploads all multi-angle images directly to Shopify Admin Products, this file can be deprecated.

### C. Homepage Boutique Marketing Sections (`src/routes/index.tsx`)
- **`HERO_SLIDES`:** 3 editorial slides ("Volume I: Heirloom Banarasi", "Volume II: Royal Kanjivaram", "Volume III: 1-Minute Saree").
- **`CATEGORIES`:** 4 visual category cards (Banarasi Silk, Bridal Kanjivaram, Paithani, Ready to Wear).
- **`TRENDING_SAREES`:** 8 hand-curated pieces with #1 to #8 ranking badges.
- **`OCCASIONS`:** 6 occasion cards (Bridal, Festive & Puja, Reception, Everyday & Casual, Office, Party).
- **`WEAVES`:** 8 weave marquee cards (Banarasi, Kanjivaram, Paithani, Cotton Silk, Organza, Kalamkari, Chanderi, Maheshwari).
- **`STORE_VISIT_BANNER`:** Photo, directions, and timings for the Tiwari Nagar, Nalasopara East flagship studio.
- **`TESTIMONIALS`:** 3 verified client reviews.
- **`INSTAGRAM_REELS`:** 5 video reel preview cards.
- **Future Shopify Plan:** These can be migrated to Shopify Metaobjects or Hydrogen CMS entries when the client requests.

### D. Collections Curated Cards (`src/routes/collections.tsx`)
- **`CURATED_CARDS`:** 11 styled cards with pastel background colors (`bg-[#FAF1EB]`, `bg-[#FDF6F0]`, etc.), titles, and descriptions.
- **`FILTER_TABS`:** 5 tabs (All, Bridal & Wedding, Heritage Weaves, Festive & Party, Daily & Ready to Wear).

### E. Store Outlets & Locations (`src/lib/locations.ts`)
- **`PUBLISHED_OUTLETS`:** 8 retail boutique outlets with street addresses, landmarks, phone numbers, and coordinates across Nalasopara, Virar, Vasai, Bhayandar, and Goregaon.
- **Future Shopify Plan:** Can be moved to Shopify Metaobjects or a Store Locator app.

### F. Customer Service FAQs (`src/routes/contact.tsx`, `src/routes/faq.tsx`)
- **`CONTACT_FAQS` & `FAQ_ITEMS`:** 5 to 15 questions covering video shopping consultations, custom blouse stitching, shipping timelines, and return policy.

---

## 5. Page-by-Page Interactive Button & Flow Behavior

Every button across the migrated application has been verified for correct UX behavior:

### Global Header (`Header.tsx`)
- **Search Button / Input:** Expands live search bar or navigates to `/search?q=...`.
- **Wishlist Heart Icon:** Opens the luxury Wishlist Drawer (`WishlistDrawer.tsx`) displaying saved sarees stored in `localStorage`.
- **Shopping Bag Icon:** Opens the luxury Cart Drawer (`Aside.tsx` + `CartMain.tsx`).
- **Mega Menu Navigation:** Hovering/tapping top-level links reveals rich multi-column category grids with featured drapes.

### Shop Page (`shop.tsx`)
- **Price Presets ("Under ₹1,500", "₹1,500 - ₹3,000", etc.):** Filter product grid instantly.
- **Custom Price Input (Min / Max):** Entering numbers and clicking "Go" filters by custom rupee range.
- **Fabric & Weave Checkboxes:** Toggle multiple weave filters simultaneously (Banarasi, Kanjivaram, Paithani, etc.).
- **Dynamic Color Swatches:** Dual-tone and solid color circles with live product count badges `(N)`. Clicking toggles color filters.
- **Active Filter Chips:** Each active filter renders a pill with an `X` icon. Clicking removes that single filter.
- **Reset All / Clear All:** Clears all active filters in one tap.
- **Sort Dropdown:** Sorts by "Featured", "Price: Low to High", "Price: High to Low", and "Alphabetical".
- **Mobile Filter Button:** Opens full-screen slide-over drawer with all filters and a sticky "Show X Sarees" footer button.

### Product Card (`ProductCard.tsx`)
- **Card Click:** Navigates to `/products/${handle}`.
- **Heart Icon:** Toggles saree in/out of wishlist with haptic feedback.
- **Color Dots:** Switches displayed swatch preview.
- **"Shop Now" Button:** Programmatically submits a line-add to `/cart` via `useFetcher`, updates cart quantity badge, and opens the Cart Drawer without page refresh.

### Product Detail Page (`products.$handle.tsx`)
- **Vertical Thumbnail Rail (Desktop) / Horizontal Swipe (Mobile):** Clicking or tapping a thumbnail switches the main image with a 0ms crossfade.
- **Color Swatch Selector:** Switches selected variant, price, and active image.
- **Quantity Stepper (`-` / `+`):** Increases or decreases quantity.
- **"Shop Now" Maroon Button:** Adds selected variant and quantity to cart and slides open the Cart Drawer.
- **"Buy It Now" Gold Outlined Button:** Direct checkout redirect.
- **WhatsApp Styling Consultation Button (`#25D366`):** Launches `https://wa.me/919324707245` with pre-filled text including saree title and handle.
- **Accordions ("The Craft", "Care Instructions", "Shipping & Delivery"):** Expand and collapse smoothly.
- **Mobile Floating Bottom Bar:** Appears when scrolling past the main CTA; includes live price, strike-through, and sticky "Shop Now" button.

### Cart Drawer (`Aside.tsx`, `CartMain.tsx`, `CartLineItem.tsx`, `CartSummary.tsx`)
- **Quantity Stepper (`-` / `+`):** Submits line-update mutation to Shopify Cart API.
- **Trash2 Icon:** Submits line-remove mutation to remove the item.
- **"Shop Now" (Proceed to Checkout):** Redirects to Shopify secure checkout URL (`cart.checkoutUrl`).
- **"Order via WhatsApp":** Formats entire cart contents (item names, quantities, unit prices, total amount) and opens WhatsApp directly to `+91 9324707245`.
- **Close Button (`X`) & Backdrop:** Closes drawer and restores body scroll.

### Collections Page (`collections._index.tsx`)
- **Filter Tabs ("All", "Bridal & Wedding", "Heritage Weaves", etc.):** Filters the 11 curated cards instantly without page reload.
- **Curated Card Buttons:** Direct to corresponding collection or filtered shop query.

---

## 6. Route Verification Status (All Passing 200 OK)

| Route | Status | Notes |
|---|---|---|
| `/` | **200 OK** | Full 17-section luxury boutique homepage |
| `/shop` | **200 OK** | 882-line catalog with sticky filters and dynamic swatches |
| `/collections` | **200 OK** | 11 curated cards with filter tabs |
| `/collections/:handle` | **301 Redirect** | Redirects to category page or filtered shop |
| `/products/meher-wine-banarasi-silk-saree` | **200 OK** | High-res Flipkart gallery override, swatches, WhatsApp CTA |
| `/about` | **200 OK** | 494 lines with stats, pillars, weaving clusters, timeline |
| `/our-story` | **200 OK** | Maroon hero banner, philosophy pillars, editorial quote |
| `/contact` | **200 OK** | Form, 3 action cards, flagship studio, 8 outlets, 5 FAQs |
| `/cart` | **200 OK** | Full luxury cart page and drawer |
| `/care-guide` | **200 OK** | Silk preservation and dry cleaning instructions |
| `/faq` | **200 OK** | Complete customer questions accordion |
| `/trousseau-builder` | **200 OK** | Interactive trousseau bundle selector |
| `/stores` | **200 OK** | Directory of 8 Mumbai retail boutiques |
| `/stores/virar` | **200 OK** | Virar boutique details, timings, and map |
| `/wedding-sarees` | **200 OK** | Bridal drapes with filter sidebar |
| `/silk-sarees` | **200 OK** | Heritage silk category with filter sidebar |
| `/festive-edit` | **200 OK** | Festive and celebration collection |
| `/everyday-sarees` | **200 OK** | Daily and ready-to-wear sarees |
| `/new-arrivals` | **200 OK** | Latest saree drops |
| `/search` | **200 OK** | Live search with search terms |
| `/sitemap.xml` | **200 OK** | XML sitemap covering all routes |
| `/robots.txt` | **200 OK** | Search crawler indexing directives |
| `/llms.txt` | **200 OK** | LLM discoverability index |

---

## 7. How to Resume Work (For Next AI or Developer)

### Step 1: Start the Local Hydrogen Preview Server
```bash
cd "d:\ThePieCraft Marketing\Web Development\Mumbai Baazar\hydrogen"
npx shopify hydrogen preview
```
The server will run at `http://localhost:3000`.

### Step 2: Test in Browser
1. Open `http://localhost:3000` (use hard refresh `Ctrl + Shift + R` if your browser has cached old scripts).
2. Visit `/shop` and test filter checkboxes, color swatches, and active chips.
3. Visit `/products/meher-wine-banarasi-silk-saree` and test swatches, thumbnails, and "Shop Now".
4. Open the Cart Drawer by clicking the bag icon in the top header. Test quantity steppers and WhatsApp checkout button.

### Step 3: Production Deployment to Oxygen
When the client approves the preview:
```bash
cd "d:\ThePieCraft Marketing\Web Development\Mumbai Baazar\hydrogen"
npx shopify hydrogen deploy --env production
```
Oxygen will build and deploy the worker bundle directly to the live Shopify infrastructure.
