/**
 * Native app identity — the single source of truth for both stores.
 *
 * Deep linking only works if three things agree exactly:
 *
 *   1. the app id / bundle id compiled into the binary,
 *   2. the signing certificate fingerprint of the build that ships,
 *   3. the verification file served from https://mumbaibazar.com/.well-known/.
 *
 * They were previously spread across capacitor.config.ts, AndroidManifest.xml
 * and nothing at all (neither verification file existed, so the manifest's
 * `autoVerify="true"` silently failed and every link opened in Chrome instead
 * of the app). Keeping the values here means the served files cannot drift from
 * the binaries.
 */

/** Android application id. Must equal `applicationId` in android/app/build.gradle. */
export const ANDROID_APP_ID = "com.mumbaibazar.store";

/** iOS bundle id. Must equal PRODUCT_BUNDLE_IDENTIFIER in the Xcode project. */
export const IOS_BUNDLE_ID = "com.mumbaibazar.store";

/**
 * Apple Developer Team ID — the 10-character string on the membership page at
 * developer.apple.com/account (Membership details → Team ID).
 *
 * EMPTY UNTIL THE CLIENT ENROLS. While it is empty the Apple verification file
 * is served as a 404 rather than as JSON naming a fake team: a malformed
 * apple-app-site-association is worse than a missing one, because iOS caches
 * the bad copy through its CDN and Universal Links stay broken after you fix
 * it. Fill this in, redeploy, THEN add the Associated Domains capability in
 * Xcode.
 */
export const APPLE_TEAM_ID = "";

/**
 * SHA-256 fingerprints of the certificates that sign the Android app.
 *
 * Get them with:
 *   keytool -list -v -keystore <upload-keystore.jks> -alias <alias>
 *
 * You normally need TWO entries once the app is live:
 *   - your upload key (what you sign the AAB with locally), and
 *   - the Play App Signing key, which Google generates and shows under
 *     Play Console → Release → Setup → App signing.
 * Android accepts a link as verified if it matches ANY listed fingerprint, so
 * listing both means internal testing builds and Play builds both work.
 *
 * EMPTY UNTIL THE KEYSTORE EXISTS. While empty, /.well-known/assetlinks.json
 * is served as a 404 — see the note on APPLE_TEAM_ID for why a placeholder is
 * worse than nothing.
 */
export const ANDROID_CERT_FINGERPRINTS: string[] = [];

/** True once Android App Links can actually verify. */
export const androidLinksReady = () => ANDROID_CERT_FINGERPRINTS.length > 0;

/** True once iOS Universal Links can actually verify. */
export const appleLinksReady = () => APPLE_TEAM_ID.length > 0;

/**
 * Paths the apps should open natively. Everything else stays in the browser.
 * Kept narrow on purpose: claiming paths the app cannot render well (checkout,
 * policy pages) makes for a worse experience than letting the browser have
 * them.
 */
export const DEEP_LINK_PATHS = [
  "/",
  "/shop",
  "/products/*",
  "/collections",
  "/stores",
  "/stores/*",
  "/sarees-in/*",
  "/new-arrivals",
  "/wedding-sarees",
  "/silk-sarees",
  "/everyday-sarees",
  "/festive-edit",
  "/guides",
  "/guides/*",
];
