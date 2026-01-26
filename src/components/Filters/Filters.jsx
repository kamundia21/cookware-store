import { useState, useEffect } from 'react';
import { useProducts } from '../../context/ProductContext';

export function Filters({ onFilterChange }) {
  const { products } = useProducts();
  const [filters, setFilters] = useState({
    category: '',
    material: '',
    priceMin: '',
    priceMax: '',
    inStock: false
  });

  // Get unique materials from descriptions
  const materials = [...new Set(products.map(p => {
    const match = p.description?.match(/Material:\s*(\w+)/i);
    return match ? match[1].toLowerCase() : '';
  }).filter(Boolean))];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newFilters = {
      ...filters,
      [name]: type === 'checkbox' ? checked : value
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="filters-container">
      <div className="filter-group">
        <label>Category</label>
        <select name="category" value={filters.category} onChange={handleChange}>
          <option value="">All Categories</option>
          <option value="cookware">Cookware</option>
          <option value="knives">Knives</option>
          <option value="glasses">Glasses</option>
          <option value="decor">Decor</option>
        </select>
      </div>

      <div className="filter-group">
        <label>Material</label>
        <select name="material" value={filters.material} onChange={handleChange}>
          <option value="">All Materials</option>
          {materials.map(mat => <option key={mat} value={mat}>{mat}</option>)}
        </select>
      </div>

      <div className="filter-group">
        <label>Price Range (KSH)</label>
        <div className="price-range">
          <input type="number" name="priceMin" placeholder="Min" value={filters.priceMin} onChange={handleChange} />
          <span>-</span>
          <input type="number" name="priceMax" placeholder="Max" value={filters.priceMax} onChange={handleChange} />
        </div>
      </div>

      <div className="filter-group">
        <label>
          <input type="checkbox" name="inStock" checked={filters.inStock} onChange={handleChange} />
          In Stock Only
        </label>
      </div>

      <button className="clear-filters" onClick={() => {
        setFilters({ category: '', material: '', priceMin: '', priceMax: '', inStock: false });
        onFilterChange({});
      }}>
        Clear All
      </button>
    </div>
  );
}