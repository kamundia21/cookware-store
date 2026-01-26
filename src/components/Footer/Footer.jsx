import { Link } from 'react-router-dom';
import { 
  Phone, Mail, MapPin, Instagram, Youtube, MessageCircle, Shield, 
  Truck, RefreshCw, Star, Heart, Clock, Headphones, Info, FileText
} from 'lucide-react';
import './Footer.css';

export function Footer() {
  return (
    <>
      <footer className="footer">
        <div className="footer-main">
          <div className="container">
            {/* Trust Signals Section */}
            <div className="trust-bar">
              <div className="trust-item">
                <Shield size={32} />
                <div>
                  <h4>Secure Payment</h4>
                  <p>M-Pesa & Cards Accepted</p>
                </div>
              </div>
              <div className="trust-item">
                <Truck size={32} />
                <div>
                  <h4>2-Hour Delivery</h4>
                  <p>Nairobi & Surrounds</p>
                </div>
              </div>
              <div className="trust-item">
                <RefreshCw size={32} />
                <div>
                  <h4>Easy Returns</h4>
                  <p>7-Day Guarantee</p>
                </div>
              </div>
              <div className="trust-item">
                <Star size={32} />
                <div>
                  <h4>4.8/5 Rating</h4>
                  <p>10,000+ Reviews</p>
                </div>
              </div>
            </div>

            {/* Footer Content */}
            <div className="footer-content">
              {/* Brand Section */}
              <div className="footer-section brand-section">
                <Link to="/" className="footer-logo">
                  <img 
                    src="/Image/Advenco Logo-1.png" 
                    alt="Advenco" 
                    className="footer-logo-img"
                    onError={(e) => e.src = '/placeholders/logo-placeholder.svg'}
                  />
                  <span>Advenco Global</span>
                </Link>
                <p className="tagline">Premium Kitchenware & Hotel Supplies Since 2018</p>
                <p className="address">
                  <MapPin size={16} />
                  <span>Nairobi, Kenya - Kamukunji Gateway Mall 2nd Floor Shop 24</span>
                </p>
              </div>

              {/* Customer Service with Working Links */}
              <div className="footer-section">
                <h3>Customer Service</h3>
                <ul>
                  <li>
                    <Link to="/shipping">
                      <Truck size={16} />
                      <span>Shipping & Delivery</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/returns">
                      <RefreshCw size={16} />
                      <span>Returns Policy</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/warranty">
                      <Shield size={16} />
                      <span>Warranty & Support</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/faq">
                      <Headphones size={16} />
                      <span>FAQ & Help</span>
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Resources with Correct Social Links */}
              <div className="footer-section">
                <h3>Resources</h3>
                <ul>
                  <li>
                    <a href="https://instagram.com/kitchen_wish" target="_blank" rel="noopener noreferrer">
                      <Instagram size={16} />
                      <span>Instagram: @kitchen_wish</span>
                    </a>
                  </li>
                  <li>
                    <a href="https://youtube.com/@advencokichenwish" target="_blank" rel="noopener noreferrer">
                      <Youtube size={16} />
                      <span>YouTube: advencokichenwish</span>
                    </a>
                  </li>
                  <li>
                    <Link to="/reviews">
                      <Star size={16} />
                      <span>Product Reviews</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/care-tips">
                      <Heart size={16} />
                      <span>Care Tips & Guides</span>
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Contact with Correct Info */}
              <div className="footer-section">
                <h3>Contact Us</h3>
                <ul className="contact-list">
                  <li>
                    <Phone size={16} />
                    <a href="tel:+254726380266">+254 726 380 266</a>
                  </li>
                  <li>
                    <Mail size={16} />
                    <a href="mailto:advencokitchenwish@gmail.com">advencokitchenwish@gmail.com</a>
                  </li>
                  <li>
                    <MessageCircle size={16} />
                    <a href="https://wa.me/254726380266" target="_blank" rel="noopener noreferrer">WhatsApp: 0726 380 266</a>
                  </li>
                  <li>
                    <MapPin size={16} />
                    <span>Mon-Sat: 8AM-6PM</span>
                  </li>
                </ul>

                <div className="social-proof">
                  <p>💬 <strong>WhatsApp Support</strong></p>
                  <p>Get instant help choosing products</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar with Policy Links */}
        <div className="footer-bottom">
          <div className="container">
            <p>&copy; 2026 Advenco Global. Kitchenware. Hotel Supplies. Decor. All rights reserved.</p>
            <div className="footer-links">
              <Link to="/privacy">Privacy Policy</Link>
              <Link to="/terms">Terms of Service</Link>
              <Link to="/return-policy">Return & Policy</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* WhatsApp Float Button */}
      <a 
        href="https://wa.me/254726380266?text=Hello%20Advenco%20Global,%20I%20need%20help%20choosing%20kitchenware" 
        target="_blank" 
        rel="noopener noreferrer" 
        className="whatsapp-float"
      >
        <MessageCircle size={24} />
        <span>Chat with Us</span>
      </a>
    </>
  );
}