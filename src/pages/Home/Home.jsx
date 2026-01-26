import { useProducts } from '../../context/ProductContext';
import { useLoyalty } from '../../context/LoyaltyContext';
import { ProductCard } from '../../components/ProductCard/ProductCard';
import { Link } from 'react-router-dom';
import { MessageCircle, Package, Shield, Truck, RefreshCw, Star, Heart, ArrowRight, Award, Gift } from 'lucide-react';
import './Home.css';

export function Home() {
  const { products } = useProducts();
  const { loyaltyData, getTierBenefits } = useLoyalty();
  
  // Create sections with real data
  const bestSellers = products.filter(p => p.price > 1000).slice(0, 4);
  const newArrivals = products.slice(-4);
  
  // Get seasonal products for preview
  const seasonalProducts = products.filter(p => p.tags?.some(tag => ['summer', 'winter', 'spring', 'fall'].includes(tag))).slice(0, 4);
  
  const tierBenefits = getTierBenefits();

  return (
    <div className="home-container">


      {/* Best Sellers */}
      <section className="bestsellers">
        <h2>⭐ Best Sellers</h2>
        <div className="products-grid">
          {bestSellers.length > 0 ? (
            bestSellers.map(p => <ProductCard key={p.id} product={p} />)
          ) : (
            <p>Loading products...</p>
          )}
        </div>
      </section>

      {/* Season Bundles Preview */}
      {seasonalProducts.length > 0 && (
        <section className="season-bundles-preview">
          <div className="preview-header">
            <div>
              <h2>🎯 Explore Season Bundles</h2>
              <p>Discover curated collections for every season</p>
            </div>
            <Link to="/season-bundling" className="view-all-btn">
              View All
              <ArrowRight size={18} />
            </Link>
          </div>
          <div className="products-grid">
            {seasonalProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* New Arrivals */}
      <section className="new-arrivals">
        <h2>🆕 New Arrivals</h2>
        <div className="products-grid">
          {newArrivals.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* Loyalty Program Preview */}
      <section className="loyalty-preview">
        <div className="loyalty-preview-card">
          <div className="loyalty-content">
            <h2>💎 Earn Rewards with Our Loyalty Program</h2>
            <p>Join our customer loyalty program and earn points on every purchase!</p>
            <div className="loyalty-highlights">
              <div className="highlight">
                <Award size={24} />
                <span>Earn 1 point per 10 KES spent</span>
              </div>
              <div className="highlight">
                <Gift size={24} />
                <span>Unlock exclusive tier benefits</span>
              </div>
              <div className="highlight">
                <Star size={24} />
                <span>Redeem points for discounts</span>
              </div>
            </div>
            <div className="loyalty-user-info">
              {loyaltyData?.tier ? (
                <>
                  <p className="user-tier">
                    Current Tier: <strong>{tierBenefits?.name}</strong>
                  </p>
                  <p className="user-points">
                    Your Points: <strong>{loyaltyData?.points?.toLocaleString() || 0}</strong>
                  </p>
                </>
              ) : (
                <p>Register to start earning points!</p>
              )}
            </div>
            <Link to="/loyalty" className="loyalty-btn">
              Learn More About Loyalty Program
              <ArrowRight size={18} />
            </Link>
          </div>
          <div className="loyalty-visual">
            <div className="loyalty-badge">
              {loyaltyData?.tier === 'bronze' && '🥉'}
              {loyaltyData?.tier === 'silver' && '🥈'}
              {loyaltyData?.tier === 'gold' && '🥇'}
              {loyaltyData?.tier === 'platinum' && '👑'}
              {!loyaltyData?.tier && '💎'}
            </div>
          </div>
        </div>
      </section>

      {/* Trust Signals */}
      <section className="trust-section">
        <div className="trust-item">
          <Shield size={32} />
          <h3>Secure Payment</h3>
          <p>M-Pesa & Cards Accepted</p>
        </div>
        <div className="trust-item">
          <Truck size={32} />
          <h3>2-Hour Delivery</h3>
          <p>Nairobi & Surrounds</p>
        </div>
        <div className="trust-item">
          <RefreshCw size={32} />
          <h3>Easy Returns</h3>
          <p>7-Day Guarantee</p>
        </div>
        <div className="trust-item">
          <Star size={32} />
          <h3>4.8/5 Rating</h3>
          <p>10,000+ Reviews</p>
        </div>
      </section>

      {/* WhatsApp Support */}
      <a href="https://wa.me/254700000000" target="_blank" rel="noopener noreferrer" className="whatsapp-float">
        <MessageCircle size={30} />
        <span>Need Help?</span>
      </a>
    </div>
  );
}