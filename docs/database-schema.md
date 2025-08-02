# V2V Bike Parts Platform - Database Schema

This document outlines the complete Firestore database schema for the V2V Bike Parts platform, including all collections, documents, and their relationships.

## 📊 Database Architecture Overview

The platform uses Firestore, a NoSQL document database, organized into the following main collections:

- **Users** - User accounts and profiles
- **Products** - Bike parts catalog
- **Orders** - Purchase transactions
- **Categories** - Product categorization
- **Reviews** - Product and vendor reviews
- **Messages** - In-app messaging
- **Conversations** - Message threads
- **Notifications** - User notifications
- **BikeModels** - Reference data for bike compatibility
- **Analytics** - Business intelligence data

## 🗃️ Collection Schemas

### Users Collection (`users`)

Stores user account information for vendors, buyers, and admins.

```typescript
interface User {
  id: string;                    // Document ID (matches Firebase Auth UID)
  email: string;                 // User email address
  role: 'vendor' | 'buyer' | 'admin';  // User role
  profile: VendorProfile | BuyerProfile;  // Role-specific profile data
  isActive: boolean;             // Account status
  fcmToken?: string;             // Firebase Cloud Messaging token
  createdAt: Timestamp;          // Account creation date
  updatedAt: Timestamp;          // Last profile update
}

interface VendorProfile {
  businessName: string;          // Business/shop name
  contactPerson: string;         // Primary contact person
  phone: string;                 // Business phone number
  businessAddress: Address;      // Business location
  businessLicense?: string;      // Business license number
  gstNumber?: string;           // GST registration number
  categories: string[];          // Product categories they deal in
  description?: string;          // Business description
  isApproved: boolean;          // Admin approval status
  approvedAt?: Timestamp;       // Approval date
  rating: number;               // Average vendor rating (0-5)
  totalOrders: number;          // Total orders completed
  profileImage?: string;        // Profile image URL
}

interface BuyerProfile {
  firstName: string;            // First name
  lastName: string;             // Last name
  phone: string;                // Phone number
  addresses: Address[];         // Saved addresses
  savedBikes: SavedBike[];      // User's bikes
  preferences: BuyerPreferences; // User preferences
  profileImage?: string;        // Profile image URL
}
```

**Indexes:**
- `role` + `isActive` + `createdAt` (compound)
- `email` (single field)

**Security Rules:**
- Users can read/update their own profile
- Admins can read/update any profile
- New user registration allowed with proper validation

---

### Products Collection (`products`)

Stores the bike parts catalog with detailed product information.

```typescript
interface Product {
  id: string;                   // Auto-generated document ID
  vendorId: string;             // Reference to vendor user ID
  title: string;                // Product name/title
  description: string;          // Detailed product description
  category: string;             // Main category
  subcategory: string;          // Sub-category
  partNumber?: string;          // Manufacturer part number
  brand?: string;               // Product brand
  bikeCompatibility: BikeCompatibility[]; // Compatible bikes
  images: string[];             // Product image URLs
  price: number;                // Current price in INR
  originalPrice?: number;       // Original price (for discounts)
  stock: number;                // Available quantity
  minOrderQuantity: number;     // Minimum order quantity
  specifications: Record<string, any>; // Technical specifications
  dimensions?: {                // Physical dimensions
    length: number;
    width: number;
    height: number;
    weight: number;
  };
  warranty?: {                  // Warranty information
    period: number;
    unit: 'days' | 'months' | 'years';
    terms: string;
  };
  isActive: boolean;            // Product visibility
  isFeatured: boolean;          // Featured product flag
  tags: string[];               // Search tags
  seoKeywords: string[];        // SEO keywords
  createdAt: Timestamp;         // Product creation date
  updatedAt: Timestamp;         // Last update
  rating: number;               // Average rating (0-5)
  reviewCount: number;          // Total number of reviews
  salesCount: number;           // Total units sold
}

interface BikeCompatibility {
  make: string;                 // Bike manufacturer
  models: string[];             // Compatible models
  years: number[];              // Compatible years
  engineCapacity?: string[];    // Engine sizes
  specificVariants?: string[];  // Specific variants
}
```

**Indexes:**
- `vendorId` + `isActive` + `updatedAt` (compound)
- `category` + `isActive` + `createdAt` (compound)
- `bikeCompatibility.make` + `isActive` + `price` (compound)
- `tags` (array-contains) + `isActive` + `rating` (compound)
- `seoKeywords` (array-contains)

**Security Rules:**
- Anyone can read active products
- Only approved vendors can create products
- Vendors can only modify their own products
- Admins have full access

---

### Orders Collection (`orders`)

Tracks all purchase transactions and order status.

