import { X, Plus, Minus, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import './Cart.css';

export function Cart() {
  const { cart, isOpen, setIsOpen, updateQuantity, removeFromCart, getTotalPrice } = useCart();

  if (!isOpen) return null;

  return (
    <div className="cart-overlay">
      <div className="cart-backdrop" onClick={() => setIsOpen(false)} />
      <div className="cart-panel">
        <div className="cart-header">
          <h2>Shopping Cart</h2>
          <button onClick={() => setIsOpen(false)}>
            <X size={20} />
          </button>
        </div>
        
        <div className="cart-body">
          {cart.length === 0 ? (
            <div className="empty-cart">
              <ShoppingCart size={48} className="empty-icon" />
              <p>Your cart is empty</p>
              <Link to="/" onClick={() => setIsOpen(false)}>Continue Shopping</Link>
            </div>
          ) : (
            <div className="cart-items">
              {cart.map(item => (
                <div key={item.id} className="cart-item">
                  <img src={item.image} alt={item.name} className="item-image" />
                  <div className="item-details">
                    <h4>{item.name}</h4>
                    <p className="item-price">${item.price}</p>
                    <div className="quantity-controls">
                      <button onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}>
                        <Minus size={16} />
                      </button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                  <button className="remove-btn" onClick={() => removeFromCart(item.id)}>Remove</button>
                </div>
              ))}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div className="cart-footer">
            <div className="total">
              <span>Total</span>
              <span className="total-amount">${getTotalPrice().toFixed(2)}</span>
            </div>
            <Link to="/checkout" className="checkout-btn" onClick={() => setIsOpen(false)}>
              Checkout
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}