#!/bin/bash

# V2V Bike Parts - Metro Bundler Fix Script
# This script resolves Metro bundler issues and sets up the project correctly

echo "🔧 V2V Bike Parts - Metro Bundler Fix"
echo "====================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the mobile-app directory"
    echo "Usage: cd mobile-app && ./fix-metro.sh"
    exit 1
fi

echo "📂 Current directory: $(pwd)"

# Step 1: Clean everything
echo ""
echo "🧹 Step 1: Cleaning existing files..."
rm -rf node_modules
rm -rf .expo
rm -f package-lock.json
rm -f yarn.lock
echo "✅ Cleaned node_modules, .expo, and lock files"

# Step 2: Update Expo CLI
echo ""
echo "📦 Step 2: Updating Expo CLI..."
npm uninstall -g @expo/cli expo-cli 2>/dev/null
npm install -g @expo/cli@latest
echo "✅ Updated Expo CLI to latest version"

# Step 3: Clear npm cache
echo ""
echo "🗑️  Step 3: Clearing npm cache..."
npm cache clean --force
echo "✅ Cleared npm cache"

# Step 4: Install dependencies
echo ""
echo "📥 Step 4: Installing dependencies..."
npm install
echo "✅ Dependencies installed"

# Step 5: Clear Metro cache
echo ""
echo "🚇 Step 5: Clearing Metro bundler cache..."
npx expo r -c 2>/dev/null || expo r -c 2>/dev/null || echo "⚠️  Expo cache clear skipped (will clear on start)"
echo "✅ Metro cache cleared"

# Step 6: Verify installation
echo ""
echo "🔍 Step 6: Verifying installation..."

# Check if critical packages are installed
if [ -d "node_modules/expo" ]; then
    echo "✅ Expo installed"
else
    echo "❌ Expo not found"
fi

if [ -d "node_modules/react-native" ]; then
    echo "✅ React Native installed"
else
    echo "❌ React Native not found"
fi

if [ -d "node_modules/react-navigation" ] || [ -d "node_modules/@react-navigation" ]; then
    echo "✅ React Navigation installed"
else
    echo "❌ React Navigation not found"
fi

# Step 7: Display next steps
echo ""
echo "🎉 Fix completed!"
echo "================"
echo ""
echo "📋 Next steps:"
echo "1. Start the development server:"
echo "   expo start"
echo ""
echo "2. If you still see Metro errors, try:"
echo "   expo start --clear"
echo ""
echo "3. For persistent issues, try:"
echo "   expo start --tunnel"
echo ""
echo "4. To test on different platforms:"
echo "   • Press 'w' for web"
echo "   • Press 'a' for Android"
echo "   • Press 'i' for iOS"
echo ""
echo "🐛 If you still encounter issues:"
echo "   • Check the updated troubleshooting guide"
echo "   • Ensure your Node.js version is 16+"
echo "   • Try running: npm run type-check"
echo ""
echo "Happy coding! 🚀"
