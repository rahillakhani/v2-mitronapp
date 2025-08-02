import { Platform } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri } from 'expo-auth-session';

interface RazorpayOrderData {
  orderId: string;
  amount: number;
  currency: string;
  description: string;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
  };
}

interface RazorpayResponse {
  success: boolean;
  paymentId?: string;
  orderId?: string;
  signature?: string;
  error?: string;
}

class RazorpayService {
  private keyId: string;
  private baseUrl = 'https://api.razorpay.com/v1';

  constructor(keyId: string) {
    this.keyId = keyId;
  }

  /**
   * Create Razorpay order on server
   */
  async createOrder(orderData: {
    amount: number;
    currency: string;
    receipt: string;
    notes?: Record<string, any>;
  }): Promise<any> {
    try {
      // This should be called from your backend API
      // For demo purposes, we'll simulate the order creation
      const response = await fetch(`${this.baseUrl}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${btoa(this.keyId + ':' + 'YOUR_KEY_SECRET')}`
        },
        body: JSON.stringify(orderData)
      });

      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating Razorpay order:', error);
      throw error;
    }
  }

  /**
   * Open Razorpay checkout for Expo/React Native
   */
  async openCheckout(orderData: RazorpayOrderData): Promise<RazorpayResponse> {
    try {
      if (Platform.OS === 'web') {
        return this.openWebCheckout(orderData);
      } else {
        return this.openMobileCheckout(orderData);
      }
    } catch (error) {
      console.error('Razorpay checkout error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Payment failed'
      };
    }
  }

  /**
   * Web-based Razorpay checkout
   */
  private async openWebCheckout(orderData: RazorpayOrderData): Promise<RazorpayResponse> {
    return new Promise((resolve) => {
      // Load Razorpay script dynamically
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => {
        // @ts-ignore - Razorpay is loaded globally
        const razorpay = new window.Razorpay({
          key: this.keyId,
          amount: orderData.amount * 100, // Convert to paise
          currency: orderData.currency,
          name: 'V2V Bike Parts',
          description: orderData.description,
          order_id: orderData.orderId,
          prefill: {
            name: orderData.customerInfo.name,
            email: orderData.customerInfo.email,
            contact: orderData.customerInfo.phone,
          },
          theme: {
            color: '#2563eb',
          },
          handler: (response: any) => {
            resolve({
              success: true,
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
              signature: response.razorpay_signature,
            });
          },
          modal: {
            ondismiss: () => {
              resolve({
                success: false,
                error: 'Payment cancelled by user',
              });
            },
          },
        });

        razorpay.open();
      };

      script.onerror = () => {
        resolve({
          success: false,
          error: 'Failed to load Razorpay',
        });
      };

      document.body.appendChild(script);
    });
  }

  /**
   * Mobile-based Razorpay checkout using WebBrowser
   */
  private async openMobileCheckout(orderData: RazorpayOrderData): Promise<RazorpayResponse> {
    try {
      // Create a checkout URL with parameters
      const checkoutUrl = this.buildCheckoutUrl(orderData);
      
      // Open Razorpay in browser
      const result = await WebBrowser.openBrowserAsync(checkoutUrl, {
        presentationStyle: WebBrowser.WebBrowserPresentationStyle.OVER_FULL_SCREEN,
        showTitle: true,
        toolbarColor: '#2563eb',
      });

      if (result.type === 'cancel') {
        return {
          success: false,
          error: 'Payment cancelled by user',
        };
      }

      // Note: In production, you'll need to handle the redirect properly
      // This is a simplified implementation
      return {
        success: true,
        paymentId: 'demo_payment_id',
        orderId: orderData.orderId,
      };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Payment failed',
      };
    }
  }

  /**
   * Build checkout URL for mobile browser
   */
  private buildCheckoutUrl(orderData: RazorpayOrderData): string {
    const redirectUri = makeRedirectUri({
      path: '/payment-callback',
    });

    const params = new URLSearchParams({
      key_id: this.keyId,
      order_id: orderData.orderId,
      amount: (orderData.amount * 100).toString(),
      currency: orderData.currency,
      name: 'V2V Bike Parts',
      description: orderData.description,
      prefill_name: orderData.customerInfo.name,
      prefill_email: orderData.customerInfo.email,
      prefill_contact: orderData.customerInfo.phone,
      redirect_url: redirectUri,
      cancel_url: redirectUri,
    });

    return `https://checkout.razorpay.com/v1/checkout.js?${params.toString()}`;
  }

  /**
   * Verify payment on server
   */
  async verifyPayment(paymentData: {
    paymentId: string;
    orderId: string;
    signature: string;
  }): Promise<boolean> {
    try {
      // This should be done on your backend for security
      // Frontend verification is not secure
      
      // Call your backend API to verify payment
      const response = await fetch('/api/verify-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      });

      const result = await response.json();
      return result.verified === true;

    } catch (error) {
      console.error('Payment verification error:', error);
      return false;
    }
  }

  /**
   * Get payment details
   */
  async getPaymentDetails(paymentId: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/payments/${paymentId}`, {
        headers: {
          'Authorization': `Basic ${btoa(this.keyId + ':' + 'YOUR_KEY_SECRET')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch payment details');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching payment details:', error);
      throw error;
    }
  }

  /**
   * Refund payment
   */
  async refundPayment(paymentId: string, amount?: number): Promise<any> {
    try {
      const refundData: any = {};
      if (amount) {
        refundData.amount = amount * 100; // Convert to paise
      }

      const response = await fetch(`${this.baseUrl}/payments/${paymentId}/refund`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${btoa(this.keyId + ':' + 'YOUR_KEY_SECRET')}`
        },
        body: JSON.stringify(refundData)
      });

      if (!response.ok) {
        throw new Error('Failed to process refund');
      }

      return await response.json();
    } catch (error) {
      console.error('Error processing refund:', error);
      throw error;
    }
  }
}

// Export singleton instance
const razorpayService = new RazorpayService(
  process.env.EXPO_PUBLIC_RAZORPAY_KEY_ID || 'your_razorpay_key_id'
);

export default razorpayService;
export { RazorpayService };
export type { RazorpayOrderData, RazorpayResponse };
