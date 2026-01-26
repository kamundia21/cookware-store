import { useProducts } from '../../context/ProductContext';
import { supabase } from '../../utils/supabaseClient';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Trash2 } from 'lucide-react';
import './AdminPanel.css';

const CATEGORIES = [
  { value: 'cookware', label: 'Cookware' },
  { value: 'knives', label: 'Knives' },
  { value: 'plates', label: 'Plates' },
  { value: 'cups', label: 'Cups' },
  { value: 'glasses', label: 'Glasses' },
  { value: 'fancyplastic', label: 'Fancy Plastic' },
  { value: 'kitchenaccesories', label: 'Kitchen Accessories' },
  { value: 'decor', label: 'Decor' },
  { value: 'flaskbottles', label: 'Flask & Bottles' },
  { value: 'mats', label: 'Mats' },
  { value: 'tray', label: 'Tray' },
  { value: 'saltshakers', label: 'Salt Shakers' },
  { value: 'sugardish', label: 'Sugardish' },
];

export function AdminPanel() {
  const { addProduct, deleteProduct, products } = useProducts();
  const navigate = useNavigate();
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    category_slug: 'cookware',
    description: '',
    tags: [],
    discount: 0,
    trending: false
  });
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [deleting, setDeleting] = useState(null);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      localStorage.removeItem('admin_auth');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userId');
      navigate('/');
    }
  };

  const handleDeleteProduct = async (productId, productName) => {
    if (confirm(`Are you sure you want to delete "${productName}"? This action cannot be undone.`)) {
      setDeleting(productId);
      const success = await deleteProduct(productId);
      setDeleting(null);
      
      if (success) {
        setMessage({ type: 'success', text: `✅ Product "${productName}" deleted successfully!` });
      } else {
        setMessage({ type: 'error', text: '❌ Failed to delete product' });
      }
    }
  };

  const uploadImage = async (file) => {
    setUploading(true);
    const fileName = `products/${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
    
    const { error } = await supabase.storage
      .from('product-images')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (error) {
      setMessage({ type: 'error', text: 'Image upload failed: ' + error.message });
      setUploading(false);
      return null;
    }
    
    const { data } = supabase.storage.from('product-images').getPublicUrl(fileName);
    setUploading(false);
    return data.publicUrl;
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    
    if (!newProduct.name.trim() || !newProduct.price) {
      setMessage({ type: 'error', text: 'Please fill in name and price' });
      return;
    }

    if (parseFloat(newProduct.price) <= 0) {
      setMessage({ type: 'error', text: 'Price must be greater than 0' });
      return;
    }

    let imageUrl = '/placeholders/image-placeholder.svg';
    if (imageFile) {
      imageUrl = await uploadImage(imageFile);
      if (!imageUrl) return;
    }

    const productToAdd = {
      name: newProduct.name.trim(),
      price: parseFloat(newProduct.price),
      category_slug: newProduct.category_slug,
      image_url: imageUrl,
      description: newProduct.description.trim(),
      tags: newProduct.tags,
      discount: parseInt(newProduct.discount) || 0,
      trending: newProduct.trending,
      in_stock: true
    };

    const success = await addProduct(productToAdd);
    
    if (success) {
      setMessage({ type: 'success', text: '✅ Product added successfully! (Check browser console for connection details)' });
      setNewProduct({
        name: '',
        price: '',
        category_slug: 'cookware',
        description: '',
        tags: [],
        discount: 0,
        trending: false
      });
      setImageFile(null);
    } else {
      setMessage({ type: 'error', text: '❌ Failed to add product. Please check console for details.' });
    }
  };

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h1>🛠️ Add New Product</h1>
        <button className="logout-btn" onClick={handleLogout} title="Logout">
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
      
      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleAddProduct}>
        <div className="form-group">
          <label htmlFor="name">Product Name *</label>
          <input
            id="name"
            type="text"
            placeholder="e.g., Premium Stainless Steel Pot"
            value={newProduct.name}
            onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="price">Price (KSH) *</label>
          <input
            id="price"
            type="number"
            step="0.01"
            min="0.01"
            placeholder="1000"
            value={newProduct.price}
            onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">Category *</label>
          <select
            id="category"
            value={newProduct.category_slug}
            onChange={(e) => setNewProduct({...newProduct, category_slug: e.target.value})}
          >
            {CATEGORIES.map(cat => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            rows="4"
            placeholder="Product details, features, dimensions..."
            value={newProduct.description}
            onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
          />
        </div>

        <div className="form-group">
          <label htmlFor="image">Product Image</label>
          <input
            id="image"
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
          />
          {imageFile && (
            <p className="file-name">Selected: {imageFile.name}</p>
          )}
          {uploading && (
            <div className="uploading">Uploading image... ⏳</div>
          )}
        </div>

        {/* Season Bundling Fields */}
        <div className="bundling-section">
          <h3>🎯 Season Bundling</h3>
          
          <div className="form-group">
            <label>Season Tags</label>
            <div className="checkbox-group">
              {['summer', 'winter', 'spring', 'fall'].map(season => (
                <label key={season} className="checkbox-label">
                  <input 
                    type="checkbox"
                    checked={newProduct.tags.includes(season)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setNewProduct({...newProduct, tags: [...newProduct.tags, season]});
                      } else {
                        setNewProduct({...newProduct, tags: newProduct.tags.filter(t => t !== season)});
                      }
                    }}
                  />
                  <span>{season.charAt(0).toUpperCase() + season.slice(1)}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="discount">Discount % (0-100)</label>
            <input 
              id="discount"
              type="number" 
              min="0" 
              max="100"
              value={newProduct.discount}
              onChange={(e) => setNewProduct({...newProduct, discount: parseInt(e.target.value) || 0})}
              placeholder="0"
            />
          </div>

          <div className="form-group">
            <label className="checkbox-label">
              <input 
                type="checkbox"
                checked={newProduct.trending}
                onChange={(e) => setNewProduct({...newProduct, trending: e.target.checked})}
              />
              <span>Mark as Trending 🔥</span>
            </label>
          </div>
        </div>

        <button type="submit" className="submit-btn" disabled={uploading}>
          {uploading ? 'Adding Product...' : 'Add Product'}
        </button>

        <button 
          type="button" 
          onClick={() => {
            if (confirm('🗑️ Clear all products? This cannot be undone.')) {
              localStorage.removeItem('cookware_products');
              window.location.reload();
            }
          }}
          className="danger-btn"
        >
          Reset Products
        </button>
      </form>

      {/* Products List Section */}
      <section className="products-list-section">
        <h2>📦 Manage Products ({products.length})</h2>
        
        {products.length === 0 ? (
          <p className="no-products">No products yet. Add your first product above!</p>
        ) : (
          <div className="products-table-wrapper">
            <table className="products-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Price (KSH)</th>
                  <th>Category</th>
                  <th>Stock</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product.id}>
                    <td>
                      <img 
                        src={product.image_url} 
                        alt={product.name}
                        className="product-thumb"
                      />
                    </td>
                    <td>{product.name}</td>
                    <td>KSH {product.price.toLocaleString()}</td>
                    <td>{product.category_slug}</td>
                    <td>
                      <span className={product.in_stock ? 'stock-yes' : 'stock-no'}>
                        {product.in_stock ? '✅ In Stock' : '❌ Out'}
                      </span>
                    </td>
                    <td>
                      <button
                        className="delete-product-btn"
                        onClick={() => handleDeleteProduct(product.id, product.name)}
                        disabled={deleting === product.id}
                        title="Delete product"
                      >
                        <Trash2 size={16} />
                        {deleting === product.id ? 'Deleting...' : 'Delete'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}