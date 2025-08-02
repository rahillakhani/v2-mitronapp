// Firebase Configuration
export const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID || process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Razorpay Configuration
export const razorpayConfig = {
  keyId: process.env.EXPO_PUBLIC_RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
  keySecret: process.env.RAZORPAY_KEY_SECRET, // Server-side only
};

// App Configuration
export const appConfig = {
  name: 'V2V Bike Parts',
  version: '1.0.0',
  description: 'Vendor-to-Vendor bike parts marketplace',
  website: 'https://v2vbikeparts.com',
  supportEmail: 'support@v2vbikeparts.com',
  currency: 'INR',
  locale: 'en-IN',
  timezone: 'Asia/Kolkata',
  
  // Feature flags
  features: {
    frameNumberLookup: true,
    inAppMessaging: true,
    pushNotifications: true,
    advancedSearch: true,
    vendorVerification: true,
    bulkOrders: true,
    wishlist: true,
    reviews: true,
    analytics: true,
  },
  
  // Business rules
  business: {
    minOrderAmount: 500, // in INR
    maxOrderAmount: 100000, // in INR
    shippingFreeThreshold: 2000, // in INR
    defaultShippingCost: 100, // in INR
    taxRate: 0.18, // 18% GST
    vendorCommission: 0.05, // 5% commission
    maxProductImages: 5,
    maxProductDescriptionLength: 2000,
    maxReviewImages: 3,
    orderCancellationWindow: 24, // hours
    returnWindow: 7, // days
  },
  
  // API endpoints
  api: {
    baseUrl: process.env.EXPO_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.v2vbikeparts.com',
    version: 'v1',
  },
  
  // External services
  services: {
    razorpay: {
      currency: 'INR',
      timeout: 30000, // 30 seconds
    },
    firebase: {
      storageMaxSize: 5 * 1024 * 1024, // 5MB
      messagingTopic: 'all-users',
    },
  },
  
  // UI Configuration
  ui: {
    theme: {
      primary: '#2563eb',
      secondary: '#64748b',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      background: '#ffffff',
      surface: '#f8fafc',
      text: '#1e293b',
      textSecondary: '#64748b',
    },
    animation: {
      duration: 300,
      easing: 'ease-in-out',
    },
    spacing: {
      xs: 4,
      sm: 8,
      md: 16,
      lg: 24,
      xl: 32,
      xxl: 48,
    },
    borderRadius: {
      sm: 4,
      md: 8,
      lg: 12,
      xl: 16,
    },
  },
  
  // Validation rules
  validation: {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    phone: /^[6-9]\d{9}$/, // Indian mobile number
    password: {
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: false,
    },
    productTitle: {
      minLength: 10,
      maxLength: 100,
    },
    businessName: {
      minLength: 3,
      maxLength: 50,
    },
  },
  
  // Pagination
  pagination: {
    defaultLimit: 20,
    maxLimit: 100,
  },
  
  // File upload
  fileUpload: {
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    maxFiles: 5,
  },
  
  // Search configuration
  search: {
    minQueryLength: 2,
    maxResults: 100,
    debounceDelay: 300, // milliseconds
  },
  
  // Cache configuration
  cache: {
    userProfile: 5 * 60 * 1000, // 5 minutes
    products: 2 * 60 * 1000, // 2 minutes
    categories: 10 * 60 * 1000, // 10 minutes
  },
};

// Environment-specific overrides
if (process.env.NODE_ENV === 'development') {
  appConfig.api.baseUrl = 'http://localhost:3000/api';
}

export default appConfig;
