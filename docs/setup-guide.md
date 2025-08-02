# V2V Bike Parts Platform - Setup Guide

This guide will walk you through setting up the complete V2V Bike Parts platform, including the mobile app, admin web dashboard, and Firebase backend.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **npm** or **yarn** package manager
- **Expo CLI** (`npm install -g @expo/cli`)
- **Firebase CLI** (`npm install -g firebase-tools`)
- **Git** for version control
- **Android Studio** (for Android development)
- **Xcode** (for iOS development, macOS only)

## 🔧 Environment Setup

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd v2v-bike-parts-platform
```

### 2. Firebase Project Setup

#### Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter project name: `v2v-bike-parts`
4. Enable Google Analytics (recommended)
5. Wait for project creation to complete

#### Enable Firebase Services

1. **Authentication**
   - Go to Authentication > Sign-in method
   - Enable Email/Password
   - Enable Google Sign-in (configure OAuth consent screen)
   - Add authorized domains if needed

2. **Firestore Database**
   - Go to Firestore Database > Create database
   - Start in test mode (we'll deploy security rules later)
   - Choose a location close to your users

3. **Storage**
   - Go to Storage > Get started
   - Start in test mode
   - Use the same location as Firestore

4. **Cloud Messaging**
   - Go to Project Settings > Cloud Messaging
   - Generate a new key pair for VAPID

#### Get Firebase Configuration

1. Go to Project Settings > General
2. Scroll down to "Your apps" section
3. Click "Add app" and select Web app
4. Register app with name "V2V Bike Parts Admin"
5. Copy the Firebase configuration object
6. Repeat for a second app named "V2V Bike Parts Mobile"

### 3. Razorpay Account Setup

1. Sign up at [Razorpay](https://dashboard.razorpay.com/)
2. Complete KYC verification
3. Go to Settings > API Keys
4. Generate Key ID and Key Secret
5. Note down both keys for environment configuration

## 🚀 Installation & Configuration

### 1. Install Dependencies

```bash
# Install mobile app dependencies
cd mobile-app
npm install

# Install admin web dependencies
cd ../admin-web
npm install

# Go back to root
cd ..
```

### 2. Environment Variables

#### Mobile App Environment Variables

Create `mobile-app/.env`:

```env
# Firebase Configuration
EXPO_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id

# Razorpay Configuration
EXPO_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id

# API Configuration
EXPO_PUBLIC_API_BASE_URL=https://your-api-domain.com/api
```

#### Admin Web Environment Variables

Create `admin-web/.env.local`:

```env
# Firebase Configuration (same as mobile app)
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id

# Firebase Admin SDK (for server-side operations)
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_service_account_email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n"

# Razorpay Configuration
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# API Configuration
NEXT_PUBLIC_API_BASE_URL=https://your-api-domain.com/api
```

### 3. Firebase Setup

#### Initialize Firebase in your project

```bash
cd firebase
firebase login
firebase init

# Select the following options:
# - Firestore
# - Storage
# - Hosting
# - Functions (if you plan to use Cloud Functions)
# 
# Use existing project: your_project_id
# Firestore rules: firestore.rules
# Firestore indexes: firestore.indexes.json
# Storage rules: storage.rules
```

#### Deploy Firebase Rules and Indexes

```bash
cd firebase
firebase deploy --only firestore:rules,firestore:indexes,storage:rules
```

### 4. Update Firebase Configuration

Update the Firebase configuration in your shared config:

1. Open `shared/config/app.ts`
2. Replace the placeholder values with your actual Firebase configuration
3. Update `firebase/firebase.json` with your actual project ID

## 🏃‍♂️ Running the Applications

### 1. Start Firebase Emulators (Development)

```bash
cd firebase
firebase emulators:start
```

This will start:
- Firestore Emulator (localhost:8080)
- Authentication Emulator (localhost:9099)
- Storage Emulator (localhost:9199)
- Firebase UI (localhost:4000)

### 2. Run Mobile App

```bash
cd mobile-app
expo start

# Then choose your platform:
# - Press 'a' for Android
# - Press 'i' for iOS
# - Press 'w' for web
```

### 3. Run Admin Web App

```bash
cd admin-web
npm run dev
```

The admin dashboard will be available at `http://localhost:3000`

## 📱 Mobile App Testing

### Android Testing

1. **Using Android Emulator:**
   - Start Android Studio
   - Open AVD Manager
   - Create and start a virtual device
   - Run `expo start` and press 'a'

2. **Using Physical Device:**
   - Install Expo Go from Google Play Store
   - Ensure device and computer are on same network
   - Scan QR code from Expo CLI

