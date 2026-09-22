# Android APK (Capacitor)

The live product is still the React PWA. This folder wraps `dist/` as a native Android app.

```bash
npm run build
npx cap sync android
npx cap open android
```

In Android Studio: Build → Build Bundle(s) / APK(s) → Build APK(s).

Needs Android Studio / SDK. JDK 21: `/opt/homebrew/opt/openjdk@21`.
