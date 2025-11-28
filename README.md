# Sehar App - Development Setup Guide

This document outlines the problems encountered during development setup and their solutions.

---

## Table of Contents
1. [React Native Reanimated Import Error](#1-react-native-reanimated-import-error)
2. [Worklets Version Mismatch Error](#2-worklets-version-mismatch-error)
3. [Setting Up Development Build for Skia](#3-setting-up-development-build-for-skia)
4. [Android Emulator Storage Issues](#4-android-emulator-storage-issues)
5. [Running the App](#5-running-the-app)

---

## 1. React Native Reanimated Import Error

### Problem
The app crashed with an error related to `react-native-reanimated` not being properly initialized.

### Solution
Added the reanimated import as the **very first import** in `index.js`:

**File Changed:** `index.js`

```javascript
// BEFORE
import 'react-native-gesture-handler';
import { registerRootComponent } from 'expo';
import App from './App';

// AFTER
import 'react-native-reanimated';  // Must be first!
import 'react-native-gesture-handler';
import { registerRootComponent } from 'expo';
import App from './App';
```

> **Important:** `react-native-reanimated` must be imported before any other imports because libraries like `@shopify/react-native-skia` require it to be initialized first.

---

## 2. Worklets Version Mismatch Error

### Problem
```
[runtime not ready]: WorkletsError: [Worklets] Mismatch between JavaScript part 
and native part of Worklets (0.6.1 vs 0.5.1).
```

This error occurs because `@shopify/react-native-skia` requires `react-native-worklets-core`, and these native modules **don't work with Expo Go**.

### Solution
Two options were available:

**Option A: Remove Skia (if not needed)**
```bash
npm uninstall @shopify/react-native-skia react-native-worklets-core
```

**Option B: Create a Development Build (recommended if using Skia)** ✅

We chose Option B. See next section for steps.

---

## 3. Setting Up Development Build for Skia

### Why Development Build?
Expo Go has pre-built native modules with specific versions. When using libraries like `@shopify/react-native-skia` that require custom native code, you need a development build instead of Expo Go.

### Steps

#### Step 1: Install SDK-compatible versions
```bash
npx expo install react-native-reanimated
npx expo install react-native-worklets-core
```

#### Step 2: Generate native directories
```bash
npx expo prebuild
```
This creates `/android` and `/ios` directories with native project files.

#### Step 3: Build and run the app
```bash
npx expo run:android
```
This compiles the native code and installs the app on the emulator/device.

---

## 4. Android Emulator Storage Issues

### Problem
```
Error: adb: failed to install app-debug.apk: 
Failure [INSTALL_FAILED_INSUFFICIENT_STORAGE: Failed to override installation location]
```

The Android emulator ran out of storage space.

### Solution

#### Step 1: Clear app data and caches
```bash
# Uninstall the existing app
adb shell pm uninstall com.anonymous.Sehar

# Clear temporary files
adb shell rm -rf /data/local/tmp/*

# Trim system caches
adb shell pm trim-caches 99999999999999
```

#### Step 2: Check available storage
```bash
adb shell df -h /data
```

#### Step 3: Install APK directly (if expo run:android fails)
```bash
adb install -r ./android/app/build/outputs/apk/debug/app-debug.apk
```

#### Prevention Tips
- Create emulators with more internal storage (set in Android Studio > Virtual Device Manager)
- Regularly clear unused apps and caches from emulator
- Use `adb shell pm list packages -3` to see third-party apps and uninstall unused ones

---

## 5. Running the App

### For Development Build (with Skia)
```bash
# Start Metro bundler for development build
npx expo start --dev-client

# Then press 'a' to open on Android or 'i' for iOS
```

### Rebuilding After Native Changes
If you add new native dependencies, you need to rebuild:
```bash
npx expo prebuild --clean
npx expo run:android
```

### Clear Cache and Restart
```bash
npx expo start --dev-client --clear
```

---

## Project Dependencies

Key dependencies in `package.json`:
```json
{
  "@shopify/react-native-skia": "^2.4.6",
  "react-native-reanimated": "~4.1.1",
  "react-native-worklets-core": "^1.6.2",
  "react-native-gesture-handler": "~2.28.0",
  "expo": "~54.0.25"
}
```

---

## Summary of Commands Used

| Purpose | Command |
|---------|---------|
| Install SDK-compatible packages | `npx expo install <package-name>` |
| Generate native directories | `npx expo prebuild` |
| Build & run on Android | `npx expo run:android` |
| Start dev server (dev build) | `npx expo start --dev-client` |
| Clear storage on emulator | `adb shell pm trim-caches 99999999999999` |
| Manual APK install | `adb install -r ./android/app/build/outputs/apk/debug/app-debug.apk` |
| Check emulator storage | `adb shell df -h /data` |

---

## Troubleshooting Quick Reference

| Error | Solution |
|-------|----------|
| Reanimated not initialized | Add `import 'react-native-reanimated'` as first import in `index.js` |
| Worklets version mismatch | Use development build instead of Expo Go |
| INSTALL_FAILED_INSUFFICIENT_STORAGE | Clear emulator caches or use `adb install -r` directly |
| Metro bundler issues | Run `npx expo start --clear` |