```typescript
interface Order {
  id: string;                   // Auto-generated order ID
  buyerId: string;              // Reference to buyer user ID
  vendorId: string;             // Reference to vendor user ID
  items: OrderItem[];           // Ordered products
  subtotal: number;             // Subtotal amount
  shippingCost: number;         // Shipping charges
  tax: number;                  // Tax amount (GST)
  discount: number;             // Discount applied
  totalAmount: number;          // Final total amount
  status: OrderStatus;          // Current order status
  shippingAddress: Address;     // Delivery address
  billingAddress?: Address;     // Billing address (if different)
  paymentDetails: PaymentDetails; // Payment information
  trackingInfo?: TrackingInfo;  // Shipping tracking
  estimatedDelivery?: Timestamp; // Expected delivery date
  actualDelivery?: Timestamp;   // Actual delivery date
  notes?: string;               // Special instructions
  createdAt: Timestamp;         // Order creation
  updatedAt: Timestamp;         // Status updates
}

type OrderStatus = 
  | 'pending'     // Payment pending
  | 'confirmed'   // Payment received
  | 'processing'  // Being prepared
  | 'shipped'     // In transit
  | 'delivered'   // Completed
  | 'cancelled'   // Cancelled
  | 'refunded';   // Refunded

interface OrderItem {
  productId: string;            // Reference to product
  vendorId: string;             // Product vendor
  title: string;                // Product title (snapshot)
  image: string;                // Product image (snapshot)
  price: number;                // Price at time of order
  quantity: number;             // Ordered quantity
  specifications?: Record<string, any>; // Selected specifications
}
```

**Indexes:**
- `buyerId` + `status` + `createdAt` (compound)
- `vendorId` + `status` + `createdAt` (compound)
- `status` + `createdAt` (compound)

**Security Rules:**
- Buyers can read their orders
- Vendors can read orders for their products
- Buyers can create orders
- Status updates restricted by role

---

### Categories Collection (`categories`)

Hierarchical product categorization system.

```typescript
interface Category {
  id: string;                   // Category identifier
  name: string;                 // Display name
  slug: string;                 // URL-friendly identifier
  description?: string;         // Category description
  image?: string;               // Category image URL
  parentId?: string;            // Parent category (for hierarchy)
  isActive: boolean;            // Visibility status
  sortOrder: number;            // Display order
  seoKeywords: string[];        // SEO keywords
}
```

**Indexes:**
- `parentId` + `sortOrder` (compound)
- `isActive` + `sortOrder` (compound)

**Security Rules:**
- Anyone can read active categories
- Only admins can modify categories

---

### Reviews Collection (`reviews`)

Product and vendor review system.

```typescript
interface Review {
  id: string;                   // Auto-generated ID
  productId: string;            // Reference to product
  vendorId: string;             // Reference to vendor
  buyerId: string;              // Reference to buyer
  orderId: string;              // Reference to order (verification)
  rating: number;               // Rating (1-5)
  title?: string;               // Review title
  comment?: string;             // Review text
  images?: string[];            // Review images
  isVerifiedPurchase: boolean;  // Purchase verification
  helpfulCount: number;         // Helpful votes
  createdAt: Timestamp;         // Review date
  updatedAt: Timestamp;         // Last update
}
```

**Indexes:**
- `productId` + `rating` + `createdAt` (compound)
- `vendorId` + `rating` + `createdAt` (compound)
- `buyerId` + `createdAt` (compound)

---

### Messages Collection (`messages`)

Individual messages in conversations.

```typescript
interface Message {
  id: string;                   // Auto-generated ID
  conversationId: string;       // Reference to conversation
  senderId: string;             // Message sender
  receiverId: string;           // Message recipient
  content: string;              // Message text
  type: 'text' | 'image' | 'document'; // Message type
  attachments?: string[];       // File attachments
  isRead: boolean;              // Read status
  createdAt: Timestamp;         // Message timestamp
}
```

**Indexes:**
- `conversationId` + `createdAt` (compound)
- `senderId` + `createdAt` (compound)

---

### Conversations Collection (`conversations`)

Message conversation threads.

```typescript
interface Conversation {
  id: string;                   // Auto-generated ID
  participants: string[];       // Array of user IDs
  lastMessage?: Message;        // Last message (denormalized)
  updatedAt: Timestamp;         // Last activity
  isActive: boolean;            // Conversation status
}
```

**Indexes:**
- `participants` (array-contains) + `updatedAt` (compound)

---

### Notifications Collection (`notifications`)

User notification system.

```typescript
interface Notification {
  id: string;                   // Auto-generated ID
  userId: string;               // Target user
  type: 'order_update' | 'message' | 'promotion' | 'system';
  title: string;                // Notification title
  body: string;                 // Notification body
  data?: Record<string, any>;   // Additional data
  isRead: boolean;              // Read status
  createdAt: Timestamp;         // Notification time
}
```

**Indexes:**
- `userId` + `isRead` + `createdAt` (compound)

---

### BikeModels Collection (`bikeModels`)

Reference data for bike compatibility.

```typescript
interface BikeModel {
  id: string;                   // Model identifier
  make: string;                 // Manufacturer
  model: string;                // Model name
  year: number;                 // Model year
  engineCapacity?: string;      // Engine size
  fuelType?: 'petrol' | 'electric' | 'hybrid';
  category: 'motorcycle' | 'scooter' | 'electric' | 'bicycle';
}
```

