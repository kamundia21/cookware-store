import { useLoyalty } from '../../context/LoyaltyContext';
import { Award, Gift, TrendingUp, Crown } from 'lucide-react';
import './LoyaltyProgram.css';

export function LoyaltyProgram() {
  const { loyaltyData, getTierBenefits, getPointsToNextTier } = useLoyalty();
  const tierBenefits = getTierBenefits();
  const pointsToNextTier = getPointsToNextTier();

  const tiers = [
    { level: 'bronze', name: 'Bronze Member', color: '#CD7F32', points: '0 - 999', icon: '🥉' },
    { level: 'silver', name: 'Silver Member', color: '#C0C0C0', points: '1000 - 2999', icon: '🥈' },
    { level: 'gold', name: 'Gold Member', color: '#FFD700', points: '3000 - 4999', icon: '🥇' },
    { level: 'platinum', name: 'Platinum Member', color: '#E5E4E2', points: '5000+', icon: '👑' },
  ];

  return (
    <div className="loyalty-container">
      <section className="loyalty-hero">
        <div className="hero-content">
          <h1>💎 Customer Loyalty Program</h1>
          <p>Earn points on every purchase and unlock exclusive rewards</p>
        </div>
      </section>

      <section className="loyalty-card">
        <div className="loyalty-header">
          <div className="loyalty-tier">
            <div className="tier-badge" style={{ '--tier-color': tierBenefits.color }}>
              {tierBenefits.name}
            </div>
            <div className="tier-icon">
              {loyaltyData.tier === 'bronze' && '🥉'}
              {loyaltyData.tier === 'silver' && '🥈'}
              {loyaltyData.tier === 'gold' && '🥇'}
              {loyaltyData.tier === 'platinum' && '👑'}
            </div>
          </div>
          <div className="loyalty-stats">
            <div className="stat">
              <span className="label">Current Points</span>
              <span className="value">{loyaltyData.points.toLocaleString()}</span>
            </div>
            <div className="stat">
              <span className="label">Total Spent</span>
              <span className="value">KES {loyaltyData.totalSpent.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {loyaltyData.tier !== 'platinum' && (
          <div className="progress-section">
            <p className="progress-text">
              {pointsToNextTier} points to next tier
            </p>
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{
                  width: `${Math.min((loyaltyData.points / getPointsToNextTier()) * 100, 100)}%`
                }}
              />
            </div>
          </div>
        )}
      </section>

      <section className="benefits-section">
        <h2>Your Benefits</h2>
        <div className="benefits-grid">
          {tierBenefits.benefits.map((benefit, idx) => (
            <div key={idx} className="benefit-card">
              <Gift size={24} />
              <p>{benefit}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="tiers-section">
        <h2>Tier System</h2>
        <div className="tiers-grid">
          {tiers.map(tier => (
            <div 
              key={tier.level} 
              className={`tier-card ${loyaltyData.tier === tier.level ? 'active' : ''}`}
              style={{ '--tier-color': tier.color }}
            >
              <div className="tier-header">
                <span className="tier-icon-large">{tier.icon}</span>
                <h3>{tier.name}</h3>
              </div>
              <p className="tier-points">Points: {tier.points}</p>
              <ul className="tier-perks">
                {tier.level === 'bronze' && (
                  <>
                    <li>✓ Earn reward points</li>
                    <li>✓ Birthday discount</li>
                  </>
                )}
                {tier.level === 'silver' && (
                  <>
                    <li>✓ 1.5x point multiplier</li>
                    <li>✓ 10% discount</li>
                    <li>✓ Free shipping</li>
                  </>
                )}
                {tier.level === 'gold' && (
                  <>
                    <li>✓ 2x point multiplier</li>
                    <li>✓ 15% discount</li>
                    <li>✓ Free shipping</li>
                    <li>✓ Early sale access</li>
                  </>
                )}
                {tier.level === 'platinum' && (
                  <>
                    <li>✓ 3x point multiplier</li>
                    <li>✓ 20% discount</li>
                    <li>✓ Free shipping</li>
                    <li>✓ VIP support</li>
                    <li>✓ Exclusive products</li>
                  </>
                )}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="rewards-section">
        <h2>How to Earn Points</h2>
        <div className="rewards-cards">
          <div className="reward-card">
            <TrendingUp size={32} />
            <h3>Purchase</h3>
            <p>Earn 1 point for every 10 KES spent</p>
          </div>
          <div className="reward-card">
            <Award size={32} />
            <h3>Referral</h3>
            <p>Earn 100 points when a friend makes their first purchase</p>
          </div>
          <div className="reward-card">
            <Gift size={32} />
            <h3>Birthday</h3>
            <p>Earn 500 bonus points during your birthday month</p>
          </div>
          <div className="reward-card">
            <Crown size={32} />
            <h3>Milestones</h3>
            <p>Earn bonus points reaching tier milestones</p>
          </div>
        </div>
      </section>

      <section className="faq-section">
        <h2>Frequently Asked Questions</h2>
        <div className="faq-grid">
          <div className="faq-item">
            <h4>How do I join?</h4>
            <p>Simply register an account and start earning points immediately on your purchases!</p>
          </div>
          <div className="faq-item">
            <h4>Can I redeem points?</h4>
            <p>Yes! You can redeem points for discounts on future purchases. 500 points = 500 KES discount.</p>
          </div>
          <div className="faq-item">
            <h4>Do points expire?</h4>
            <p>No, your points never expire as long as your account remains active.</p>
          </div>
          <div className="faq-item">
            <h4>Can I transfer points?</h4>
            <p>Points are non-transferable and exclusively for your account use.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
