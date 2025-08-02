# V2V Bike Parts E-Commerce Platform

A modern, minimalistic Vendor-to-Vendor (V2V) e-commerce platform for bike parts, connecting suppliers with workshops, mechanics, and businesses.

## 🏗️ Architecture Overview

### Technology Stack
- **Mobile App**: Expo with React Native + TypeScript
- **Backend**: Firebase (Auth, Storage, Push Notifications)
- **Database**: Firestore (NoSQL)
- **Payment Gateway**: Razorpay
- **Admin Web**: Next.js with TypeScript

### Project Structure
```
v2v-bike-parts-platform/
├── mobile-app/              # Expo React Native app
├── admin-web/               # Next.js admin dashboard
├── shared/                  # Shared types, utilities, and Firebase config
├── docs/                    # Documentation and guides
└── firebase/                # Firebase configuration and rules
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Expo CLI
- Firebase CLI
- Razorpay Account

### Setup Instructions

1. **Clone and Install Dependencies**
```bash
# Install mobile app dependencies
cd mobile-app && npm install

# Install admin web dependencies
cd ../admin-web && npm install
```

2. **Firebase Configuration**
- Create a Firebase project
- Enable Authentication, Firestore, and Storage
- Copy configuration to shared/config/firebase.ts

3. **Razorpay Setup**
- Create Razorpay account
- Add API keys to environment variables

4. **Run Development**
```bash
# Mobile app
cd mobile-app && expo start

# Admin web
cd admin-web && npm run dev
```

## 📱 Core Features

### Mobile App (Vendor & Buyer)
- **Authentication**: Email/Password, Google, Apple Sign-in
- **User Profiles**: Differentiated Vendor/Buyer profiles
- **Product Browse**: Category navigation and smart search
- **Frame Number Lookup**: Precise part compatibility
- **Shopping Cart & Checkout**: Razorpay integration
- **Order Management**: Real-time tracking and updates
- **In-App Messaging**: Vendor-buyer communication
- **Reviews & Ratings**: Product and vendor feedback

### Admin Web Dashboard
- **User Management**: Approve vendors, manage accounts
- **Category Management**: Bike makes, models, parts
- **Listing Review**: Quality control for products
- **Order Management**: Comprehensive order oversight
- **Analytics Dashboard**: Sales, performance metrics
- **Reporting**: Business intelligence features

## 🗄️ Database Schema

### Firestore Collections

#### Users Collection
```typescript
interface User {
  id: string;
  email: string;
  role: 'vendor' | 'buyer' | 'admin';
  profile: VendorProfile | BuyerProfile;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  isActive: boolean;
  isApproved: boolean; // For vendors
}
```

#### Products Collection
```typescript
interface Product {
  id: string;
  vendorId: string;
  title: string;
  description: string;
  category: string;
  subcategory: string;
  bikeCompatibility: BikeCompatibility[];
  images: string[];
  price: number;
  stock: number;
  specifications: Record<string, any>;
  isActive: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

#### Orders Collection
```typescript
interface Order {
  id: string;
  buyerId: string;
  vendorId: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  shippingAddress: Address;
  paymentDetails: PaymentDetails;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

## 🔐 Security Features

- **Firebase Security Rules**: Role-based access control
- **API Key Management**: Environment-based configuration
- **Payment Security**: Razorpay secure integration
- **Input Validation**: Comprehensive data validation
- **Authentication Guards**: Route protection

## 📊 Scalability Considerations

- **Firestore Optimization**: Efficient querying and indexing
- **Image Optimization**: Firebase Storage with CDN
- **Caching Strategy**: Client-side and server-side caching
- **Performance Monitoring**: Firebase Performance monitoring
- **Error Tracking**: Comprehensive error handling

## 🚀 Deployment

### Mobile App
- **Development**: Expo Go
- **Production**: EAS Build for App Store/Play Store

### Admin Web
- **Vercel/Netlify**: Automatic deployments
- **Custom Server**: Docker containerization available

## 📚 Documentation

- [Setup Guide](docs/setup-guide.md)
- [API Documentation](docs/api-docs.md)
- [Database Schema](docs/database-schema.md)
- [Deployment Guide](docs/deployment.md)
- [Contributing Guidelines](docs/contributing.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation in the `docs/` folder
- Review the FAQ section

---

Built with ❤️ for the bike parts community
