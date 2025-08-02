import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import { useAuth } from '@contexts/AuthContext';
import { useTheme } from '@contexts/ThemeContext';

// Auth Screens
import LoginScreen from '@screens/auth/LoginScreen';
import RegisterScreen from '@screens/auth/RegisterScreen';
import ForgotPasswordScreen from '@screens/auth/ForgotPasswordScreen';

// Common Screens
import HomeScreen from '@screens/common/HomeScreen';
import ProductListScreen from '@screens/common/ProductListScreen';
import ProductDetailScreen from '@screens/common/ProductDetailScreen';
import CartScreen from '@screens/common/CartScreen';
import ProfileScreen from '@screens/common/ProfileScreen';
import SearchScreen from '@screens/common/SearchScreen';
import NotificationsScreen from '@screens/common/NotificationsScreen';
import ChatScreen from '@screens/common/ChatScreen';
import ChatListScreen from '@screens/common/ChatListScreen';

// Buyer Screens
import CheckoutScreen from '@screens/buyer/CheckoutScreen';
import OrderHistoryScreen from '@screens/buyer/OrderHistoryScreen';
import OrderDetailScreen from '@screens/buyer/OrderDetailScreen';
import WishlistScreen from '@screens/buyer/WishlistScreen';

// Vendor Screens
import VendorDashboardScreen from '@screens/vendor/VendorDashboardScreen';
import ManageProductsScreen from '@screens/vendor/ManageProductsScreen';
import AddProductScreen from '@screens/vendor/AddProductScreen';
import EditProductScreen from '@screens/vendor/EditProductScreen';
import VendorOrdersScreen from '@screens/vendor/VendorOrdersScreen';
import VendorOrderDetailScreen from '@screens/vendor/VendorOrderDetailScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Auth Stack Navigator
const AuthStack = () => {
  const { theme } = useTheme();
  
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.background,
        },
        headerTintColor: theme.colors.text,
        headerTitleStyle: {
          fontWeight: '600',
        },
      }}
    >
      <Stack.Screen 
        name="Login" 
        component={LoginScreen} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="Register" 
        component={RegisterScreen}
        options={{ title: 'Create Account' }}
      />
      <Stack.Screen 
        name="ForgotPassword" 
        component={ForgotPasswordScreen}
        options={{ title: 'Reset Password' }}
      />
    </Stack.Navigator>
  );
};

// Buyer Tab Navigator
const BuyerTabs = () => {
  const { theme } = useTheme();
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerStyle: {
          backgroundColor: theme.colors.background,
        },
        headerTintColor: theme.colors.text,
        tabBarStyle: {
          backgroundColor: theme.colors.background,
          borderTopColor: theme.colors.border,
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          switch (route.name) {
            case 'Home':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'Search':
              iconName = focused ? 'search' : 'search-outline';
              break;
            case 'Cart':
              iconName = focused ? 'bag' : 'bag-outline';
              break;
            case 'Orders':
              iconName = focused ? 'receipt' : 'receipt-outline';
              break;
            case 'Profile':
              iconName = focused ? 'person' : 'person-outline';
              break;
            default:
              iconName = 'ellipse-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Cart" component={CartScreen} />
      <Tab.Screen name="Orders" component={OrderHistoryScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

// Vendor Tab Navigator
const VendorTabs = () => {
  const { theme } = useTheme();
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerStyle: {
          backgroundColor: theme.colors.background,
        },
        headerTintColor: theme.colors.text,
        tabBarStyle: {
          backgroundColor: theme.colors.background,
          borderTopColor: theme.colors.border,
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          switch (route.name) {
            case 'Dashboard':
              iconName = focused ? 'grid' : 'grid-outline';
              break;
            case 'Products':
              iconName = focused ? 'cube' : 'cube-outline';
              break;
            case 'Orders':
              iconName = focused ? 'receipt' : 'receipt-outline';
              break;
            case 'Messages':
              iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
              break;
            case 'Profile':
              iconName = focused ? 'person' : 'person-outline';
              break;
            default:
              iconName = 'ellipse-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={VendorDashboardScreen} />
      <Tab.Screen name="Products" component={ManageProductsScreen} />
      <Tab.Screen name="Orders" component={VendorOrdersScreen} />
      <Tab.Screen name="Messages" component={ChatListScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

// Main Stack Navigator
const MainStack = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  
  const TabComponent = user?.role === 'vendor' ? VendorTabs : BuyerTabs;
  
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.background,
        },
        headerTintColor: theme.colors.text,
        headerTitleStyle: {
          fontWeight: '600',
        },
      }}
    >
      <Stack.Screen 
        name="MainTabs" 
        component={TabComponent} 
        options={{ headerShown: false }}
      />
      
      {/* Common Screens */}
      <Stack.Screen 
        name="ProductList" 
        component={ProductListScreen}
        options={{ title: 'Products' }}
      />
      <Stack.Screen 
        name="ProductDetail" 
        component={ProductDetailScreen}
        options={{ title: 'Product Details' }}
      />
      <Stack.Screen 
        name="Notifications" 
        component={NotificationsScreen}
        options={{ title: 'Notifications' }}
      />
      <Stack.Screen 
        name="Chat" 
        component={ChatScreen}
        options={({ route }) => ({ title: route.params?.title || 'Chat' })}
      />
      
      {/* Buyer Screens */}
      {user?.role === 'buyer' && (
        <>
          <Stack.Screen 
            name="Checkout" 
            component={CheckoutScreen}
            options={{ title: 'Checkout' }}
          />
          <Stack.Screen 
            name="OrderDetail" 
            component={OrderDetailScreen}
            options={{ title: 'Order Details' }}
          />
          <Stack.Screen 
            name="Wishlist" 
            component={WishlistScreen}
            options={{ title: 'Wishlist' }}
          />
        </>
      )}
      
      {/* Vendor Screens */}
      {user?.role === 'vendor' && (
        <>
          <Stack.Screen 
            name="AddProduct" 
            component={AddProductScreen}
            options={{ title: 'Add Product' }}
          />
          <Stack.Screen 
            name="EditProduct" 
            component={EditProductScreen}
            options={{ title: 'Edit Product' }}
          />
          <Stack.Screen 
            name="VendorOrderDetail" 
            component={VendorOrderDetailScreen}
            options={{ title: 'Order Details' }}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

// Root App Navigator
const AppNavigator = () => {
  const { user, loading } = useAuth();
  
  if (loading) {
    // Return a loading screen component here
    return null;
  }
  
  return user ? <MainStack /> : <AuthStack />;
};

export default AppNavigator;
