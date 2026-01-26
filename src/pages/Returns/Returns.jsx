import { Link } from 'react-router-dom';
import { RefreshCw, Calendar, Package, Phone } from 'lucide-react';
import './Returns.css';

export function Returns() {
  return (
    <div className="page-container">
      <Link to="/" className="back-link">← Back to Home</Link>
      
      <h1>Returns Policy</h1>
      <p className="intro">We want you to be satisfied with your purchase. If not, we're here to help.</p>
      
      <div className="returns-steps">
        <div className="step">
          <Calendar size={24} />
          <h3>7-Day Window</h3>
          <p>Return products within 7 days of delivery.</p>
        </div>
        
        <div className="step">
          <Package size={24} />
          <h3>Original Condition</h3>
          <p>Products must be unused and in original packaging.</p>
        </div>
        
        <div className="step">
          <RefreshCw size={24} />
          <h3>Instant Refund</h3>
          <p>Refunds processed within 24 hours of receiving return.</p>
        </div>
      </div>

      <div className="return-process">
        <h3>How to Return</h3>
        <ol>
          <li>Call us at <a href="tel:+254726380266">0726 380 266</a></li>
          <li>Provide order number and reason</li>
        </ol>
      </div>
    </div>
  );
}