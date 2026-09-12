# Shipping the Mumbai Bazar apps

Everything in the repo is build-ready. What is left is account setup and two
credentials that can only come from those accounts.

The apps are **Capacitor** — the native shell loads `https://mumbaibazar.com`
in a webview, with native status bar, splash, haptics, Android back-button
handling and external-app links on top. Content changes on the website appear
in the apps immediately, with no resubmission.

---

## Before you start: costs and hard requirements

| | Google Play | Apple App Store |
|---|---|---|
| Account | $25 one-time | $99/year |
| Build machine | Any OS | **macOS required** (or a cloud Mac) |
| Review time | Hours to ~3 days | ~24–48 hours typical |
| Rejection risk for this app | Low | **Moderate — see "The Apple problem"** |

There is no way around the Mac for iOS. If the client has none, use a cloud
build service (Codemagic, Ionic Appflow and EAS all handle Capacitor) — the
project needs no changes for that.

---

## The Apple problem — read this before submitting to Apple

Apple **Guideline 4.2 (Minimum Functionality)** rejects apps that are
essentially a repackaged website. This app loads the website in a webview, so it
is squarely in that territory. It already does more than a bare wrapper —
haptics, native splash and status bar, hardware back-button handling, external
app hand-off for calls/WhatsApp/Maps — but that is often not enough on its own.

To materially improve the odds, add at least one thing the website genuinely
cannot do. In rough order of effort-to-benefit:

1. **Push notifications** for order updates and new arrivals
   (`@capacitor/push-notifications` + Firebase). This is the single strongest
   signal, and it is genuinely useful for a retail app.
2. **Offline browsing** of recently-viewed products.
3. **App-only offers** — a discount code that exists only in the app.
4. **Native share** of a product (`@capacitor/share`).

Google Play is much more relaxed about this; the Play submission is low risk
either way.

**Recommended sequence:** ship to Play first, get the client a live app, then
add push notifications before going to Apple. A rejection is not fatal — you can
reply and resubmit — but each round trip costs days.

---

## Push notifications (Firebase) — 10 minutes, free

The code is written and wired. It needs one file the client has to generate.

1. console.firebase.google.com → **Add project** → name it "Mumbai Bazar".
   Google Analytics is optional; skip it if unsure.
2. In the project, **Add app → Android**.
   - Package name: `com.mumbaibazar.store` (must match exactly)
   - Nickname and SHA-1 can be left blank for now
3. Download **`google-services.json`** and drop it at
   `android/app/google-services.json`.
4. Rebuild. That is all — the Gradle plugin only activates when the file is
   present, which is why the app builds and runs fine without it today.

### Sending a notification

Firebase console → **Messaging** → New campaign → Notifications.
Target **Topic: `all-customers`** — every install subscribes to it, so the shop
can broadcast "new bridal range in at Nalasopara" with no backend at all.

To make a notification open a specific page, add a custom data key:

| Key | Value |
|---|---|
| `path` | `/sarees-in/vasai-virar` |

Only same-origin paths are followed, so a bad payload cannot redirect the app
off-site.

### Important: the app does not prompt on launch

`initializePush()` attaches listeners; it never asks for permission. Asking
during launch is how you get denied, and on iOS a denial is near-permanent.
Call `requestPushPermission()` after the customer does something that implies
interest — places an order, saves to wishlist, or taps an explicit "notify me".
That call is ready; wire it to whichever control you prefer.

### Should `google-services.json` be committed?

It contains no secret — it is shipped inside the APK and is extractable from it.
Committing it is normal practice and keeps CI builds working. Leave it out only
if the client prefers.

---

## App updates

Two separate things, and only the second needs a release:

**Web content** — prices, products, copy, layout — updates the instant the site
deploys, because the shell loads `mumbaibazar.com`. Nothing to do.

**The native shell** — plugins, permissions, splash, targetSdk — needs a store
release. `src/routes/app-version[.]json.ts` is how old installs find out:

1. Ship the new build to the store.
2. Bump `version` in that file and deploy the website.
3. Installs on the old version see the prompt within a day.

Set `minimum` equal to `version` **only** to force an upgrade (a broken or
unsafe build) — it makes the prompt non-dismissable.

Play In-App Updates was deliberately not used: it requires the app to have been
installed *by Play*, so it silently does nothing for the sideloaded APK you are
about to test, and there is no iOS equivalent at all.

---

## Step 1 — Google Play

### 1a. Create the signing key (once, and never lose it)

```bash
keytool -genkey -v -keystore mumbaibazar-upload.jks \
  -keyalg RSA -keysize 2048 -validity 10000 -alias mumbaibazar
```

