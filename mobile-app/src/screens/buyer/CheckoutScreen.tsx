import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { useCart } from '@contexts/CartContext';
import { useAuth } from '@contexts/AuthContext';
import { useTheme } from '@contexts/ThemeContext';
import { usePayment } from '@hooks/usePayment';
import { formatCurrency } from '@shared/utils';

const CheckoutScreen = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const { theme } = useTheme();
  const { items, totalAmount, clearCart } = useCart();
  const { initiatePayment, isProcessing } = usePayment();
  
  const [selectedAddress, setSelectedAddress] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('razorpay');

  // Calculate totals
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shippingCost = subtotal > 2000 ? 0 : 100;
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + shippingCost + tax;

  const handlePlaceOrder = async () => {
    if (items.length === 0) {
      Alert.alert('Error', 'Your cart is empty');
      return;
    }

    if (!user || user.role !== 'buyer') {
      Alert.alert('Error', 'Please login as a buyer to place orders');
      return;
    }

    try {
      // Generate order ID
      const orderId = `ORD${Date.now()}`;
      
      if (paymentMethod === 'cod') {
        // Handle Cash on Delivery
        await createOrder(orderId, { method: 'cod' });
        clearCart();
        navigation.navigate('OrderSuccess', { orderId });
        return;
      }

      // Prepare order data for Razorpay
      const orderData = {
        orderId,
        amount: total,
        currency: 'INR',
        description: `Order for ${items.length} item(s) from V2V Bike Parts`,
      };

      // Initiate payment
      const paymentResult = await initiatePayment(orderData);

      if (paymentResult.success) {
        // Payment successful - create order in Firestore
        await createOrder(orderId, paymentResult);
        
        // Clear cart and navigate to success screen
        clearCart();
        navigation.navigate('OrderSuccess', { 
          orderId,
          paymentId: paymentResult.paymentId 
        });
      }
    } catch (error) {
      console.error('Order placement error:', error);
      Alert.alert('Error', 'Failed to place order. Please try again.');
    }
  };

  const createOrder = async (orderId: string, paymentResult: any) => {
    // This would typically create the order in Firestore
    // Implementation depends on your backend setup
    console.log('Creating order:', orderId, paymentResult);
  };

  const addresses = user?.role === 'buyer' ? user.profile.addresses : [];

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollContainer: {
      padding: theme.spacing.md,
    },
    section: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.md,
      ...theme.shadows.sm,
    },
    sectionTitle: {
      fontSize: theme.fontSize.lg,
      fontWeight: theme.fontWeight.semibold,
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
    },
    itemRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: theme.spacing.sm,
    },
    itemTitle: {
      fontSize: theme.fontSize.md,
      color: theme.colors.text,
      flex: 1,
    },
    itemQuantity: {
      fontSize: theme.fontSize.sm,
      color: theme.colors.textSecondary,
      marginRight: theme.spacing.sm,
    },
    itemPrice: {
      fontSize: theme.fontSize.md,
      fontWeight: theme.fontWeight.medium,
      color: theme.colors.text,
    },
    addressOption: {
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.sm,
      borderWidth: 2,
      marginBottom: theme.spacing.sm,
    },
    selectedAddress: {
      borderColor: theme.colors.primary,
      backgroundColor: `${theme.colors.primary}10`,
    },
    unselectedAddress: {
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.background,
    },
    addressText: {
      fontSize: theme.fontSize.sm,
      color: theme.colors.text,
      lineHeight: 20,
    },
    paymentOption: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.sm,
      borderWidth: 1,
      marginBottom: theme.spacing.sm,
    },
    selectedPayment: {
      borderColor: theme.colors.primary,
      backgroundColor: `${theme.colors.primary}10`,
    },
    unselectedPayment: {
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.background,
    },
    paymentText: {
      fontSize: theme.fontSize.md,
      color: theme.colors.text,
      marginLeft: theme.spacing.sm,
    },
    totalRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: theme.spacing.xs,
    },
    totalLabel: {
      fontSize: theme.fontSize.md,
      color: theme.colors.text,
    },
    totalValue: {
      fontSize: theme.fontSize.md,
      fontWeight: theme.fontWeight.medium,
      color: theme.colors.text,
    },
    finalTotal: {
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
      paddingTop: theme.spacing.sm,
    },
    finalTotalLabel: {
      fontSize: theme.fontSize.lg,
      fontWeight: theme.fontWeight.semibold,
      color: theme.colors.text,
    },
    finalTotalValue: {
      fontSize: theme.fontSize.lg,
      fontWeight: theme.fontWeight.bold,
      color: theme.colors.primary,
    },
    placeOrderButton: {
      backgroundColor: theme.colors.primary,
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
      alignItems: 'center',
      marginTop: theme.spacing.lg,
      ...theme.shadows.sm,
    },
    placeOrderButtonDisabled: {
      backgroundColor: theme.colors.textSecondary,
    },
    placeOrderButtonText: {
      color: theme.colors.white,
      fontSize: theme.fontSize.md,
      fontWeight: theme.fontWeight.semibold,
    },
    loadingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    loadingText: {
      color: theme.colors.white,
      fontSize: theme.fontSize.md,
      fontWeight: theme.fontWeight.semibold,
      marginLeft: theme.spacing.sm,
    },
    emptyCartText: {
      fontSize: theme.fontSize.md,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      marginTop: theme.spacing.xl,
    },
  });

  if (items.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.scrollContainer}>
          <Text style={styles.emptyCartText}>Your cart is empty</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        {/* Order Items */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Items ({items.length})</Text>
          {items.map((item, index) => (
            <View key={index} style={styles.itemRow}>
              <Text style={styles.itemTitle} numberOfLines={1}>{item.title}</Text>
              <Text style={styles.itemQuantity}>x{item.quantity}</Text>
              <Text style={styles.itemPrice}>{formatCurrency(item.price * item.quantity)}</Text>
            </View>
          ))}
        </View>

        {/* Delivery Address */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Address</Text>
          {addresses.map((address, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.addressOption,
                selectedAddress === index ? styles.selectedAddress : styles.unselectedAddress,
              ]}
              onPress={() => setSelectedAddress(index)}
            >
              <Text style={styles.addressText}>
                {address.label}{'\n'}
                {address.street}, {address.city}{'\n'}
                {address.state} - {address.postalCode}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Payment Method */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          
          <TouchableOpacity
            style={[
              styles.paymentOption,
              paymentMethod === 'razorpay' ? styles.selectedPayment : styles.unselectedPayment,
            ]}
            onPress={() => setPaymentMethod('razorpay')}
          >
            <Ionicons
              name={paymentMethod === 'razorpay' ? 'radio-button-on' : 'radio-button-off'}
              size={20}
              color={theme.colors.primary}
            />
            <Text style={styles.paymentText}>Online Payment (Razorpay)</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.paymentOption,
              paymentMethod === 'cod' ? styles.selectedPayment : styles.unselectedPayment,
            ]}
            onPress={() => setPaymentMethod('cod')}
          >
            <Ionicons
              name={paymentMethod === 'cod' ? 'radio-button-on' : 'radio-button-off'}
              size={20}
              color={theme.colors.primary}
            />
            <Text style={styles.paymentText}>Cash on Delivery</Text>
          </TouchableOpacity>
        </View>

        {/* Order Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal</Text>
            <Text style={styles.totalValue}>{formatCurrency(subtotal)}</Text>
          </View>
          
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Shipping</Text>
            <Text style={styles.totalValue}>
              {shippingCost === 0 ? 'FREE' : formatCurrency(shippingCost)}
            </Text>
          </View>
          
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Tax (GST 18%)</Text>
            <Text style={styles.totalValue}>{formatCurrency(tax)}</Text>
          </View>
          
          <View style={[styles.totalRow, styles.finalTotal]}>
            <Text style={styles.finalTotalLabel}>Total</Text>
            <Text style={styles.finalTotalValue}>{formatCurrency(total)}</Text>
          </View>
        </View>

        {/* Place Order Button */}
        <TouchableOpacity
          style={[
            styles.placeOrderButton,
            (isProcessing || items.length === 0) && styles.placeOrderButtonDisabled,
          ]}
          onPress={handlePlaceOrder}
          disabled={isProcessing || items.length === 0}
        >
          {isProcessing ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={theme.colors.white} />
              <Text style={styles.loadingText}>Processing...</Text>
            </View>
          ) : (
            <Text style={styles.placeOrderButtonText}>
              Place Order - {formatCurrency(total)}
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CheckoutScreen;
