import { useParams, Link } from 'react-router-dom';
import { useProducts } from '../../context/ProductContext';
import { ProductCard } from '../../components/ProductCard/ProductCard';
import { ArrowLeft } from 'lucide-react';
import './Category.css';

export function Category() {
  const { category } = useParams();
  const { getProductsByCategory } = useProducts();
  const products = getProductsByCategory(category);

  // Capitalize category name for display
  const categoryName = category 
    ? category.charAt(0).toUpperCase() + category.slice(1).replace(/([A-Z])/g, ' $1')
    : 'Category';

  if (products.length === 0) {
    return (
      <div className="category-empty">
        <h1>{categoryName}</h1>
        <p>No products found in this category.</p>
        <Link to="/" className="back-link">
          <ArrowLeft size={20} /> Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="category-container">
      <div className="category-header">
        <Link to="/" className="back-button">
          <ArrowLeft size={20} /> Back
        </Link>
        <h1>{categoryName}</h1>
        <p>{products.length} product{products.length !== 1 ? 's' : ''} found</p>
      </div>

      <div className="products-grid">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}