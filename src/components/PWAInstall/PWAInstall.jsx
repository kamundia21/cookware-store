import React, { useState, useEffect } from 'react';
import './PWAInstall.css';

export const PWAInstall = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    // Check if app is already installed
    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      setShowPrompt(false);
      setIsInstalled(true);
      // Hide prompt after 2 seconds
      setTimeout(() => setIsInstalled(false), 3000);
    };

    // Handle if app is in standalone mode (already installed)
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      alert('Installation is not available for your browser');
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setShowPrompt(false);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setDeferredPrompt(null);
  };

  if (isInstalled) {
    return (
      <div className="pwa-installed-toast">
        <span>✓ App installed successfully!</span>
      </div>
    );
  }

  if (!showPrompt) {
    return null;
  }

  return (
    <div className="pwa-install-container">
      <div className="pwa-install-card">
        <button className="pwa-close-btn" onClick={handleDismiss}>×</button>
        <h3>Install Cookware Store App</h3>
        <p>Get quick access to our store right from your home screen!</p>
        <div className="pwa-benefits">
          <div className="benefit-item">
            <span className="icon">⚡</span>
            <span>Fast access</span>
          </div>
          <div className="benefit-item">
            <span className="icon">📦</span>
            <span>Works offline</span>
          </div>
          <div className="benefit-item">
            <span className="icon">🔔</span>
            <span>Push notifications</span>
          </div>
        </div>
        <button className="pwa-install-btn" onClick={handleInstallClick}>
          Install Now
        </button>
        <button className="pwa-cancel-btn" onClick={handleDismiss}>
          Maybe Later
        </button>
      </div>
    </div>
  );
};

export default PWAInstall;
