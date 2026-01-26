import { useCart } from '../../context/CartContext';
import { Link } from 'react-router-dom';
import { Trash2, Minus, Plus, ShoppingCart, ArrowLeft } from 'lucide-react';
import './CartPage.css';

export function CartPage() {
  const { cart, updateQuantity, removeFromCart, getTotalPrice } = useCart();

  if (cart.length === 0) {
    return (
      <div className="empty-cart-container">
        <ShoppingCart size={48} />
        <h2>Your cart is empty</h2>
        <p>Add some products to get started!</p>
        <Link to="/" className="shop-btn">
          <ArrowLeft size={20} /> Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h1>Shopping Cart ({cart.length} items)</h1>
      
      <div className="cart-content">
        <div className="cart-items">
          {cart.map(item => (
            <div key={item.id} className="cart-item">
              <img src={item.image_url} alt={item.name} className="item-image" />
              
              <div className="item-details">
                <h3>{item.name}</h3>
                <p className="item-price">${item.price.toFixed(2)}</p>
              </div>
              
              <div className="quantity-controls">
                <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                  <Minus size={16} />
                </button>
                <span>{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                  <Plus size={16} />
                </button>
              </div>
              
              <div className="item-total">
                ${(item.price * item.quantity).toFixed(2)}
              </div>
              
              <button 
                className="remove-btn"
                onClick={() => removeFromCart(item.id)}
                aria-label="Remove item"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h2>Order Summary</h2>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>${getTotalPrice().toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span>Free</span>
          </div>
          <div className="summary-row total">
            <span>Total</span>
            <span>${getTotalPrice().toFixed(2)}</span>
          </div>
          
          <button className="checkout-btn">
            Proceed to Checkout
          </button>
          
          <Link to="/" className="continue-shopping">
            <ArrowLeft size={16} /> Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}