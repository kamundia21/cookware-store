import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, Search, MessageCircle, Minus, Plus } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useProducts } from '../../context/ProductContext';
import { useState, useEffect, useRef } from 'react';
import './Header.css';

export function Header() {
  const { getTotalItems } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const profileRef = useRef(null);
  
  const cartItemCount = getTotalItems();

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsProfileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleMobileMenu = () => setIsMobileMenuOpen(prev => !prev);
  const toggleProfile = () => setIsProfileOpen(prev => !prev);
  const isActive = (path) => location.pathname === path;

  const navItems = [
    ['/season-bundling', '🎯 Season Bundles'],
    ['/category/cookware', 'Cookware'],
    ['/category/knives', 'Knives'],
    ['/category/plates', 'Plates'],
    ['/category/cups', 'Cups'],
    ['/category/glasses', 'Glasses'],
    ['/category/fancyplastic', 'Fancy Plastic'],
    ['/category/kitchenaccesories', 'Kitchen Accessories'],
    ['/category/decor', 'Decor'],
    ['/category/flaskbottles', 'Flask & Bottles'],
    ['/category/mats', 'Mats'],
    ['/category/tray', 'Tray'],
    ['/category/saltshakers', 'Salt Shakers'],
    ['/category/sugardish', 'Sugardish'],
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsMobileMenuOpen(false);
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleAuthAction = () => {
    if (!isLoggedIn) {
      setIsLoggedIn(true);
      localStorage.setItem('admin_auth', 'true');
    } else {
      setIsLoggedIn(false);
      localStorage.removeItem('admin_auth');
    }
  };

  return (
    <>
      <header className="header">
        <div className="header-container">
          <div className="header-top">
            <Link to="/" className="logo" aria-label="Advenco Global Home">
              <img 
                src="/Image/Advenco Logo-1.png" 
                alt="Advenco Global Logo" 
                className="logo-image"
                onError={(e) => {
                  e.target.src = '/placeholders/logo-placeholder.svg';
                  console.log('Logo failed to load, using local placeholder');
                }}
              />
              <div className="logo-text">
                <span className="logo-main">Advenco</span>
                <span className="logo-sub">Hotel Supplies·Kitchenware·Decor</span>
              </div>
            </Link>

            <form className="search-form" onSubmit={handleSearch}>
              <div className="search-wrapper">
                <Search className="search-icon" size={18} />
                <input
                  type="search"
                  className="search-input"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="Search products"
                />
              </div>
            </form>

            <div className="header-actions">
              <div className="profile-dropdown" ref={profileRef}>
                <button className="icon-button profile-button" onClick={toggleProfile}>
                  <User size={20} />
                </button>
                <div className={`dropdown-menu ${isProfileOpen ? 'open' : ''}`}>
                  <div className="dropdown-header">
                    <div className="user-avatar"><User size={24} /></div>
                    <div className="user-info">
                      <p className="user-name">{isLoggedIn ? 'Admin User' : 'Guest'}</p>
                      <p className="user-status">{isLoggedIn ? 'Administrator' : 'Not logged in'}</p>
                    </div>
                  </div>
                  <div className="dropdown-divider"></div>
                  {isLoggedIn ? (
                    <>
                      <Link to="/orders" className="dropdown-item"><MessageCircle size={16} /><span>My Orders</span></Link>
                      <Link to="/profile" className="dropdown-item"><MessageCircle size={16} /><span>Profile Settings</span></Link>
                      <button className="dropdown-item logout-btn" onClick={() => { handleAuthAction(); setIsProfileOpen(false); }}><MessageCircle size={16} /><span>Logout</span></button>
                    </>
                  ) : (
                    <>
                      <Link to="/login" className="dropdown-item"><MessageCircle size={16} /><span>Login</span></Link>
                      <Link to="/register" className="dropdown-item"><MessageCircle size={16} /><span>Register</span></Link>
                      <Link to="/admin/add-product" className="dropdown-item admin-link"><MessageCircle size={16} /><span>Admin Panel</span></Link>
                    </>
                  )}
                </div>
              </div>

              <Link to="/cart" className="icon-button cart-button" aria-label={`Shopping cart with ${cartItemCount} items`}>
                <ShoppingCart size={20} />
                {cartItemCount > 0 && <span className="cart-badge">{cartItemCount}</span>}
              </Link>

              <button className="icon-button mobile-menu-toggle" onClick={toggleMobileMenu}>
                {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          <div className="header-bottom">
            <nav className="nav-categories">
              {navItems.map(([path, label]) => (
                <Link key={path} to={path} className={`category-link ${isActive(path) ? 'active' : ''}`}>
                  {label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </header>

      <nav className={`nav-mobile ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="nav-mobile-content">
          <form className="search-form mobile-search-form" onSubmit={handleSearch}>
            <div className="search-wrapper">
              <Search className="search-icon" size={18} />
              <input type="search" className="search-input" placeholder="Search products..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
          </form>
          {navItems.map(([path, label]) => (
            <Link key={path} to={path} className={`nav-link ${isActive(path) ? 'active' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>
              {label}
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}