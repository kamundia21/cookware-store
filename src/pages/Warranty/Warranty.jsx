import { Link } from 'react-router-dom';
import { Wrench } from 'lucide-react';;
import './Warranty.css';

export function Warranty() {
  return (
    <div className="page-container">
      <Link to="/" className="back-link">← Back to Home</Link>
      
      <h1>Warranty & Support</h1>
      
      <div className="warranty-grid">
        <div className="warranty-card">
          <Shield size={32} />
          <h2>1-Year Warranty</h2>
          <p>All products come with 1-year warranty against manufacturing defects.</p>
        </div>
        
        <div className="warranty-card">
          <Calendar size={32} />
          <h2>Coverage</h2>
          <p>Covers manufacturing defects, not physical damage.</p>
        </div>
        
        <div className="warranty-card">
          <Tools size={32} />
          <h2>Free Repairs</h2>
          <p>We'll repair or replace defective products at no cost.</p>
        </div>
      </div>

      <div className="support-contact">
        <h3>Need Support?</h3>
        <p>Call us: <a href="tel:+254726380266">0726 380 266</a></p>
        <p>Email: <a href="mailto:advencokitchenwish@gmail.com">advencokitchenwish@gmail.com</a></p>
      </div>
    </div>
  );
}