Store the `.jks` file and its passwords in the client's password manager.
**If this key is lost, the app can never be updated again** — a new key means a
new listing. `*.jks` and `keystore.properties` are gitignored; keep it that way.

Then create `android/keystore.properties` (gitignored):

```properties
storeFile=/absolute/path/to/mumbaibazar-upload.jks
storePassword=...
keyAlias=mumbaibazar
keyPassword=...
```

The Gradle build picks this up automatically. Without the file the release build
still compiles, just unsigned — so CI does not break.

### 1b. Build the bundle

```bash
npm run cap:sync                       # regenerates the offline fallback, syncs native
cd android
./gradlew bundleRelease -PversionCode=1 -PversionName=1.0.0
```

Output: `android/app/build/outputs/bundle/release/app-release.aab`

Bump `versionCode` on **every** upload — Play rejects a repeat.

### 1c. Turn on deep links

After the first upload, Play Console → Release → Setup → **App signing** shows
the SHA-256 fingerprint of the key Google signs with. Add it — plus your own
upload-key fingerprint from
`keytool -list -v -keystore mumbaibazar-upload.jks -alias mumbaibazar` — to
`ANDROID_CERT_FINGERPRINTS` in `src/lib/mobile-app.ts`, then deploy the website.

Verify it is live:

```bash
curl https://mumbaibazar.com/.well-known/assetlinks.json
```

Until a fingerprint is set this URL returns **404 on purpose** — publishing an
empty file makes Android cache a failed verification, which then needs a
reinstall to clear.

### 1d. Play listing needs

- Privacy policy URL: `https://mumbaibazar.com/privacy-policy` (live)
- Data safety form — the app collects no data itself; Shopify checkout handles
  payment
- Screenshots: at least 2 phone shots; 1024×500 feature graphic; 512×512 icon
- No account system, so the account-deletion requirement does not apply

---

## Step 2 — Apple App Store

### 2a. Enrol and get the Team ID

developer.apple.com → Membership → **Team ID** (10 characters).
Put it in `APPLE_TEAM_ID` in `src/lib/mobile-app.ts` and deploy the website.

```bash
curl https://mumbaibazar.com/.well-known/apple-app-site-association
```

Same rule as Android: 404 until the Team ID is real, because iOS caches a bad
copy through Apple's CDN.

### 2b. Enable Associated Domains

In the Apple Developer portal, on the App ID for `com.mumbaibazar.store`, tick
**Associated Domains**. It is off by default, and Universal Links fail silently
without it. `ios/App/App/App.entitlements` is already wired into the Xcode
project.

### 2c. Build

```bash
npm run cap:sync
npx cap open ios
```

In Xcode: select the App target → Signing & Capabilities → set the team →
Product → Archive → Distribute App.

### 2d. Still to do for iOS

- **App icons are incomplete.** Only `AppIcon-512@2x.png` exists; App Store
  Connect validation needs the full set. Generate with
  `npx @capacitor/assets generate --iconBackgroundColor '#9B1018'`.
- Privacy nutrition labels in App Store Connect
- Screenshots for 6.7" and 5.5" displays

---

## What was fixed to get here

| Problem | Status |
|---|---|
| `assetlinks.json` missing → Android App Links silently broken | Route added, 404s until fingerprint set |
| No iOS entitlements → Universal Links impossible | `App.entitlements` added and wired into Xcode |
| Payment domains not in `allowNavigation` → checkout could dead-end | Razorpay, shop.app, UPI wallets added |
| `network_security_config.xml` out of step with the above | Rewritten to match |
| No release signing → bundle could not be uploaded to Play | `signingConfig` added, reads gitignored properties |
| `*.jks` ignore lines were **commented out** | Enabled — a committed signing key is unrecoverable |
| `versionCode` hardcoded to 1 | Overridable via `-PversionCode=` |
| `minifyEnabled false` | R8 + resource shrinking on |
| `tel:` links not intercepted in the webview | Added — it is the highest-intent tap in the app |
| Offline fallback claimed "Handloom Elegance" | Removed; it is the claim already scrubbed sitewide |
| Offline fallback said 9:30 PM and "Nalasopara (W)" | Now generated from `SITE.hours` and the outlet data |
| Fallback was hand-written and drifted unchecked | Generated by `scripts/build-mobile-fallback.mjs`; template is scanned by `npm run check:seo` |

## Still open

- **Guideline 4.2 risk** — see "The Apple problem" above
- **iOS app icon set incomplete**
- **A real ₹1 test purchase inside the app has never been run.** The
  `allowNavigation` list is correct as far as the documented payment methods go,
  but the only way to be sure checkout completes on a device is to do it. Watch
  the device console for blocked hosts and add any that appear.
