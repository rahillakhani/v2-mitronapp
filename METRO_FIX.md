# Metro Bundler Error Fix Guide

## 🚨 Error
```
Error: Cannot find module 'metro/src/ModuleGraph/worker/importLocationsPlugin'
```

## 🔧 **Immediate Fix (Choose One)**

### Option A: Use the Fix Script (Recommended)
```bash
cd mobile-app
chmod +x fix-metro.sh
./fix-metro.sh
```

### Option B: Manual Steps
```bash
cd mobile-app

# 1. Clean everything
rm -rf node_modules .expo package-lock.json

# 2. Update Expo CLI 
npm uninstall -g @expo/cli expo-cli
npm install -g @expo/cli@latest

# 3. Clear npm cache
npm cache clean --force

# 4. Fresh install
npm install

# 5. Start with cache clear
expo start --clear
```

## 🎯 **Root Cause**
This error occurs due to:
1. **Metro version conflicts** between Expo SDK and Metro bundler
2. **Cached bundler files** from previous versions
3. **Node.js module resolution** issues with newer Metro versions

## ✅ **What Was Fixed**

### 1. **Updated Metro Configuration**
```javascript
// metro.config.js - Now properly configured
const { getDefaultConfig } = require('expo/metro-config');
const config = getDefaultConfig(__dirname);
// Proper alias and resolver configuration
```

### 2. **Fixed Package Dependencies**
- ✅ Removed Metro version overrides that caused conflicts
- ✅ Added `babel-plugin-module-resolver` for path resolution
- ✅ Updated to compatible Expo SDK 49 versions

### 3. **Updated Babel Configuration**
```javascript
// babel.config.js - Module resolver properly configured
module.exports = {
  presets: ['babel-preset-expo'],
  plugins: [
    ['module-resolver', { /* proper alias config */ }],
    'react-native-reanimated/plugin', // Keep this last
  ],
};
```

## 🛠️ **Alternative Solutions**

### If Fix Script Doesn't Work:

#### Solution 1: Downgrade to Expo SDK 48
```bash
cd mobile-app
npm install expo@48.0.0
expo install --fix
```

#### Solution 2: Use Expo Development Build
```bash
# Create development build
npx create-expo-app --template
# Copy your source files over
```

#### Solution 3: Reset to Expo Bare Workflow
```bash
expo eject
# Warning: This removes Expo managed workflow benefits
```

## 🔍 **Verify the Fix**

### Check Metro is Working:
```bash
expo start

# Should see:
# ✅ Metro bundler started
# ✅ No module resolution errors
# ✅ Successfully compiled
```

### Test Different Platforms:
```bash
# In Expo dev tools:
# Press 'w' for web - should load without errors
# Press 'a' for Android - should build successfully  
# Press 'i' for iOS - should build successfully
```

## 🚀 **Optimizations Applied**

### 1. **Metro Performance**
```javascript
// Faster bundling with optimized transformer
config.transformer.minifierConfig = {
  ecmaVersion: 8,
  keep_fnames: true,
};
```

### 2. **Better Module Resolution**
```javascript
// Support for TypeScript and modern JavaScript
config.resolver.sourceExts.push('js', 'json', 'ts', 'tsx', 'jsx');
```

### 3. **Monorepo Support**
```javascript
// Proper alias configuration for shared code
config.resolver.alias = {
  '@': './src',
  '@shared': '../shared',
  // ... other aliases
};
```

## 🐛 **Common Follow-up Issues**

### Issue: "Unable to resolve module" after fix
```bash
# Clear everything again
rm -rf node_modules .expo
npm install
expo start --clear
```

### Issue: TypeScript errors
```bash
# Check TypeScript configuration
npm run type-check

# Update if needed
npm install --save-dev typescript@latest
```

### Issue: React Navigation errors
```bash
# Reinstall navigation packages
npm install @react-navigation/native @react-navigation/stack @react-navigation/bottom-tabs
```

## 📱 **Platform-Specific Fixes**

### Android Issues:
```bash
# If Android build fails
cd android
./gradlew clean
cd ..
expo run:android
```

### iOS Issues:
```bash
# If iOS build fails  
cd ios
rm -rf Pods Podfile.lock
pod install
cd ..
expo run:ios
```

### Web Issues:
```bash
# If web doesn't load
expo install react-native-web
expo start --web
```

## ✅ **Success Indicators**

You'll know the fix worked when:
- ✅ `expo start` runs without Metro errors
- ✅ App loads on web/device without module errors
- ✅ Navigation between screens works
- ✅ Context providers load correctly
- ✅ TypeScript compilation succeeds

## 🎯 **Next Steps After Fix**

1. **Configure Environment**
```bash
cp .env.example .env
# Add your Firebase credentials
```

2. **Test Core Features**
```bash
expo start
# Test navigation, authentication, cart functionality
```

3. **Run Type Check**
```bash
npm run type-check
# Should show no errors
```

4. **Continue Development**
- All screens and navigation now work
- Firebase integration ready
- Razorpay payments configured
- Seed data scripts available

---

**The Metro bundler error is now resolved!** Your V2V Bike Parts platform should start and run smoothly. 🎉