### iOS Testing

1. **Using iOS Simulator:**
   - Install Xcode
   - Run `expo start` and press 'i'

2. **Using Physical Device:**
   - Install Expo Go from App Store
   - Scan QR code from Expo CLI

## 🌐 Admin Web Testing

1. Open `http://localhost:3000` in your browser
2. Create an admin account using Firebase Auth
3. Update the user's role to 'admin' in Firestore
4. Log in to access the admin dashboard

## 🔐 Initial Data Setup

### 1. Create Admin User

1. Go to Firebase Console > Authentication
2. Create a new user with email and password
3. Go to Firestore Database
4. Create a document in the `users` collection:

```json
{
  "id": "user_uid_from_auth",
  "email": "admin@v2vbikeparts.com",
  "role": "admin",
  "profile": {
    "firstName": "Admin",
    "lastName": "User",
    "phone": "+911234567890"
  },
  "isActive": true,
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

### 2. Create Sample Categories

Create documents in the `categories` collection:

```json
[
  {
    "id": "engine",
    "name": "Engine Parts",
    "slug": "engine-parts",
    "isActive": true,
    "sortOrder": 1
  },
  {
    "id": "brakes",
    "name": "Brake System",
    "slug": "brake-system",
    "isActive": true,
    "sortOrder": 2
  },
  {
    "id": "suspension",
    "name": "Suspension",
    "slug": "suspension",
    "isActive": true,
    "sortOrder": 3
  }
]
```

### 3. Create Sample Bike Models

Create documents in the `bikeModels` collection:

```json
[
  {
    "id": "honda-cb350",
    "make": "Honda",
    "model": "CB350",
    "year": 2023,
    "engineCapacity": "350cc",
    "fuelType": "petrol",
    "category": "motorcycle"
  },
  {
    "id": "bajaj-pulsar-200",
    "make": "Bajaj",
    "model": "Pulsar 200",
    "year": 2023,
    "engineCapacity": "200cc",
    "fuelType": "petrol",
    "category": "motorcycle"
  }
]
```

## 🚀 Production Deployment

### 1. Mobile App Deployment

#### Using EAS Build

```bash
cd mobile-app

# Install EAS CLI
npm install -g @expo/eas-cli

# Configure EAS
eas init

# Build for Android
eas build --platform android

# Build for iOS
eas build --platform ios

# Submit to stores
eas submit --platform android
eas submit --platform ios
```

### 2. Admin Web Deployment

#### Using Vercel

```bash
cd admin-web

# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

#### Using Firebase Hosting

```bash
cd admin-web

# Build the application
npm run build

# Deploy to Firebase
cd ../firebase
firebase deploy --only hosting:admin
```

### 3. Firebase Production Setup

```bash
cd firebase

# Deploy all Firebase services
firebase deploy

# This includes:
# - Firestore rules and indexes
# - Storage rules
# - Cloud Functions (if any)
# - Hosting
```

## 🔧 Troubleshooting

### Common Issues

1. **Firebase Connection Issues**
   - Verify API keys are correct
   - Check Firebase project settings
   - Ensure emulators are running for development

2. **Expo Build Issues**
   - Clear Expo cache: `expo r -c`
   - Reinstall dependencies: `rm -rf node_modules && npm install`
   - Update Expo CLI: `npm install -g @expo/cli@latest`

3. **Razorpay Integration Issues**
   - Verify API keys
   - Check webhook configurations
   - Ensure test mode is enabled for development

4. **Firebase Rules Issues**
   - Check Firestore rules in Firebase Console
   - Verify user authentication and roles
   - Test rules using Firebase Emulator

### Getting Help

1. Check the [Firebase Documentation](https://firebase.google.com/docs)
2. Review [Expo Documentation](https://docs.expo.dev/)
3. Consult [Next.js Documentation](https://nextjs.org/docs)
4. Search [Stack Overflow](https://stackoverflow.com/) for specific errors

## 📚 Next Steps

1. **Customize the Application**
   - Modify themes and styling
   - Add your brand assets
   - Configure business-specific settings

2. **Add Additional Features**
   - Implement advanced search
   - Add payment gateway integration
   - Set up push notifications

3. **Performance Optimization**
   - Implement caching strategies
   - Optimize images and assets
   - Monitor performance metrics

4. **Security Hardening**
   - Review and test Firebase security rules
   - Implement proper authentication flows
   - Set up monitoring and alerts

---

For detailed API documentation, database schema, and component guides, refer to the other documentation files in this `docs/` folder.
