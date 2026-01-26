import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useProducts } from '../../context/ProductContext';
import { ProductCard } from '../../components/ProductCard/ProductCard';
import { useCart } from '../../context/CartContext';
import { Search, X } from 'lucide-react';
import './SearchResults.css';

export function SearchResults() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { products } = useProducts();
  const { addToCart } = useCart();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  const searchQuery = searchParams.get('q') || '';

  useEffect(() => {
    setLoading(true);
    // Simulate search delay
    const timer = setTimeout(() => {
      if (searchQuery.trim()) {
        const filtered = products.filter(product =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.category_slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase()))
        );
        setResults(filtered);
      } else {
        setResults([]);
      }
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, products]);

  const clearSearch = () => {
    navigate('/');
  };

  return (
    <div className="search-results-page">
      <div className="search-header">
        <div className="search-header-content">
          <h1>
            <Search size={32} />
            Search Results
          </h1>
          <p className="search-query">
            {searchQuery ? `Results for "${searchQuery}"` : 'Enter a search term'}
          </p>
        </div>
        <button className="clear-search-btn" onClick={clearSearch}>
          <X size={20} />
        </button>
      </div>

      <div className="search-container">
        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
            <p>Searching products...</p>
          </div>
        ) : results.length > 0 ? (
          <>
            <div className="results-info">
              <p>Found <strong>{results.length}</strong> product{results.length !== 1 ? 's' : ''}</p>
            </div>
            <div className="search-results-grid">
              {results.map(product => (
                <ProductCard 
                  key={product.id} 
                  product={product}
                  onAddToCart={() => addToCart(product)}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="no-results">
            <Search size={48} />
            <h2>No products found</h2>
            <p>We couldn't find any products matching "{searchQuery}"</p>
            <p>Try searching with different keywords or browse our categories</p>
            <button className="browse-btn" onClick={clearSearch}>
              Browse All Products
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
