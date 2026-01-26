import { useState, useMemo } from 'react';
import { useProducts } from '../../context/ProductContext';
import { useCart } from '../../context/CartContext';
import { ProductCard } from '../../components/ProductCard/ProductCard';
import { Heart, Filter, Grid, List } from 'lucide-react';
import './SeasonBundling.css';

export function SeasonBundling() {
  const { products } = useProducts();
  const { addToCart } = useCart();
  const [selectedBundle, setSelectedBundle] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('grid');
  const [priceRange, setPriceRange] = useState([0, 999999]);
  const [favorites, setFavorites] = useState([]);

  // Season bundles configuration
  const bundles = [
    { id: 'all', name: 'All Season Bundles', icon: '🎯' },
    { id: 'summer', name: 'Summer Collection', icon: '☀️', color: '#FF6B6B' },
    { id: 'winter', name: 'Winter Collection', icon: '❄️', color: '#4ECDC4' },
    { id: 'spring', name: 'Spring Collection', icon: '🌸', color: '#95E1D3' },
    { id: 'fall', name: 'Fall Collection', icon: '🍂', color: '#FFB347' },
    { id: 'trending', name: 'Trending Now', icon: '🔥', color: '#FF8C42' },
    { id: 'deals', name: 'Special Deals', icon: '💰', color: '#6BCB77' },
  ];

  // Filter and categorize products by bundle
  const filteredProducts = useMemo(() => {
    let filtered = products;

    // Filter by bundle
    if (selectedBundle !== 'all') {
      filtered = filtered.filter(product => {
        const bundleTag = product.tags?.includes(selectedBundle) || 
                         product.category_slug?.includes(selectedBundle) ||
                         (selectedBundle === 'deals' && product.discount) ||
                         (selectedBundle === 'trending' && product.trending);
        return bundleTag;
      });
    }

    // Filter by price range
    filtered = filtered.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    // Sort products
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'popular':
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'newest':
      default:
        filtered.sort((a, b) => (b.id || 0) - (a.id || 0));
        break;
    }

    return filtered;
  }, [products, selectedBundle, priceRange, sortBy]);

  const toggleFavorite = (productId) => {
    setFavorites(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const getBundleProducts = (bundleId) => {
    if (bundleId === 'all') return products.length;
    return products.filter(p => 
      p.tags?.includes(bundleId) || 
      p.category_slug?.includes(bundleId) ||
      (bundleId === 'deals' && p.discount) ||
      (bundleId === 'trending' && p.trending)
    ).length;
  };

  return (
    <div className="season-bundling">
      <div className="bundling-header">
        <div className="header-content">
          <h1>🛍️ Season Bundling Collections</h1>
          <p>Explore our curated seasonal collections and special bundles</p>
        </div>
      </div>

      <div className="bundling-container">
        {/* Bundle Selector */}
        <div className="bundle-selector">
          <div className="bundle-scroll">
            {bundles.map(bundle => (
              <button
                key={bundle.id}
                className={`bundle-btn ${selectedBundle === bundle.id ? 'active' : ''}`}
                onClick={() => setSelectedBundle(bundle.id)}
                style={selectedBundle === bundle.id && bundle.color ? 
                  { borderColor: bundle.color, color: bundle.color } : {}
                }
              >
                <span className="bundle-icon">{bundle.icon}</span>
                <span className="bundle-name">{bundle.name}</span>
                <span className="bundle-count">({getBundleProducts(bundle.id)})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="bundling-main">
          {/* Filters & Controls */}
          <div className="controls-bar">
            <div className="filter-group">
              <Filter size={18} />
              <div className="price-filter">
                <label>Price Range:</label>
                <input 
                  type="range" 
                  min="0" 
                  max="100000" 
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="price-slider"
                />
                <span>KES 0 - KES {priceRange[1].toLocaleString()}</span>
              </div>
            </div>

            <div className="sort-view">
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="sort-select">
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="popular">Most Popular</option>
              </select>

              <div className="view-toggle">
                <button 
                  className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                  onClick={() => setViewMode('grid')}
                  title="Grid View"
                >
                  <Grid size={18} />
                </button>
                <button 
                  className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                  onClick={() => setViewMode('list')}
                  title="List View"
                >
                  <List size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Products Display */}
          <div className={`products-container products-${viewMode}`}>
            {filteredProducts.length > 0 ? (
              filteredProducts.map(product => (
                <div key={product.id} className={`product-wrapper ${viewMode}`}>
                  <div className="product-item">
                    <ProductCard 
                      product={product}
                      onAddToCart={() => addToCart(product)}
                    />
                    <button
                      className={`favorite-btn ${favorites.includes(product.id) ? 'active' : ''}`}
                      onClick={() => toggleFavorite(product.id)}
                      title={favorites.includes(product.id) ? 'Remove from favorites' : 'Add to favorites'}
                    >
                      <Heart 
                        size={20} 
                        fill={favorites.includes(product.id) ? 'currentColor' : 'none'}
                      />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-products">
                <p>No products found in this collection.</p>
                <p>Try adjusting your filters or selecting a different bundle.</p>
              </div>
            )}
          </div>

          {/* Results Summary */}
          {filteredProducts.length > 0 && (
            <div className="results-summary">
              <p>Showing <strong>{filteredProducts.length}</strong> products from {bundles.find(b => b.id === selectedBundle)?.name}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
