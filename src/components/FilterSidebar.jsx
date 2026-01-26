import { useState, useEffect } from 'react';
import { products } from '../data/products';

export function FilterSidebar({ filters, setFilters }) {
  const [brands, setBrands] = useState([]);
  const [materials, setMaterials] = useState([]);

  useEffect(() => {
    const uniqueBrands = [...new Set(products.map(p => p.brand))];
    const uniqueMaterials = [...new Set(products.map(p => p.material))];
    setBrands(uniqueBrands);
    setMaterials(uniqueMaterials);
  }, []);

  const handleBrandChange = (brand) => {
    setFilters(prev => ({
      ...prev,
      brand: prev.brand.includes(brand)
        ? prev.brand.filter(b => b !== brand)
        : [...prev.brand, brand]
    }));
  };

  const handleMaterialChange = (material) => {
    setFilters(prev => ({
      ...prev,
      material: prev.material.includes(material)
        ? prev.material.filter(m => m !== material)
        : [...prev.material, material]
    }));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="font-bold text-lg mb-4">Filters</h3>
      
      <div className="mb-6">
        <h4 className="font-semibold mb-2">Brand</h4>
        <div className="space-y-2">
          {brands.map(brand => (
            <label key={brand} className="flex items-center">
              <input 
                type="checkbox"
                checked={filters.brand.includes(brand)}
                onChange={() => handleBrandChange(brand)}
                className="mr-2"
              />
              {brand}
            </label>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h4 className="font-semibold mb-2">Material</h4>
        <div className="space-y-2">
          {materials.map(material => (
            <label key={material} className="flex items-center">
              <input 
                type="checkbox"
                checked={filters.material.includes(material)}
                onChange={() => handleMaterialChange(material)}
                className="mr-2"
              />
              {material}
            </label>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h4 className="font-semibold mb-2">Price Range</h4>
        <input 
          type="range"
          min="0"
          max="1000"
          value={filters.maxPrice}
          onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: parseInt(e.target.value) }))}
          className="w-full"
        />
        <div className="flex justify-between text-sm">
          <span>${filters.minPrice}</span>
          <span>${filters.maxPrice}</span>
        </div>
      </div>

      <div className="mb-6">
        <h4 className="font-semibold mb-2">Minimum Rating</h4>
        <select 
          value={filters.rating}
          onChange={(e) => setFilters(prev => ({ ...prev, rating: parseFloat(e.target.value) }))}
          className="w-full border rounded-lg px-3 py-2"
        >
          <option value="0">All Ratings</option>
          <option value="3">3+ Stars</option>
          <option value="4">4+ Stars</option>
          <option value="4.5">4.5+ Stars</option>
        </select>
      </div>

      <button 
        onClick={() => setFilters({
          category: '',
          subcategory: '',
          brand: [],
          material: [],
          minPrice: 0,
          maxPrice: 1000,
          rating: 0
        })}
        className="w-full border border-gray-300 py-2 rounded-lg hover:bg-gray-50"
      >
        Clear Filters
      </button>
    </div>
  );
}