# Mumbai Bazar — what is still outstanding

Last updated: 2026-09-12

Everything here is a real, checked item — either something a person has to do
(create an account, generate a key) or something I could not verify from a
development machine. Nothing is speculative.

Ordered by what blocks what.

---

## 🔴 Blocking — nothing ships until these are done

### 1. Firebase project (push notifications)
**Who:** client · **Time:** ~10 min · **Cost:** free

Push code is written, wired and building. It needs one file that only the
account owner can generate.

1. console.firebase.google.com → **Add project** → "Mumbai Bazar"
2. **Add app → Android**, package name `com.mumbaibazar.store` (exact match)
3. Download `google-services.json` → put it at `android/app/google-services.json`
4. Rebuild

Until then the app runs fine but receives no notifications — the Gradle plugin
only activates when the file exists, which is deliberate.

**Sending a message afterwards:** Firebase console → Messaging → Topic
`all-customers`. Every install subscribes, so broadcasts need no backend.

### 2. Google Play account
**Who:** client · **Time:** ~30 min + up to 3 days review · **Cost:** $25 one-time

### 3. Android signing keystore
**Who:** whoever holds the release process · **Time:** ~5 min

```bash
keytool -genkey -v -keystore mumbaibazar-upload.jks \
  -keyalg RSA -keysize 2048 -validity 10000 -alias mumbaibazar
```

Then create `android/keystore.properties` (gitignored) as documented in
MOBILE_RELEASE.md.

⚠️ **If this key is lost the app can never be updated again.** A new key means a
new Play listing and every customer has to reinstall. Put the `.jks` and its
passwords in the client's password manager today, not later.

---

## 🟠 Needed before the apps work properly

### 4. Android App Links are declared but cannot verify
`AndroidManifest.xml` declares `autoVerify="true"`, but
`https://mumbaibazar.com/.well-known/assetlinks.json` currently returns **404**
on purpose — publishing it with no fingerprint makes Android cache a *failed*
verification, which then needs a reinstall to clear.

After the first Play upload, take the SHA-256 from Play Console → Release →
Setup → App signing, plus your own upload-key fingerprint, and put both into
`ANDROID_CERT_FINGERPRINTS` in `src/lib/mobile-app.ts`. Deploy the site, then:

```bash
curl https://mumbaibazar.com/.well-known/assetlinks.json
```

Until this is done, tapping a mumbaibazar.com link opens Chrome, not the app.

### 5. A real ₹1 test purchase inside the app
**Nobody has done this.** I widened `allowNavigation` to cover Razorpay,
shop.app and the UPI wallets named in your own terms, but the only way to know
checkout completes on a device is to buy something.

Watch the device console (`chrome://inspect`) while paying and add any host that
gets blocked. A blocked host in a webview is a blank screen with no error — at
the exact step where a sale is lost.

### 6. Confirm store hours with the actual shops
`SITE.hours` in `src/lib/seo.ts` says 10:00–21:00 daily. This is the single
source everything derives from — website, schema, the app's offline screen, and
what an AI assistant tells someone asking "are you open Sunday?".

It has never been confirmed against the shops. The mobile fallback previously
said 9:30 PM, which is how this surfaced.

---

## 🟡 iOS — only when the client wants the App Store

### 7. Apple Developer account + a Mac
**Cost:** $99/year · **Hard requirement:** macOS to build and upload

No way around the Mac. If there is none, use a cloud build service (Codemagic,
Ionic Appflow, EAS) — the project needs no changes for that.

### 8. Apple Team ID
Fill `APPLE_TEAM_ID` in `src/lib/mobile-app.ts`, deploy, then verify
`/.well-known/apple-app-site-association` returns JSON. 404 until then, for the
same caching reason as Android.

### 9. Enable Associated Domains on the App ID
Apple Developer portal → App ID `com.mumbaibazar.store` → tick **Associated
Domains**. Off by default; Universal Links fail silently without it.
`ios/App/App/App.entitlements` is already wired into the Xcode project.

### 10. iOS app icons are incomplete
Only `AppIcon-512@2x.png` exists. App Store Connect validation needs the full
set:

```bash
npx @capacitor/assets generate --iconBackgroundColor '#9B1018'
```

### 11. ⚠️ Apple Guideline 4.2 risk — read before submitting
This is a webview around the website, which Apple rejects as "minimum
functionality" a fair share of the time for retail.

It now does more than a bare wrapper: push notifications, haptics, native
splash and status bar, hardware back-button handling, external app hand-off,
offline screen, app-only page transitions. That materially helps but is not a
guarantee.

**Recommendation:** ship to Play first and get the client a live app. Add one or
two genuinely app-only things (an app-exclusive discount code is the cheapest)
before submitting to Apple.

---

## 🟢 Known-but-fine / decisions already taken

- **Play In-App Updates deliberately not used.** It requires the app to have
  been installed *by Play*, so it silently does nothing for a sideloaded APK,
  and there is no iOS equivalent. `/app-version.json` covers both stores
  instead — bump `version` in `src/routes/app-version[.]json.ts` when you ship
  a store release.
- **Web content needs no release.** Prices, products and copy update the moment
  the site deploys, because the shell loads the live site. Only native shell
  changes (plugins, permissions, targetSdk) need a store submission.
- **`google-services.json` is not a secret.** It ships inside the APK and is
  extractable. Committing it is normal and keeps CI working.
- **Push does not prompt on launch — this is on purpose.** Asking before the
  customer has done anything is how you get denied, and on iOS a denial is
  near-permanent. `requestPushPermission()` is ready to attach to an explicit
  control ("notify me when this is back") whenever you want it.

---

## Website items still open (not app-related)

These predate the mobile work and are still outstanding:

- **Google Business Profile** is the highest-value SEO action available and
  cannot be done in code. The Nalasopara listing must carry `mumbaibazar.com`
  as its website, and JustDial reads "Mumbai Bazaar" against our "Mumbai Bazar"
  branding — that inconsistency is the likeliest cause of Google's AI Overview
  saying the business has no official website.
- **Four FAQ claims look unverifiable** and sit inside FAQPage schema, where
  Google reads them as factual assertions: "40+ countries via DHL Express &
  FedEx", "domestic shipping 100% complimentary", "5500K daylight / 95%+ colour
  fidelity", "every parcel 100% insured". Same pattern as the "Silk Mark"
  claims already stripped once. Tell me which are true and I will correct the
  rest.
- **Contact form and newsletter do not submit anywhere** — both just set a
  success flag locally.
- **Vasai outlet has no verified street address**, so it stays unpublished
  rather than shipping a guessed one that would conflict with GBP.
- **8 stores claimed, 4 store pages published** — the other four need verified
  addresses.

---

## Quick reference

```bash
# Rebuild the APK after any change
npm run cap:sync
cd android && ./gradlew assembleDebug -PversionCode=N -PversionName=X.Y.Z
# → android/app/build/outputs/apk/debug/app-debug.apk

# Release bundle for Play (needs keystore.properties)
cd android && ./gradlew bundleRelease -PversionCode=N -PversionName=X.Y.Z
# → android/app/build/outputs/bundle/release/app-release.aab

# Before any commit
npx tsc --noEmit && npm run check:seo && npm run build
```

Build environment on this machine (Java is not on PATH):

```bash
export JAVA_HOME="/c/Program Files/Android/Android Studio/jbr"
export ANDROID_HOME="/c/Users/ThePiecraft/AppData/Local/Android/Sdk"
```

`android/local.properties` must use **forward slashes** — a Java properties
file treats `\` as an escape, so a Windows path with single backslashes fails
with "Invalid file path".
