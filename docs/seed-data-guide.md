# V2V Bike Parts Platform - Seed Data Guide

This guide explains how to populate your Firebase database with realistic test data using the provided seed scripts.

## 📋 Overview

The seed data scripts will create comprehensive test data including:

- **1 Admin User** + **10 Vendors** + **50 Buyers** (61 total users)
- **8 Main Categories** with subcategories (40+ categories total)
- **700+ Bike Models** across popular Indian brands
- **200 Products** with realistic specifications
- **100 Orders** with various statuses
- **150 Reviews** with ratings and comments
- **30 Conversations** with realistic messaging
- **200 Notifications** of various types

## 🚀 Quick Start

### 1. Setup Environment

```bash
cd scripts
npm install
cp .env.example .env
```

### 2. Configure Environment Variables

Edit the `.env` file with your Firebase project details:

```env
# Firebase Admin SDK Configuration
FIREBASE_PROJECT_ID=your_project_id_here
FIREBASE_CLIENT_EMAIL=your_service_account_email_here
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n"

# Seed Data Configuration
SEED_ADMIN_EMAIL=admin@v2vbikeparts.com
SEED_ADMIN_PASSWORD=admin123456
SEED_VENDORS_COUNT=10
SEED_BUYERS_COUNT=50
SEED_PRODUCTS_COUNT=200
SEED_ORDERS_COUNT=100
SEED_REVIEWS_COUNT=150
```

### 3. Get Firebase Service Account Key

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to Project Settings > Service Accounts
4. Click "Generate new private key"
5. Copy the credentials to your `.env` file

### 4. Run Seed Scripts

```bash
# Seed all data at once
npm run seed

# Or seed specific collections
npm run seed:users
npm run seed:categories
npm run seed:bikes
npm run seed:products
npm run seed:orders
npm run seed:reviews

# Clean all data
npm run clean

# Reset (clean + seed)
npm run reset
```

## 📊 Data Details

### 👥 Users Collection

#### Admin User
- **Email**: admin@v2vbikeparts.com
- **Role**: admin
- **Profile**: Complete admin profile with system permissions

#### Vendor Users (10)
- **Emails**: vendor1@example.com to vendor10@example.com
- **Businesses**: Realistic Indian business names
- **Locations**: Distributed across major Indian cities
- **Approval Status**: 80% approved, 20% pending
- **Categories**: Each vendor specializes in 2-4 part categories
- **Ratings**: 3.5-5.0 stars with order history

#### Buyer Users (50)
- **Emails**: buyer1@example.com to buyer50@example.com
- **Profiles**: Indian names with realistic addresses
- **Saved Bikes**: Each buyer has 1-2 saved motorcycles
- **Preferences**: Varied notification and payment preferences

### 📁 Categories Collection

#### Main Categories (8)
1. **Engine Parts** - Pistons, Cylinder Head, Crankshaft, etc.
2. **Brake System** - Brake Pads, Discs, Calipers, etc.
3. **Suspension** - Forks, Shocks, Springs, etc.
4. **Electrical System** - Battery, Lights, Wiring, etc.
5. **Transmission** - Clutch, Gears, Chain & Sprockets, etc.
6. **Body & Frame** - Fairings, Fuel Tank, Seat, etc.
7. **Wheels & Tires** - Wheels, Tires, Bearings, etc.
8. **Accessories** - Helmets, Gloves, Luggage, etc.

Each main category has 6-8 subcategories for detailed organization.

### 🏍️ Bike Models Collection

#### Supported Brands (12)
- Honda, Bajaj, TVS, Yamaha, Suzuki, KTM
- Royal Enfield, Hero, Mahindra, Benelli
- Kawasaki, Harley-Davidson

#### Model Coverage
- **Popular models** for each brand
- **Years 2015-2023** for each model
- **Engine capacities** from 125cc to 650cc
- **Categories**: Motorcycle, Scooter, Electric

### 🔧 Products Collection

#### Realistic Product Data
- **Titles**: Brand-specific part names
- **Descriptions**: Detailed with key features
- **Compatibility**: Accurate bike make/model/year matching
- **Pricing**: Market-realistic prices (₹500 - ₹50,000)
- **Stock Levels**: Varied inventory (0-50 units)
- **Images**: Placeholder URLs for product photos
- **Specifications**: Technical details by part type
- **SEO Keywords**: Optimized for search

#### Pricing Strategy
- **Engine/Transmission parts**: ₹2,000 - ₹25,000
- **Other parts**: ₹500 - ₹8,000
- **30% products** have discounts
- **Prices rounded** to nearest ₹50

### 🛒 Orders Collection

#### Order Distribution
- **10% Pending** - Payment pending
- **20% Confirmed** - Payment received
- **15% Processing** - Being prepared
- **25% Shipped** - In transit
- **50% Delivered** - Completed
- **5% Cancelled** - Cancelled orders

#### Order Details
- **1-4 items** per order from same vendor
- **Realistic totals** with shipping, tax, discounts
- **GST calculation** at 18%
- **Free shipping** above ₹2,000
- **Tracking information** for shipped orders

