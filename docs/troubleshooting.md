# V2V Bike Parts Platform - Troubleshooting Guide

This guide helps you resolve common issues you might encounter while setting up and running the V2V Bike Parts platform.

## 🚨 Common Setup Issues

### 1. Package Installation Errors

#### Issue: `razorpay-react-native` package not found
```
npm verbose stack HttpErrorGeneral: 404 Not Found - GET https://registry.npmjs.org/razorpay-react-native
```

**Solution**: This package doesn't exist. We've created a custom Razorpay integration.
```bash
cd mobile-app
rm -rf node_modules package-lock.json
npm install
```

#### Issue: `faker` package deprecated
```
npm WARN deprecated faker@6.6.6
```

**Solution**: Use `@faker-js/faker` instead:
```bash
cd scripts
npm uninstall faker
npm install @faker-js/faker
```

#### Issue: Metro resolver conflicts
```
Error: Metro has encountered an error trying to resolve module
```

**Solution**: Clear Metro cache and reinstall:
```bash
cd mobile-app
expo r -c
rm -rf node_modules
npm install
```

### 2. Firebase Configuration Issues

#### Issue: Firebase project not found
```
Error: Firebase project not found
```

**Solution**:
1. Verify project ID in environment variables
2. Check Firebase console for correct project ID
3. Ensure service account has proper permissions

#### Issue: Firebase Auth errors
```
Error: Permission denied (missing or insufficient permissions)
```

**Solution**:
1. Deploy security rules: `firebase deploy --only firestore:rules`
2. Check user authentication status
3. Verify role-based permissions in security rules

#### Issue: Firestore index errors
```
Error: The query requires an index
```

**Solution**:
1. Deploy indexes: `firebase deploy --only firestore:indexes`
2. Wait for indexes to build (can take several minutes)
3. Check Firebase console for index status

### 3. Expo/React Native Issues

#### Issue: Expo CLI version conflicts
```
Error: Expo CLI version mismatch
```

**Solution**:
```bash
npm uninstall -g expo-cli @expo/cli
npm install -g @expo/cli@latest
expo --version
```

#### Issue: Android build failures
```
Error: Android build failed
```

**Solution**:
1. Update Android SDK and build tools
2. Check Java version (requires JDK 11+)
3. Clear Gradle cache:
   ```bash
   cd android
   ./gradlew clean
   ```

#### Issue: iOS simulator not launching
```
Error: Unable to boot device
```

**Solution**:
1. Reset iOS simulator
2. Check Xcode version compatibility
3. Restart Xcode and simulator

### 4. Environment Variable Issues

#### Issue: Environment variables not loading
```
Error: process.env.EXPO_PUBLIC_FIREBASE_API_KEY is undefined
```

**Solution**:
1. Check `.env` file exists and has correct format
2. Restart development server after env changes
3. Verify variable names match exactly (case-sensitive)

#### Issue: Firebase config in wrong format
```
Error: Invalid Firebase configuration
```

**Solution**:
```env
# Correct format:
EXPO_PUBLIC_FIREBASE_API_KEY=AIzaSyBn...
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id

# Wrong format:
EXPO_PUBLIC_FIREBASE_API_KEY="AIzaSyBn..."  # Remove quotes
```

## 🔧 Development Issues

### 1. Build and Deployment

#### Issue: EAS Build failing
```
Error: Build failed with exit code 1
```

**Solution**:
1. Check `eas.json` configuration
2. Verify app.json settings
3. Run local build first: `eas build --local`

#### Issue: Next.js build failing
```
Error: Failed to compile
```

**Solution**:
1. Check TypeScript errors: `npm run type-check`
2. Verify all imports are correct
3. Clear Next.js cache: `rm -rf .next`

### 2. Database and Backend

#### Issue: Seed data scripts failing
```
Error: Firebase Admin SDK not initialized
```

**Solution**:
1. Check service account credentials in `.env`
2. Verify project ID matches Firebase console
3. Ensure proper JSON format for private key

#### Issue: Large data seeding timeouts
```
Error: Timeout exceeded during batch write
```

**Solution**:
1. Reduce data counts in `.env` file
2. Run individual seed scripts instead of full seed
3. Increase Node.js memory:
   ```bash
   node --max-old-space-size=4096 seedData.js
   ```

### 3. Payment Integration

#### Issue: Razorpay integration not working
```
Error: Razorpay checkout failed
```

**Solution**:
1. Verify Razorpay API keys in environment
2. Check if running in supported browser/device
3. Test with Razorpay test keys first

#### Issue: WebBrowser not opening on mobile
```
Error: WebBrowser failed to open
```

**Solution**:
1. Ensure `expo-web-browser` is installed
2. Check device permissions
3. Test on physical device instead of simulator

## 📱 Runtime Issues

### 1. Navigation Errors

