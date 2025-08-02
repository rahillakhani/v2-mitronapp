import { Timestamp } from 'firebase/firestore';

// User Types
export type UserRole = 'vendor' | 'buyer' | 'admin';

export interface BaseUser {
  id: string;
  email: string;
  role: UserRole;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  isActive: boolean;
  fcmToken?: string;
}

export interface VendorProfile {
  businessName: string;
  contactPerson: string;
  phone: string;
  businessAddress: Address;
  businessLicense?: string;
  gstNumber?: string;
  categories: string[];
  description?: string;
  isApproved: boolean;
  approvedAt?: Timestamp;
  rating: number;
  totalOrders: number;
  profileImage?: string;
}

export interface BuyerProfile {
  firstName: string;
  lastName: string;
  phone: string;
  addresses: Address[];
  savedBikes: SavedBike[];
  preferences: BuyerPreferences;
  profileImage?: string;
}

export interface User extends BaseUser {
  profile: VendorProfile | BuyerProfile;
}

// Address Types
export interface Address {
  id: string;
  label: string; // 'Home', 'Work', 'Shop', etc.
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

// Bike Types
export interface BikeModel {
  id: string;
  make: string;
  model: string;
  year: number;
  engineCapacity?: string;
  fuelType?: 'petrol' | 'electric' | 'hybrid';
  category: 'motorcycle' | 'scooter' | 'electric' | 'bicycle';
}

export interface SavedBike {
  id: string;
  bikeModelId: string;
  frameNumber?: string;
  registrationNumber?: string;
  nickname?: string;
  year: number;
  notes?: string;
}

export interface BikeCompatibility {
  make: string;
  models: string[];
  years: number[];
  engineCapacity?: string[];
  specificVariants?: string[];
}

// Product Types
export interface Product {
  id: string;
  vendorId: string;
  title: string;
  description: string;
  category: string;
  subcategory: string;
  partNumber?: string;
  brand?: string;
  bikeCompatibility: BikeCompatibility[];
  images: string[];
  price: number;
  originalPrice?: number; // For discounts
  stock: number;
  minOrderQuantity: number;
  specifications: Record<string, any>;
  dimensions?: {
    length: number;
    width: number;
    height: number;
    weight: number;
  };
  warranty?: {
    period: number;
    unit: 'days' | 'months' | 'years';
    terms: string;
  };
  isActive: boolean;
  isFeatured: boolean;
  tags: string[];
  seoKeywords: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
  rating: number;
  reviewCount: number;
  salesCount: number;
}

// Order Types
export type OrderStatus = 
  | 'pending' 
  | 'confirmed' 
  | 'processing' 
  | 'shipped' 
  | 'delivered' 
  | 'cancelled' 
  | 'refunded';

export interface OrderItem {
  productId: string;
  vendorId: string;
  title: string;
  image: string;
  price: number;
  quantity: number;
  specifications?: Record<string, any>;
}

export interface Order {
  id: string;
  buyerId: string;
  vendorId: string;
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  tax: number;
  discount: number;
  totalAmount: number;
  status: OrderStatus;
  shippingAddress: Address;
  billingAddress?: Address;
  paymentDetails: PaymentDetails;
  trackingInfo?: TrackingInfo;
  estimatedDelivery?: Timestamp;
  actualDelivery?: Timestamp;
  notes?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface PaymentDetails {
  method: 'razorpay' | 'cod' | 'bank_transfer';
  transactionId?: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  amount: number;
  currency: string;
  paidAt?: Timestamp;
}

export interface TrackingInfo {
  trackingNumber?: string;
  carrier?: string;
  status: string;
  statusHistory: TrackingEvent[];
}

export interface TrackingEvent {
  status: string;
  description: string;
  location?: string;
  timestamp: Timestamp;
}

// Category Types
export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentId?: string;
  isActive: boolean;
  sortOrder: number;
  seoKeywords: string[];
}

// Message Types
export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  content: string;
  type: 'text' | 'image' | 'document';
  attachments?: string[];
  isRead: boolean;
  createdAt: Timestamp;
}

export interface Conversation {
  id: string;
  participants: string[];
  lastMessage?: Message;
  updatedAt: Timestamp;
  isActive: boolean;
}

// Review Types
export interface Review {
  id: string;
  productId: string;
  vendorId: string;
  buyerId: string;
  orderId: string;
  rating: number;
  title?: string;
  comment?: string;
  images?: string[];
  isVerifiedPurchase: boolean;
  helpfulCount: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Search and Filter Types
export interface SearchFilters {
  category?: string;
  subcategory?: string;
  make?: string;
  model?: string;
  year?: number;
  priceRange?: {
    min: number;
    max: number;
  };
  brand?: string;
  inStock?: boolean;
  rating?: number;
  sortBy?: 'price_asc' | 'price_desc' | 'rating' | 'newest' | 'popularity';
  location?: {
    latitude: number;
    longitude: number;
    radius: number;
  };
}

export interface SearchResult {
  products: Product[];
  totalCount: number;
  facets: {
    categories: { name: string; count: number }[];
    brands: { name: string; count: number }[];
    priceRanges: { range: string; count: number }[];
  };
}

// Notification Types
export interface Notification {
  id: string;
  userId: string;
  type: 'order_update' | 'message' | 'promotion' | 'system';
  title: string;
  body: string;
  data?: Record<string, any>;
  isRead: boolean;
  createdAt: Timestamp;
}

// Preferences Types
export interface BuyerPreferences {
  defaultAddress?: string;
  preferredPaymentMethod?: string;
  notifications: {
    orderUpdates: boolean;
    messages: boolean;
    promotions: boolean;
    newProducts: boolean;
  };
  language: string;
  currency: string;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Form Types
export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  email: string;
  password: string;
  confirmPassword: string;
  role: UserRole;
  firstName?: string;
  lastName?: string;
  businessName?: string;
  phone: string;
  agreeToTerms: boolean;
}

export interface ProductForm {
  title: string;
  description: string;
  category: string;
  subcategory: string;
  partNumber?: string;
  brand?: string;
  price: number;
  stock: number;
  minOrderQuantity: number;
  bikeCompatibility: BikeCompatibility[];
  specifications: Record<string, any>;
  tags: string[];
  images: File[] | string[];
}

// Analytics Types
export interface AnalyticsData {
  totalOrders: number;
  totalRevenue: number;
  totalUsers: number;
  totalVendors: number;
  totalProducts: number;
  topSellingProducts: { product: Product; salesCount: number }[];
  topVendors: { vendor: User; revenue: number }[];
  ordersByStatus: Record<OrderStatus, number>;
  revenueByMonth: { month: string; revenue: number }[];
}

// Firebase Error Types
export interface FirebaseError {
  code: string;
  message: string;
}

// Utility Types
export type WithId<T> = T & { id: string };
export type WithTimestamps<T> = T & {
  createdAt: Timestamp;
  updatedAt: Timestamp;
};
export type Partial<T> = {
  [P in keyof T]?: T[P];
};
