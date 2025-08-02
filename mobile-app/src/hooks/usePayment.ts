import { useState } from 'react';
import { Alert } from 'react-native';
import razorpayService, { RazorpayOrderData, RazorpayResponse } from '@services/razorpayService';
import { useAuth } from '@contexts/AuthContext';

interface UsePaymentReturn {
  initiatePayment: (orderData: Omit<RazorpayOrderData, 'customerInfo'>) => Promise<RazorpayResponse>;
  isProcessing: boolean;
  error: string | null;
  clearError: () => void;
}

export const usePayment = (): UsePaymentReturn => {
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initiatePayment = async (
    orderData: Omit<RazorpayOrderData, 'customerInfo'>
  ): Promise<RazorpayResponse> => {
    if (!user) {
      const errorMsg = 'User not authenticated';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Prepare customer info from user profile
      const customerInfo = {
        name: user.role === 'buyer' 
          ? `${user.profile.firstName} ${user.profile.lastName}`
          : user.profile.businessName,
        email: user.email,
        phone: user.profile.phone,
      };

      // Create complete order data
      const completeOrderData: RazorpayOrderData = {
        ...orderData,
        customerInfo,
      };

      // Process payment
      const result = await razorpayService.openCheckout(completeOrderData);

      if (!result.success) {
        setError(result.error || 'Payment failed');
        Alert.alert('Payment Failed', result.error || 'Something went wrong');
      } else {
        Alert.alert('Payment Successful', 'Your payment has been processed successfully');
      }

      return result;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Payment processing failed';
      setError(errorMessage);
      Alert.alert('Payment Error', errorMessage);
      
      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      setIsProcessing(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return {
    initiatePayment,
    isProcessing,
    error,
    clearError,
  };
};

export default usePayment;
