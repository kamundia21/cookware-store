/**
 * Payment Service Module
 * Handles M-Pesa and Card Payment integrations
 * 
 * Supports:
 * - M-Pesa STK Push
 * - Card Payments (Stripe/Pesapal)
 * - Payment verification
 */

import { mockPaymentHandler, showDemoBanner } from './mockPaymentHandler.js';

// M-Pesa Configuration (requires actual API credentials from Safaricom)
export const MPESA_CONFIG = {
  // Get these from Safaricom Daraja API
  consumerKey: import.meta.env.VITE_MPESA_CONSUMER_KEY || 'your-consumer-key',
  consumerSecret: import.meta.env.VITE_MPESA_CONSUMER_SECRET || 'your-consumer-secret',
  shortCode: import.meta.env.VITE_MPESA_SHORT_CODE || '174379',
  passkey: import.meta.env.VITE_MPESA_PASSKEY || 'your-passkey',
  callbackUrl: import.meta.env.VITE_MPESA_CALLBACK_URL || 'https://your-domain.com/api/mpesa/callback',
};

// Card Payment Configuration (Pesapal or Stripe)
export const CARD_PAYMENT_CONFIG = {
  provider: import.meta.env.VITE_CARD_PROVIDER || 'pesapal', // 'pesapal' or 'stripe'
  pesapalConsumerKey: import.meta.env.VITE_PESAPAL_CONSUMER_KEY || 'your-key',
  pesapalConsumerSecret: import.meta.env.VITE_PESAPAL_CONSUMER_SECRET || 'your-secret',
  stripePublicKey: import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'your-stripe-key',
};

/**
 * M-Pesa Payment Service
 */
export const MpesaService = {
  /**
   * Generate M-Pesa STK Push
   * @param {string} phoneNumber - Customer's M-Pesa registered phone number
   * @param {number} amount - Amount in KES
   * @param {string} orderRef - Order reference/ID
   */
  initiateStkPush: async (phoneNumber, amount, orderRef) => {
    try {
      // Format phone number (remove leading 0, add country code)
      const formattedPhone = formatPhoneNumber(phoneNumber);
      
      // In production, call your backend API which will call Safaricom Daraja
      const response = await fetch('/api/mpesa/initiate-stk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: formattedPhone,
          amount: Math.round(amount),
          orderRef: orderRef,
          description: `Advenco Store Order ${orderRef}`,
          timestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        // Handle 404 - backend not configured yet
        if (response.status === 404) {
          console.warn('M-Pesa API endpoint not configured. Using demo mode.');
          // Use mock payment for demo/testing
          showDemoBanner('mpesa');
          const result = await mockPaymentHandler.initiateMpesaStkPush(formattedPhone, amount, orderRef);
          return result;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        return {
          success: true,
          message: `STK Push sent to ${phoneNumber}. Check your phone and enter your M-Pesa PIN.`,
          checkoutRequestId: data.checkoutRequestId,
        };
      } else {
        return {
          success: false,
          message: data.message || 'Failed to initiate M-Pesa payment',
        };
      }
    } catch (error) {
      console.error('M-Pesa error:', error);
      
      // If network error or other issue, use mock for testing
      if (error.message.includes('404') || error.message.includes('Failed to fetch')) {
        console.log('Backend unavailable, using demo payment mode');
        showDemoBanner('mpesa');
        const result = await mockPaymentHandler.initiateMpesaStkPush(
          formatPhoneNumber(phoneNumber),
          amount,
          orderRef
        );
        return result;
      }
      
      return {
        success: false,
        message: 'Payment service unavailable. Please ensure the backend server is running.',
        error: error.message,
      };
    }
  },

  /**
   * Check M-Pesa payment status
   * @param {string} checkoutRequestId - Checkout request ID from STK Push
   */
  checkPaymentStatus: async (checkoutRequestId) => {
    try {
      const response = await fetch('/api/mpesa/check-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          checkoutRequestId: checkoutRequestId,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error checking payment status:', error);
      return { success: false, message: error.message };
    }
  },
};

/**
 * Card Payment Service (Pesapal)
 */
export const PesapalService = {
  /**
   * Initialize Pesapal payment
   * @param {number} amount - Amount in KES
   * @param {string} orderRef - Order reference
   * @param {object} customerInfo - {email, phone, firstName, lastName}
   */
  initiatePayment: async (amount, orderRef, customerInfo) => {
    try {
      const response = await fetch('/api/pesapal/initiate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amount,
          currency: 'KES',
          orderRef: orderRef,
          description: `Advenco Store Order ${orderRef}`,
          customerEmail: customerInfo.email,
          customerPhone: customerInfo.phone,
          customerFirstName: customerInfo.firstName,
          customerLastName: customerInfo.lastName,
          callbackUrl: `${window.location.origin}/payment-callback`,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success && data.redirectUrl) {
        // Redirect to Pesapal payment page
        window.location.href = data.redirectUrl;
      } else {
        return {
          success: false,
          message: data.message || 'Failed to initialize Pesapal payment',
        };
      }
    } catch (error) {
      console.error('Pesapal error:', error);
      return {
        success: false,
        message: `Error initiating payment: ${error.message}`,
      };
    }
  },

  /**
   * Check payment status
   * @param {string} transactionTrackingId - Pesapal transaction tracking ID
   */
  checkPaymentStatus: async (transactionTrackingId) => {
    try {
      const response = await fetch('/api/pesapal/check-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transactionTrackingId: transactionTrackingId,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error checking payment status:', error);
      return { success: false, message: error.message };
    }
  },
};

/**
 * Format phone number for M-Pesa
 * Converts 0712345678 to 254712345678
 */
function formatPhoneNumber(phone) {
  // Remove any spaces or dashes
  let cleaned = phone.replace(/[\s-]/g, '');
  
  // If starts with 0, replace with 254
  if (cleaned.startsWith('0')) {
    cleaned = '254' + cleaned.substring(1);
  }
  
  // If doesn't start with 254, add it
  if (!cleaned.startsWith('254')) {
    cleaned = '254' + cleaned;
  }
  
  return cleaned;
}

/**
 * Validate phone number format
 */
export const validatePhoneNumber = (phone) => {
  const pattern = /^(\+?254|0)[17]\d{8}$/;
  return pattern.test(phone);
};

/**
 * Validate amount
 */
export const validateAmount = (amount) => {
  const num = parseFloat(amount);
  return num > 0 && num <= 999999;
};

/**
 * Format currency for display
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
  }).format(amount);
};

export default {
  MpesaService,
  PesapalService,
  validatePhoneNumber,
  validateAmount,
  formatCurrency,
};
