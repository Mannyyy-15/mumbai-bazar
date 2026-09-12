import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.mumbaibazar.store",
  appName: "Mumbai Bazar",
  webDir: "dist-mobile",
  server: {
    url: process.env.CAPACITOR_SERVER_URL || "https://mumbaibazar.com",
    androidScheme: "https",
    cleartext: false,
  },
  plugins: {
    StatusBar: {
      style: "DARK",
      backgroundColor: "#9B1018",
      overlaysWebView: false,
    },
    SplashScreen: {
      launchShowDuration: 1800,
      launchAutoHide: true,
      backgroundColor: "#FFFDF8",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: false,
    },
  },
};

export default config;
