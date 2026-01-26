import { Link } from 'react-router-dom';
import { Truck, Clock, Shield, MapPin } from 'lucide-react';
import './Shipping.css';

export function Shipping() {
  return (
    <div className="page-container">
      <Link to="/" className="back-link">← Back to Home</Link>
      
      <h1>Shipping & Delivery</h1>
      
      <div className="shipping-grid">
        <div className="info-card">
          <Truck size={32} />
          <h2>Nairobi Express</h2>
          <p>2-hour delivery available for Nairobi and surrounding areas</p>
          <p className="price">KSH 200 - 500</p>
        </div>
        
        <div className="info-card">
          <Clock size={32} />
          <h2>Countrywide Delivery</h2>
          <p>Next-day delivery to all major towns in Kenya</p>
          <p className="price">KSH 300 - 800</p>
        </div>
        
        <div className="info-card">
          <Shield size={32} />
          <h2>Free Delivery</h2>
          <p>Free on orders above KSH 5,000 within Nairobi</p>
        </div>
      </div>

      <div className="shipping-details">
        <h3>Delivery Process</h3>
        <ol>
          <li>Order confirmation via SMS/email</li>
          <li>Processing within 2 hours</li>
        </ol>
      </div>
    </div>
  );
}