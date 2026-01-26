/**
 * Mock Payment Handler
 * Simulates M-Pesa and Card payments for testing
 * Remove this file when real backend is implemented
 */

export const mockPaymentHandler = {
  /**
   * Simulate M-Pesa STK Push
   */
  initiateMpesaStkPush: async (phoneNumber, amount, orderRef) => {
    return new Promise((resolve) => {
      // Simulate network delay
      setTimeout(() => {
        console.log('Mock M-Pesa STK Push initiated:', {
          phone: phoneNumber,
          amount: amount,
          orderRef: orderRef,
          timestamp: new Date().toISOString(),
        });

        // Simulate success
        resolve({
          success: true,
          message: `STK Push sent to ${phoneNumber}. Check your phone and enter your M-Pesa PIN.`,
          checkoutRequestId: `DEMO_${Date.now()}`,
          isDemoMode: true,
          transactionType: 'mpesa',
        });
      }, 1500);
    });
  },

  /**
   * Simulate M-Pesa payment status check
   */
  checkMpesaPaymentStatus: async (checkoutRequestId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulate payment success after check
        resolve({
          success: true,
          status: 'COMPLETED',
          message: 'Payment confirmed successfully',
          isDemoMode: true,
          transactionRef: `TXN_${Date.now()}`,
        });
      }, 1000);
    });
  },

  /**
   * Simulate Pesapal/Card payment
   */
  initiateCardPayment: async (amount, orderRef, customerInfo) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Mock Card Payment initiated:', {
          amount: amount,
          orderRef: orderRef,
          customer: customerInfo,
          timestamp: new Date().toISOString(),
        });

        resolve({
          success: true,
          message: 'Redirecting to payment gateway...',
          paymentUrl: `https://pesapal.com/demo?order=${orderRef}&amount=${amount}`,
          orderRef: orderRef,
          isDemoMode: true,
          transactionType: 'card',
        });
      }, 1000);
    });
  },

  /**
   * Simulate payment confirmation
   */
  confirmPayment: async (orderRef, amount) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Mock Payment Confirmation:', {
          orderRef: orderRef,
          amount: amount,
          status: 'PAID',
          timestamp: new Date().toISOString(),
        });

        resolve({
          success: true,
          message: `Payment of KES ${amount} confirmed for order ${orderRef}`,
          orderRef: orderRef,
          transactionId: `TXID_${Date.now()}`,
          status: 'PAID',
          isDemoMode: true,
        });
      }, 800);
    });
  },
};

/**
 * Show demo banner to user
 */
export function showDemoBanner(type = 'mpesa') {
  const banner = document.createElement('div');
  banner.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(52, 152, 219, 0.3);
    z-index: 10000;
    font-weight: 600;
    max-width: 300px;
    animation: slideIn 0.3s ease;
  `;
  
  const message = type === 'mpesa' 
    ? '✓ Demo M-Pesa Payment Initiated' 
    : '✓ Demo Card Payment Initiated';
  
  banner.textContent = message;
  document.body.appendChild(banner);
  
  // Remove after 3 seconds
  setTimeout(() => {
    banner.style.opacity = '0';
    banner.style.transition = 'opacity 0.3s ease';
    setTimeout(() => banner.remove(), 300);
  }, 3000);
}
