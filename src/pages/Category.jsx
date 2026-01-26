import { useParams } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { ProductCard } from '../components/ProductCard/ProductCard';
import { Filter } from 'lucide-react';
import './Category.css';

export function Category() {
  const { products } = useProducts();
  
  return (
    <div className="category">
      <div className="container">
        <div className="category-header">
          <h1>All Products</h1>
          <button className="filter-btn">
            <Filter size={20} />
            Filters
          </button>
        </div>
        <div className="products-grid">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}