# V2V Bike Parts - Seed Data Scripts

Comprehensive seed data scripts to populate your Firebase database with realistic test data for the V2V Bike Parts platform.

## 🎯 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Setup environment
cp .env.example .env
# Edit .env with your Firebase credentials

# 3. Seed all data
npm run seed
```

## 📦 What Gets Created

| Collection | Count | Description |
|------------|-------|-------------|
| Users | 61 | 1 admin, 10 vendors, 50 buyers |
| Categories | 40+ | 8 main categories with subcategories |
| Bike Models | 700+ | Popular Indian bike models (2015-2023) |
| Products | 200 | Realistic bike parts with specifications |
| Orders | 100 | Orders with various statuses |
| Reviews | 150 | Product reviews with realistic content |
| Conversations | 30 | Buyer-vendor message threads |
| Messages | 180+ | Realistic conversation messages |
| Notifications | 200 | Order updates, messages, promotions |

## 🔧 Available Scripts

```bash
# Full workflow
npm run seed          # Seed all data
npm run clean         # Delete all data
npm run reset         # Clean + Seed

# Individual collections  
npm run seed:users
npm run seed:categories
npm run seed:bikes
npm run seed:products
npm run seed:orders
npm run seed:reviews
```

## 📊 Sample Data Overview

### 👤 Users
- **Admin**: admin@v2vbikeparts.com
- **Vendors**: vendor1@example.com - vendor10@example.com  
- **Buyers**: buyer1@example.com - buyer50@example.com

### 🛍️ Products
- Engine parts, brake systems, electrical components
- Compatible with Honda, Bajaj, TVS, Yamaha, KTM, Royal Enfield
- Realistic pricing: ₹500 - ₹50,000
- Complete specifications and images

### 📱 Real-world Scenarios
- Order lifecycle from pending to delivered
- Buyer-vendor conversations about parts
- Product reviews with varied ratings
- Stock management and notifications

## ⚙️ Configuration

Edit `.env` to customize data volume:

```env
SEED_VENDORS_COUNT=10      # Number of vendor accounts
SEED_BUYERS_COUNT=50       # Number of buyer accounts  
SEED_PRODUCTS_COUNT=200    # Number of products
SEED_ORDERS_COUNT=100      # Number of orders
SEED_REVIEWS_COUNT=150     # Number of reviews
```

## 🚀 Firebase Setup Required

1. **Service Account Key**
   - Firebase Console → Project Settings → Service Accounts
   - Generate new private key
   - Add credentials to `.env`

2. **Database Rules**
   - Deploy security rules: `firebase deploy --only firestore:rules`
   - Deploy indexes: `firebase deploy --only firestore:indexes`

## ✅ Post-Seed Steps

1. **Set Passwords** in Firebase Auth Console
2. **Test Login** with sample accounts
3. **Verify Data** in mobile app and admin dashboard
4. **Customize** categories and products for your market

---

**Ready to populate your database?** Run `npm run seed` and get started with realistic test data! 🚀
