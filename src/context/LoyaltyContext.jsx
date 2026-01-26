import { createContext, useContext, useState, useEffect } from 'react';

const LoyaltyContext = createContext();

export function LoyaltyProvider({ children }) {
  const [loyaltyData, setLoyaltyData] = useState({
    points: 0,
    tier: 'bronze',
    totalSpent: 0,
    joinDate: new Date().toISOString(),
  });

  // Load loyalty data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('loyaltyData');
    if (savedData) {
      setLoyaltyData(JSON.parse(savedData));
    }
  }, []);

  // Save loyalty data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('loyaltyData', JSON.stringify(loyaltyData));
  }, [loyaltyData]);

  const addPoints = (amount) => {
    setLoyaltyData(prev => {
      const newPoints = prev.points + amount;
      const newTier = calculateTier(newPoints);
      return {
        ...prev,
        points: newPoints,
        tier: newTier,
      };
    });
  };

  const recordPurchase = (amount) => {
    const points = Math.floor(amount / 10); // 1 point per 10 KES spent
    setLoyaltyData(prev => {
      const newPoints = prev.points + points;
      const newTier = calculateTier(newPoints);
      return {
        ...prev,
        points: newPoints,
        tier: newTier,
        totalSpent: prev.totalSpent + amount,
      };
    });
  };

  const redeemPoints = (points) => {
    if (loyaltyData.points >= points) {
      setLoyaltyData(prev => ({
        ...prev,
        points: prev.points - points,
      }));
      return true;
    }
    return false;
  };

  const calculateTier = (points) => {
    if (points >= 5000) return 'platinum';
    if (points >= 3000) return 'gold';
    if (points >= 1000) return 'silver';
    return 'bronze';
  };

  const getTierBenefits = () => {
    const benefits = {
      bronze: {
        name: 'Bronze Member',
        color: '#CD7F32',
        benefits: ['Earn 1 point per 10 KES', 'Birthday discount'],
        maxDiscount: 5,
      },
      silver: {
        name: 'Silver Member',
        color: '#C0C0C0',
        benefits: ['Earn 1.5 points per 10 KES', '10% discount on purchases', 'Free shipping'],
        maxDiscount: 10,
      },
      gold: {
        name: 'Gold Member',
        color: '#FFD700',
        benefits: ['Earn 2 points per 10 KES', '15% discount on purchases', 'Free shipping', 'Early access to sales'],
        maxDiscount: 15,
      },
      platinum: {
        name: 'Platinum Member',
        color: '#E5E4E2',
        benefits: ['Earn 3 points per 10 KES', '20% discount on purchases', 'Free shipping', 'VIP support', 'Exclusive products'],
        maxDiscount: 20,
      },
    };
    return benefits[loyaltyData.tier];
  };

  const getPointsToNextTier = () => {
    const tiers = {
      bronze: 1000,
      silver: 3000,
      gold: 5000,
      platinum: Infinity,
    };
    return tiers[loyaltyData.tier] - loyaltyData.points;
  };

  return (
    <LoyaltyContext.Provider value={{
      loyaltyData,
      addPoints,
      recordPurchase,
      redeemPoints,
      getTierBenefits,
      getPointsToNextTier,
    }}>
      {children}
    </LoyaltyContext.Provider>
  );
}

export const useLoyalty = () => useContext(LoyaltyContext);