## 🔗 Data Relationships

### Primary Relationships

1. **User → Products** (1:many)
   - Vendors can have multiple products
   - Foreign key: `products.vendorId → users.id`

2. **User → Orders** (1:many as buyer/vendor)
   - Users can have multiple orders as buyers
   - Vendors can have multiple orders for their products
   - Foreign keys: `orders.buyerId → users.id`, `orders.vendorId → users.id`

3. **Product → Orders** (many:many via OrderItems)
   - Products can be in multiple orders
   - Orders can contain multiple products

4. **User → Reviews** (1:many)
   - Users can write multiple reviews
   - Foreign key: `reviews.buyerId → users.id`

5. **Product → Reviews** (1:many)
   - Products can have multiple reviews
   - Foreign key: `reviews.productId → products.id`

### Denormalized Data

To optimize for read performance, some data is denormalized:

1. **Order Items** - Contains product snapshots
2. **Last Message** - Stored in conversations
3. **Rating Aggregates** - Stored in products and users
4. **Order Counts** - Stored in vendor profiles

## 📈 Data Access Patterns

### Common Query Patterns

1. **Product Search**
   ```typescript
   // By category
   products.where('category', '==', 'engine')
     .where('isActive', '==', true)
     .orderBy('createdAt', 'desc')

   // By bike compatibility
   products.where('bikeCompatibility.make', '==', 'Honda')
     .where('isActive', '==', true)
     .orderBy('price', 'asc')

   // By vendor
   products.where('vendorId', '==', vendorId)
     .where('isActive', '==', true)
     .orderBy('updatedAt', 'desc')
   ```

2. **Order Queries**
   ```typescript
   // Buyer's orders
   orders.where('buyerId', '==', userId)
     .orderBy('createdAt', 'desc')

   // Vendor's orders
   orders.where('vendorId', '==', vendorId)
     .where('status', '==', 'pending')
     .orderBy('createdAt', 'desc')
   ```

3. **Message Queries**
   ```typescript
   // Conversation messages
   messages.where('conversationId', '==', conversationId)
     .orderBy('createdAt', 'asc')

   // User conversations
   conversations.where('participants', 'array-contains', userId)
     .orderBy('updatedAt', 'desc')
   ```

## 🔒 Security Considerations

### Data Protection

1. **Personal Information**
   - Phone numbers and addresses are protected
   - Only accessible to the user and relevant parties

2. **Business Data**
   - Vendor business details restricted to owners and admins
   - Financial data encrypted and access-logged

3. **Order Information**
   - Payment details sanitized in client applications
   - Full payment data only accessible server-side

### Access Control

1. **Role-Based Access**
   - Admins: Full access to all data
   - Vendors: Access to their products and related orders
   - Buyers: Access to their orders and reviews

2. **Data Isolation**
   - Cross-tenant data isolation enforced
   - Users can only access their own data by default

## 📊 Data Analytics Schema

### Analytics Collection (`analytics`)

Aggregated data for business intelligence.

```typescript
interface DailyAnalytics {
  id: string;                   // Format: YYYY-MM-DD
  date: string;                 // Date string
  metrics: {
    totalOrders: number;
    totalRevenue: number;
    newUsers: number;
    newVendors: number;
    newProducts: number;
    activeUsers: number;
  };
  ordersByStatus: Record<OrderStatus, number>;
  topCategories: { category: string; count: number }[];
  topVendors: { vendorId: string; revenue: number }[];
}

interface MonthlyAnalytics {
  id: string;                   // Format: YYYY-MM
  month: string;                // Month string
  metrics: {
    totalOrders: number;
    totalRevenue: number;
    averageOrderValue: number;
    customerRetentionRate: number;
    vendorGrowthRate: number;
  };
  trends: {
    ordersGrowth: number;
    revenueGrowth: number;
    userGrowth: number;
  };
}
```

## 🚀 Performance Optimization

### Indexing Strategy

1. **Composite Indexes**
   - Support common filter + sort patterns
   - Minimize index count to reduce write costs

2. **Array-Contains Indexes**
   - Support tag-based searching
   - Enable bike compatibility queries

3. **Single Field Indexes**
   - Simple equality and range queries
   - Automatic indexes for common patterns

### Denormalization Benefits

1. **Reduced Read Operations**
   - Order items contain product snapshots
   - Conversations include last message

2. **Improved Performance**
   - Faster list views with embedded data
   - Reduced client-side joins

3. **Consistency Management**
   - Update aggregates via cloud functions
   - Eventual consistency for non-critical data

## 🔄 Data Migration & Versioning

### Schema Evolution

1. **Backward Compatibility**
   - New fields added as optional
   - Old fields deprecated gradually

2. **Data Migration**
   - Batch operations for schema updates
   - Incremental migration for large datasets

3. **Version Management**
   - Schema version tracking
   - Migration scripts for major changes

---

This schema supports the platform's current requirements while providing flexibility for future enhancements. Regular monitoring and optimization ensure optimal performance as the platform scales.