### ⭐ Reviews Collection

#### Review Distribution
- **40% - 5 stars** - Excellent reviews
- **30% - 4 stars** - Good reviews
- **20% - 3 stars** - Average reviews
- **8% - 2 stars** - Below average
- **2% - 1 star** - Poor reviews

#### Review Content
- **Realistic titles and comments** based on ratings
- **30% include images** (placeholder URLs)
- **Verified purchase badges** for all reviews
- **Helpful vote counts** (0-15)

### 💬 Messages & Conversations

#### Conversation Flow
- **30 conversations** between buyers and vendors
- **3-8 messages** per conversation
- **Realistic dialogue** about parts, compatibility, shipping
- **85% text messages**, 10% images, 5% documents
- **80% messages marked as read**

#### Message Types
- **Product inquiries** - Compatibility questions
- **Order discussions** - Shipping, payment details
- **Support requests** - Installation help, warranty
- **Follow-ups** - Delivery confirmation, feedback

### 🔔 Notifications Collection

#### Notification Types (200 total)
- **40% Order Updates** - Status changes, delivery
- **25% Messages** - New message alerts
- **20% Promotions** - Sales, discounts, offers
- **15% System** - App updates, maintenance

#### User-Specific Content
- **Buyers**: Order tracking, message alerts, promotions
- **Vendors**: New orders, payment confirmations, low stock
- **Role-appropriate** messaging and actions

## 🔧 Customization

### Adjusting Data Volume

Edit quantities in `.env`:

```env
SEED_VENDORS_COUNT=20      # More vendors
SEED_BUYERS_COUNT=100      # More buyers  
SEED_PRODUCTS_COUNT=500    # More products
SEED_ORDERS_COUNT=200      # More orders
SEED_REVIEWS_COUNT=300     # More reviews
```

### Adding Custom Data

#### Custom Bike Brands
Edit `seedHelpers.js`:

```javascript
export const bikeMakes = [
  // Add your brands
  'CustomBrand1', 'CustomBrand2'
];

export const bikeModels = {
  'CustomBrand1': ['Model1', 'Model2'],
  // Add models
};
```

#### Custom Part Categories
Edit `seedHelpers.js`:

```javascript
export const partCategories = [
  {
    id: 'custom_category',
    name: 'Custom Category',
    subcategories: ['Sub1', 'Sub2']
  }
];
```

### Geographic Customization

For non-Indian markets, update:

```javascript
export const indianStates = [
  'YourState1', 'YourState2'
];

export const indianCities = {
  'YourState1': ['City1', 'City2']
};
```

## 🔍 Verification

### Check Seeded Data

1. **Firebase Console**
   - Go to Firestore Database
   - Verify collections are created
   - Check document counts match expectations

2. **Mobile App**
   - Browse products by category
   - Search for specific parts
   - View vendor profiles and ratings

3. **Admin Dashboard**
   - Check user management
   - View order analytics
   - Review product listings

### Sample Queries

Test these Firestore queries:

```javascript
// Products by category
products.where('category', '==', 'engine')
  .where('isActive', '==', true)

// Orders by vendor
orders.where('vendorId', '==', 'vendor-1')
  .orderBy('createdAt', 'desc')

// Reviews by rating
reviews.where('rating', '>=', 4)
  .orderBy('rating', 'desc')
```

## 🚨 Troubleshooting

### Common Issues

1. **Firebase Permission Errors**
   ```
   Error: Permission denied
   ```
   - Check service account key is correct
   - Ensure Firebase Admin SDK is enabled
   - Verify project ID matches

2. **Large Data Timeouts**
   ```
   Error: Timeout exceeded
   ```
   - Reduce data quantities in `.env`
   - Run individual seed scripts instead of full seed
   - Check Firebase quota limits

3. **Index Errors**
   ```
   Error: Index not found
   ```
   - Deploy Firestore indexes: `firebase deploy --only firestore:indexes`
   - Wait for indexes to build in Firebase Console

### Performance Tips

1. **Batch Size**: Scripts use 500 operations per batch
2. **Parallel Processing**: Some operations run in parallel
3. **Memory Usage**: Large datasets may require more Node.js memory:
   ```bash
   node --max-old-space-size=4096 seedData.js
   ```

### Recovery

If seeding fails midway:

```bash
# Clean partial data
npm run clean

# Start fresh
npm run seed

# Or seed specific missing collections
npm run seed:products
```

## 📈 Next Steps

After seeding:

1. **Set User Passwords**
   - Go to Firebase Auth Console
   - Set passwords for test users
   - Enable email/password sign-in

2. **Configure App**
   - Update Firebase config in apps
   - Test login with seeded users
   - Verify app functionality

3. **Development**
   - Use realistic data for testing
   - Test search and filtering
   - Validate business logic

4. **Customization**
   - Add your actual product categories
   - Update bike compatibility data
   - Customize for your market

---

The seed data provides a realistic foundation for development and testing. Adjust the scripts as needed for your specific requirements!