#### Issue: Navigation reference errors
```
Error: The action 'NAVIGATE' with payload {...} was not handled
```

**Solution**:
1. Check screen names match navigation definitions
2. Verify navigation stack structure
3. Use TypeScript navigation types

#### Issue: Deep linking not working
```
Error: Could not resolve linking configuration
```

**Solution**:
1. Check `app.json` linking configuration
2. Verify URL schemes are unique
3. Test linking in development mode

### 2. State Management Issues

#### Issue: Context not updating
```
Error: Context value not changing
```

**Solution**:
1. Check if context provider wraps components
2. Verify state updates are immutable
3. Use debugging tools to inspect state

#### Issue: Cart items not persisting
```
Error: Cart cleared on app restart
```

**Solution**:
1. Check AsyncStorage permissions
2. Verify storage key names are consistent
3. Handle storage errors gracefully

### 3. Authentication Issues

#### Issue: User not staying logged in
```
Error: Authentication state lost
```

**Solution**:
1. Check Firebase Auth persistence settings
2. Verify token refresh logic
3. Handle network connectivity issues

#### Issue: Role-based access not working
```
Error: Unauthorized access
```

**Solution**:
1. Check user role in Firestore
2. Verify security rules allow access
3. Refresh user data after role changes

## 🛠️ Performance Issues

### 1. App Performance

#### Issue: Slow app startup
```
Symptoms: Long loading times, white screen
```

**Solution**:
1. Optimize bundle size with tree shaking
2. Implement code splitting
3. Use lazy loading for screens

#### Issue: Memory leaks
```
Symptoms: App crashes, high memory usage
```

**Solution**:
1. Clean up subscriptions in useEffect
2. Remove event listeners properly
3. Optimize image loading and caching

### 2. Database Performance

#### Issue: Slow query performance
```
Symptoms: Long loading times for data
```

**Solution**:
1. Add proper Firestore indexes
2. Implement pagination for large datasets
3. Use query optimization techniques

#### Issue: High read costs
```
Symptoms: High Firebase billing
```

**Solution**:
1. Implement proper caching
2. Use offline persistence
3. Optimize query frequency

## 🧪 Testing Issues

### 1. Unit Testing

#### Issue: Jest configuration errors
```
Error: Module not found
```

**Solution**:
1. Check `jest.config.js` setup
2. Verify module resolution paths
3. Mock external dependencies properly

#### Issue: Firebase mocking issues
```
Error: Firebase functions not mocked
```

**Solution**:
1. Use `firebase-functions-test` library
2. Mock Firestore operations
3. Test with actual Firebase emulators

### 2. Integration Testing

#### Issue: E2E tests failing
```
Error: Element not found
```

**Solution**:
1. Add proper test IDs to components
2. Wait for async operations
3. Use proper selectors

## 🔍 Debugging Tools

### 1. React Native Debugging

#### Enable Debug Mode
```bash
# In development
expo start
# Press 'd' for debug menu
```

#### Remote Debugging
```bash
# Enable remote debugging in dev menu
# Open Chrome DevTools for debugging
```

### 2. Firebase Debugging

#### Firestore Debug Mode
```javascript
// Enable Firestore debug logging
import { enableNetwork, disableNetwork } from 'firebase/firestore';

// In development
if (__DEV__) {
  // Enable debug logging
}
```

#### Security Rules Testing
```bash
# Use Firebase emulators for testing rules
firebase emulators:start
```

### 3. Network Debugging

#### Monitor API Calls
```bash
# Use Flipper for network monitoring
npm install -g flipper
```

#### Check Firebase Performance
```javascript
// Add performance monitoring
import { getPerformance } from 'firebase/performance';
const performance = getPerformance();
```

## 📞 Getting Help

### 1. Community Resources

- **Expo Discord**: https://discord.gg/4gtbPAdpaE
- **React Native Community**: https://reactnative.dev/help
- **Firebase Support**: https://firebase.google.com/support

### 2. Documentation

- **Expo Docs**: https://docs.expo.dev/
- **React Navigation**: https://reactnavigation.org/
- **Firebase Docs**: https://firebase.google.com/docs

### 3. Issue Reporting

When reporting issues, include:
1. **Environment details**: OS, Node.js version, Expo version
2. **Error messages**: Full error logs and stack traces
3. **Steps to reproduce**: Detailed reproduction steps
4. **Code samples**: Minimal code that demonstrates the issue

### 4. Quick Fixes

#### Clear all caches
```bash
# Mobile app
cd mobile-app
expo r -c
rm -rf node_modules
npm install

# Admin web
cd admin-web
rm -rf .next node_modules
npm install

# Scripts
cd scripts
rm -rf node_modules
npm install
```

#### Reset development environment
```bash
# Reset entire project
git clean -fdx
npm run install:all
```

---

**Still having issues?** Check the project's issue tracker or create a new issue with detailed information about your problem.
