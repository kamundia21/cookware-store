import { useParams, Link, useNavigate } from 'react-router-dom';
import { useProducts } from '../../context/ProductContext';
import { useCart } from '../../context/CartContext';
import { ShoppingCart, ArrowLeft, Minus, Plus, CreditCard, Loader } from 'lucide-react';
import { useState, useEffect } from 'react';
import { MpesaService } from '../../utils/paymentService';
import './ProductDetail.css';

export function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, loading } = useProducts();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('mpesa');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [processingPayment, setProcessingPayment] = useState(false);
  const [paymentMessage, setPaymentMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (!loading) {
      const foundProduct = products.find(p => p.id === id);
      setProduct(foundProduct);
    }
  }, [id, products, loading]);

  const handlePayNow = async () => {
    setPaymentMessage({ type: '', text: '' });

    if (!phoneNumber.trim()) {
      setPaymentMessage({ type: 'error', text: 'Please enter your phone number' });
      return;
    }

    // Validate phone number format
    const phoneRegex = /^(0|\+?254)\d{9}$/;
    if (!phoneRegex.test(phoneNumber)) {
      setPaymentMessage({ type: 'error', text: 'Please enter a valid phone number (e.g., 0712345678)' });
      return;
    }

    setProcessingPayment(true);
    const totalAmount = product.price * quantity;
    const orderRef = `ORD-${Date.now()}`;

    try {
      if (paymentMethod === 'mpesa') {
        const result = await MpesaService.initiateStkPush(phoneNumber, totalAmount, orderRef);
        
        if (result.success) {
          setPaymentMessage({ type: 'success', text: result.message });
          
          // Store order info for reference
          localStorage.setItem('lastOrder', JSON.stringify({
            product: product.name,
            quantity: quantity,
            amount: totalAmount,
            phone: phoneNumber,
            orderRef: orderRef,
            timestamp: new Date().toISOString(),
          }));

          // Close modal after 3 seconds
          setTimeout(() => {
            setShowPaymentModal(false);
            setPhoneNumber('');
            navigate('/cart');
          }, 3000);
        } else {
          setPaymentMessage({ type: 'error', text: result.message });
        }
      }
    } catch (error) {
      setPaymentMessage({ type: 'error', text: `Payment error: ${error.message}` });
    } finally {
      setProcessingPayment(false);
    }
  };

  if (loading) return <div className="loading"><div className="spinner"></div></div>;
  
  if (!product) return (
    <div className="not-found">
      <h1>Product Not Found</h1>
      <Link to="/" className="back-btn"><ArrowLeft />Back to Products</Link>
    </div>
  );

  const totalPrice = product.price * quantity;

  return (
    <div className="product-detail-container">
      <Link to="/" className="back-button">
        <ArrowLeft size={20} />Back to Products
      </Link>

      <div className="product-detail-content">
        <div className="product-image-section">
          <img 
            src={product.image_url} 
            alt={product.name}
            className="main-image"
            onError={(e) => e.target.src = '/placeholders/image-placeholder.svg'}
          />
        </div>

        <div className="product-info-section">
          <h1 className="product-title">{product.name}</h1>
          
          <div className="product-meta">
            <span className="category-badge">{product.category_slug}</span>
            {product.in_stock ? (
              <span className="stock-badge in-stock">In Stock</span>
            ) : (
              <span className="stock-badge out-of-stock">Out of Stock</span>
            )}
          </div>

          <div className="product-price">KES {product.price.toLocaleString()}</div>

          <div className="product-description">
            <h3>Description</h3>
            <p>{product.description || 'No description available.'}</p>
          </div>

          <div className="add-to-cart-section">
            <div className="quantity-selector">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={!product.in_stock}
              >
                <Minus size={16} />
              </button>
              <span className="quantity-display">{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                disabled={!product.in_stock}
              >
                <Plus size={16} />
              </button>
            </div>

            <div className="price-total">
              Total: <strong>KES {totalPrice.toLocaleString()}</strong>
            </div>

            <div className="action-buttons">
              <button 
                className="add-to-cart-btn"
                onClick={() => addToCart(product, quantity)}
                disabled={!product.in_stock}
              >
                <ShoppingCart size={20} />
                Add to Cart
              </button>

              <button 
                className="pay-now-btn"
                onClick={() => setShowPaymentModal(true)}
                disabled={!product.in_stock}
              >
                <CreditCard size={20} />
                Pay Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="payment-modal-overlay" onClick={() => !processingPayment && setShowPaymentModal(false)}>
          <div className="payment-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Quick Payment</h2>
              <button 
                className="close-btn" 
                onClick={() => setShowPaymentModal(false)}
                disabled={processingPayment}
              >
                ✕
              </button>
            </div>

            <div className="modal-body">
              <div className="order-summary">
                <p><strong>{product.name}</strong></p>
                <p>Quantity: {quantity}</p>
                <p className="amount">Amount: <strong>KES {totalPrice.toLocaleString()}</strong></p>
              </div>

              {paymentMessage.text && (
                <div className={`message ${paymentMessage.type}`}>
                  {paymentMessage.text}
                </div>
              )}

              <div className="payment-method-selector">
                <label className="radio-label">
                  <input
                    type="radio"
                    value="mpesa"
                    checked={paymentMethod === 'mpesa'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    disabled={processingPayment}
                  />
                  <span>📱 M-Pesa</span>
                </label>
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  id="phone"
                  type="tel"
                  placeholder="0712345678"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  disabled={processingPayment}
                  pattern="(0|\+?254)\d{9}"
                />
                <small>Format: 0712345678 or +254712345678</small>
              </div>

              <div className="modal-actions">
                <button
                  className="cancel-btn"
                  onClick={() => setShowPaymentModal(false)}
                  disabled={processingPayment}
                >
                  Cancel
                </button>
                <button
                  className="pay-btn"
                  onClick={handlePayNow}
                  disabled={processingPayment}
                >
                  {processingPayment ? (
                    <>
                      <Loader size={18} className="spinner-icon" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard size={18} />
                      Pay KES {totalPrice.toLocaleString()}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}