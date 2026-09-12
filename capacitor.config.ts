import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.mumbaibazar.store",
  appName: "Mumbai Bazar",
  webDir: "dist-mobile",
  server: {
    url: process.env.CAPACITOR_SERVER_URL || "https://mumbaibazar.com",
    androidScheme: "https",
    cleartext: false,
    /**
     * Hosts the webview may navigate to. Anything NOT listed is blocked with no
     * visible error — the user just gets a blank screen.
     *
     * This list previously stopped at Shopify and Google Fonts, which meant
     * checkout could dead-end: Shopify hands off to shop.app and then to the
     * payment gateway, and this site documents Razorpay, Shopify Payments and
     * UPI (GPay / PhonePe / Paytm) as accepted methods. None of those hosts
     * were reachable, and payment is the worst possible place to lose someone.
     *
     * Keep this in sync with whatever the Shopify checkout actually redirects
     * through; when in doubt, watch a real ₹1 order in the device console and
     * add any host that 404s.
     */
    allowNavigation: [
      // Our own site
      "mumbaibazar.com",
      "*.mumbaibazar.com",

      // Shopify storefront, checkout and assets
      "*.myshopify.com",
      "checkout.shopify.com",
      "*.shopify.com",
      "cdn.shopify.com",
      "shop.app",
      "*.shop.app",
      "shopifycdn.com",
      "*.shopifycdn.com",

      // Payment gateways. Razorpay and Shopify Payments are both named in our
      // privacy policy and terms; 3-D Secure steps also bounce through the
      // issuing bank, which is why the ACS hosts are here.
      "razorpay.com",
      "*.razorpay.com",
      "api.razorpay.com",
      "checkout.razorpay.com",

      // UPI / wallet handoffs listed in our terms of service
      "*.phonepe.com",
      "*.paytm.in",
      "*.paytm.com",
      "*.googleapis.com",
      "pay.google.com",

      // Fonts and static assets
      "fonts.googleapis.com",
      "fonts.gstatic.com",
    ],
  },
  plugins: {
    StatusBar: {
      style: "DARK",
      backgroundColor: "#9B1018",
      overlaysWebView: false,
    },
    SplashScreen: {
      /**
       * launchAutoHide is false on purpose.
       *
       * With auto-hide on a timer, the splash disappeared after 1800ms whether
       * or not the page had loaded — and because this app fetches the live site
       * over mobile data, that regularly meant splash -> white gap -> content.
       * That white gap is the most "website in a frame" moment of the launch.
       *
       * Now native-bridge.ts hides it once the page is actually up, handing
       * straight over to the in-page preloader, which shares the same ivory
       * background so there is no visible seam. The timeout in that code is the
       * safety net against a hang.
       */
      launchShowDuration: 3000,
      launchAutoHide: false,
      backgroundColor: "#FFFDF8",
      androidSplashResourceName: "splash",
      // CENTER, not CENTER_CROP: the logo is artwork with margins, and
      // cropping to fill chops its edges on tall screens.
      androidScaleType: "CENTER",
      showSpinner: false,
      splashFullScreen: false,
      splashImmersive: false,
    },
  },
};

export default config;
