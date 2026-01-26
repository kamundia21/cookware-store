import { useCart } from '../../context/CartContext';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { CreditCard, Smartphone, Loader } from 'lucide-react';
import { MpesaService, PesapalService, validatePhoneNumber, validateAmount, formatCurrency } from '../../utils/paymentService';
import './Checkout.css';

export function Checkout() {
  const { cart, getTotalPrice, clearCart } = useCart();
  const [step, setStep] = useState(1); // 1: delivery, 2: payment, 3: confirm
  const [paymentMethod, setPaymentMethod] = useState('mpesa'); // 'mpesa' or 'card'
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    mpesaNumber: ''
  });
  const [orderRef, setOrderRef] = useState(null);

  const totalPrice = getTotalPrice();

  const validateDeliveryForm = () => {
    if (!formData.name.trim()) {
      setMessage({ type: 'error', text: 'Please enter your name' });
      return false;
    }
    if (!formData.email.trim()) {
      setMessage({ type: 'error', text: 'Please enter your email' });
      return false;
    }
    if (!validatePhoneNumber(formData.phone)) {
      setMessage({ type: 'error', text: 'Please enter a valid phone number (e.g., 0712345678)' });
      return false;
    }
    if (!formData.address.trim()) {
      setMessage({ type: 'error', text: 'Please enter your delivery address' });
      return false;
    }
    return true;
  };

  const handleContinueToPayment = () => {
    if (validateDeliveryForm()) {
      setMessage({ type: '', text: '' });
      setStep(2);
    }
  };

  const handleMpesaPayment = async () => {
    if (!validatePhoneNumber(formData.mpesaNumber)) {
      setMessage({ type: 'error', text: 'Please enter a valid M-Pesa phone number' });
      return;
    }

    if (!validateAmount(totalPrice)) {
      setMessage({ type: 'error', text: 'Invalid payment amount' });
      return;
    }

    setIsProcessing(true);
    setMessage({ type: '', text: '' });

    try {
      const ref = `ORD-${Date.now()}`;
      setOrderRef(ref);

      const result = await MpesaService.initiateStkPush(
        formData.mpesaNumber,
        totalPrice,
        ref
      );

      if (result.success) {
        setMessage({ type: 'success', text: result.message });
        
        // Wait 3 seconds before moving to confirmation
        setTimeout(() => {
          setStep(3);
          clearCart();
        }, 3000);
      } else {
        setMessage({ type: 'error', text: result.message });
      }
    } catch (error) {
      setMessage({ type: 'error', text: `Error: ${error.message}` });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCardPayment = async () => {
    setIsProcessing(true);
    setMessage({ type: '', text: '' });

    try {
      const ref = `ORD-${Date.now()}`;
      setOrderRef(ref);

      const result = await PesapalService.initiatePayment(
        totalPrice,
        ref,
        {
          email: formData.email,
          phone: formData.phone,
          firstName: formData.name.split(' ')[0],
          lastName: formData.name.split(' ').slice(1).join(' ') || formData.name,
        }
      );

      if (!result || !result.success) {
        setMessage({ type: 'error', text: result?.message || 'Failed to initialize payment' });
      }
      // Redirect happens automatically in PesapalService
    } catch (error) {
      setMessage({ type: 'error', text: `Error: ${error.message}` });
      setIsProcessing(false);
    }
  };

  if (cart.length === 0 && step !== 3) {
    return (
      <div className="checkout-container">
        <div className="empty-cart-message">
          <h2>Your cart is empty</h2>
          <p>Add some products before checking out</p>
          <Link to="/" className="btn-primary">Continue Shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <div className="checkout-steps">
        <div className={`step ${step >= 1 ? 'active' : ''} ${step === 1 ? 'current' : ''}`}>
          <span>1</span>
          <p>Delivery</p>
        </div>
        <div className={`step ${step >= 2 ? 'active' : ''} ${step === 2 ? 'current' : ''}`}>
          <span>2</span>
          <p>Payment</p>
        </div>
        <div className={`step ${step >= 3 ? 'active' : ''} ${step === 3 ? 'current' : ''}`}>
          <span>3</span>
          <p>Confirm</p>
        </div>
      </div>

      <div className="checkout-content">
        {step === 1 && (
          <div className="checkout-form">
            <h2>Delivery Details</h2>
            
            <div className="form-group">
              <label>Full Name *</label>
              <input 
                type="text"
                placeholder="John Doe" 
                value={formData.name} 
                onChange={e => setFormData({...formData, name: e.target.value})}
                disabled={isProcessing}
              />
            </div>

            <div className="form-group">
              <label>Email *</label>
              <input 
                type="email"
                placeholder="john@example.com" 
                value={formData.email} 
                onChange={e => setFormData({...formData, email: e.target.value})}
                disabled={isProcessing}
              />
            </div>

            <div className="form-group">
              <label>Phone Number *</label>
              <input 
                type="tel"
                placeholder="0712345678" 
                value={formData.phone} 
                onChange={e => setFormData({...formData, phone: e.target.value})}
                disabled={isProcessing}
              />
            </div>

            <div className="form-group">
              <label>Delivery Address *</label>
              <textarea 
                placeholder="Your complete delivery address" 
                value={formData.address} 
                onChange={e => setFormData({...formData, address: e.target.value})}
                rows="4"
                disabled={isProcessing}
              />
            </div>

            <div className="form-actions">
              <Link to="/cart" className="btn-secondary">Back to Cart</Link>
              <button 
                className="btn-primary" 
                onClick={handleContinueToPayment}
                disabled={isProcessing}
              >
                Continue to Payment
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="payment-section">
            <h2>Choose Payment Method</h2>
            <p className="total-amount">Total: {formatCurrency(totalPrice)}</p>

            <div className="payment-methods">
              <div className={`payment-method ${paymentMethod === 'mpesa' ? 'selected' : ''}`} onClick={() => setPaymentMethod('mpesa')}>
                <div className="method-icon">
                  <Smartphone size={32} color="#07a41e" />
                </div>
                <div className="method-info">
                  <h3>M-Pesa</h3>
                  <p>STK Push to your phone</p>
                </div>
              </div>

              <div className={`payment-method ${paymentMethod === 'card' ? 'selected' : ''}`} onClick={() => setPaymentMethod('card')}>
                <div className="method-icon">
                  <CreditCard size={32} color="#1976d2" />
                </div>
                <div className="method-info">
                  <h3>Card Payment</h3>
                  <p>Visa, Mastercard, AmEx</p>
                </div>
              </div>
            </div>

            {paymentMethod === 'mpesa' && (
              <div className="mpesa-payment">
                <h3>M-Pesa Payment</h3>
                <div className="form-group">
                  <label>M-Pesa Phone Number *</label>
                  <input 
                    type="tel"
                    placeholder="0712345678" 
                    value={formData.mpesaNumber} 
                    onChange={e => setFormData({...formData, mpesaNumber: e.target.value})}
                    disabled={isProcessing}
                  />
                  <small>We'll send you an STK Push. Enter your M-Pesa PIN to complete payment.</small>
                </div>
              </div>
            )}

            {paymentMethod === 'card' && (
              <div className="card-payment">
                <h3>Card Payment</h3>
                <p>You'll be redirected to a secure Pesapal payment page to enter your card details.</p>
              </div>
            )}

            {message.text && (
              <div className={`message message-${message.type}`}>
                {message.text}
              </div>
            )}

            <div className="payment-actions">
              <button 
                className="btn-secondary" 
                onClick={() => setStep(1)}
                disabled={isProcessing}
              >
                Back
              </button>
              <button 
                className="btn-primary" 
                onClick={paymentMethod === 'mpesa' ? handleMpesaPayment : handleCardPayment}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Loader size={16} style={{ display: 'inline', marginRight: '8px' }} />
                    Processing...
                  </>
                ) : (
                  `Pay ${formatCurrency(totalPrice)}`
                )}
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="order-confirmation">
            <div className="success-icon">✓</div>
            <h2>Order Confirmed! 🎉</h2>
            <p className="customer-name">Thank you, {formData.name.split(' ')[0]}!</p>
            <p>Your order has been placed successfully.</p>
            
            <div className="order-details">
              <div className="detail-row">
                <span>Order Reference:</span>
                <strong>{orderRef}</strong>
              </div>
              <div className="detail-row">
                <span>Total Amount:</span>
                <strong>{formatCurrency(totalPrice)}</strong>
              </div>
              <div className="detail-row">
                <span>Delivery Address:</span>
                <strong>{formData.address}</strong>
              </div>
              <div className="detail-row">
                <span>Contact:</span>
                <strong>{formData.phone}</strong>
              </div>
            </div>

            <div className="next-steps">
              <h3>What's Next?</h3>
              <ul>
                <li>✓ We've sent a confirmation email to {formData.email}</li>
                <li>✓ You'll receive a WhatsApp message with tracking details</li>
                <li>✓ Expected delivery: 2-3 business days</li>
              </ul>
            </div>

            <Link to="/" className="btn-primary">Continue Shopping</Link>
          </div>
        )}
      </div>

      <aside className="order-summary">
        <h3>Order Summary</h3>
        <div className="summary-items">
          {cart.map(item => (
            <div key={item.id} className="summary-item">
              <span>{item.name} × {item.quantity}</span>
              <span>{formatCurrency(item.price * item.quantity)}</span>
            </div>
          ))}
        </div>
        <div className="summary-total">
          <span>Total:</span>
          <strong>{formatCurrency(totalPrice)}</strong>
        </div>
      </aside>
    </div>
  );
}