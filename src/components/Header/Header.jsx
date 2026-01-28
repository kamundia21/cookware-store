import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Search, ChevronDown } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useState, useRef, useEffect } from 'react';
import './Header.css';

export function Header() {
  const { getTotalItems } = useCart();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const categoryRef = useRef(null);
  const profileRef = useRef(null);

  const cartItemCount = getTotalItems();

  const categories = [
    ['cookware', 'Cookware'],
    ['knives', 'Knives'],
    ['plates', 'Plates'],
    ['cups', 'Cups'],
    ['glasses', 'Glasses'],
    ['fancyplastic', 'Fancy Plastic'],
    ['kitchenaccesories', 'Accessories'],
    ['decor', 'Decor'],
    ['flaskbottles', 'Flasks & Bottles'],
  ];

  useEffect(() => {
    const handleOutside = (e) => {
      if (
        !categoryRef.current?.contains(e.target) &&
        !profileRef.current?.contains(e.target)
      ) {
        setIsCategoryOpen(false);
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    setSearchQuery('');
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-row">

          {/* LOGO */}
          <Link to="/" className="logo">
            <img
              src="/Image/Advenco Logo-1.png"
              alt="Advenco"
              className="logo-image"
            />
          </Link>

          {/* SEARCH (NO WRAPPER) */}
          <form className="search-form" onSubmit={handleSearch}>
            <Search size={18} className="search-icon" />
            <input
              type="search"
              className="search-input"
              placeholder="Search kitchenware..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>

          {/* CATEGORY */}
          <div className="category-dropdown" ref={categoryRef}>
            <button
              className="category-btn"
              onClick={() => setIsCategoryOpen(v => !v)}
            >
              Categories <ChevronDown size={16} />
            </button>

            {isCategoryOpen && (
              <div className="category-menu">
                {categories.map(([slug, label]) => (
                  <Link
                    key={slug}
                    to={`/category/${slug}`}
                    className="category-item"
                    onClick={() => setIsCategoryOpen(false)}
                  >
                    {label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* ICONS (SAME HEIGHT) */}
          <div className="icon-group">
            <div className="profile-dropdown" ref={profileRef}>
              <button
                className="icon-button"
                onClick={() => setIsProfileOpen(v => !v)}
              >
                <User size={20} />
              </button>

              {isProfileOpen && (
                <div className="profile-menu">
                  <Link to="/login" className="profile-item">Login</Link>
                  <Link to="/register" className="profile-item">Register</Link>
                  <Link to="/admin/add-product" className="profile-item admin-link">
                    Admin Panel
                  </Link>
                </div>
              )}
            </div>
            

            <Link to="/cart" className="icon-button cart-button">
              <ShoppingCart size={20} />
              {cartItemCount > 0 && (
                <span className="cart-badge">{cartItemCount}</span>
              )}
            </Link>
          </div>

        </div>
      </div>
    </header>
  );
}
