import { Link } from 'react-router-dom';
import { Package } from 'lucide-react';
import './ProductCard.css';

/**
 * ProductCard Component
 * Displays product information in a card layout with link to detail page
 * @param {Object} product - Product object with id, name, price, image_url, category_slug, in_stock
 */
export function ProductCard({ product }) {
  const handleImageError = (e) => {
    e.target.src = '/placeholders/image-placeholder.svg';
  };

  return (
    <Link 
      to={`/product/${product.id}`}
      className="product-card"
      aria-label={`View details for ${product.name}`}
    >
      <div className="product-image">
        <img 
          src={product.image_url} 
          alt={product.name}
          loading="lazy"
          onError={handleImageError}
        />
      </div>
      
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        
        <div className="product-meta">
          <span className="category-badge">{product.category_slug}</span>
          {product.in_stock ? (
            <span className="stock-badge in-stock">In Stock</span>
          ) : (
            <span className="stock-badge out-of-stock">Out of Stock</span>
          )}
        </div>

        <p className="product-price">${product.price.toFixed(2)}</p>
      </div>
    </Link>
  );
}