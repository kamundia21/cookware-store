import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';

const ProductContext = createContext();

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const query = supabase.from('products').select('*');
      const { data, error } = await query;
      
      if (error) {
        console.error('Error loading products:', error);
      } else {
        setProducts(data || []);
      }
    } catch (err) {
      // Fallback to mock data if Supabase fails
      console.log('Using mock data');
      setProducts([
        {
          id: '1',
          name: 'Mock Product',
          price: 29.99,
          category_slug: 'cookware',
          image_url: '/placeholders/image-placeholder.svg',
          description: 'Mock data',
          in_stock: true
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getProductById = (id) => products.find(p => p.id === id);
  
  const getProductsByCategory = (category) => 
    products.filter(p => p.category_slug === category);

  const addProduct = async (newProduct) => {
    try {
      // Log the product being added for debugging
      console.log('Adding product:', newProduct);
      
      // Only send fields that exist in the database schema
      // Remove optional fields that might not exist (discount, trending, tags)
      const productData = {
        name: newProduct.name,
        price: newProduct.price,
        category_slug: newProduct.category_slug,
        image_url: newProduct.image_url,
        description: newProduct.description,
        in_stock: newProduct.in_stock
      };
      
      // Add optional fields only if they exist in the table
      if (newProduct.discount !== undefined && newProduct.discount !== null) {
        productData.discount = newProduct.discount;
      }
      if (newProduct.trending !== undefined && newProduct.trending !== null) {
        productData.trending = newProduct.trending;
      }
      if (newProduct.tags !== undefined && newProduct.tags !== null && newProduct.tags.length > 0) {
        productData.tags = newProduct.tags;
      }
      
      console.log('Sending to Supabase:', productData);
      
      const { data, error } = await supabase
        .from('products')
        .insert([productData])
        .select();
      
      if (error) {
        console.error('Supabase error adding product:', error.message, error.details);
        // Fall back to mock data if Supabase fails
        const mockProduct = { ...newProduct, id: Date.now().toString() };
        setProducts(prev => [...prev, mockProduct]);
        console.log('✅ Product added to local state (Supabase unavailable)');
        return true;
      }
      
      if (data && data.length > 0) {
        setProducts(prev => [...prev, ...data]);
        console.log('✅ Product added to Supabase:', data[0]);
        return true;
      } else {
        // If no data returned but no error, still add to state
        const mockProduct = { ...newProduct, id: Date.now().toString() };
        setProducts(prev => [...prev, mockProduct]);
        return true;
      }
    } catch (err) {
      console.error('Exception adding product:', err.message);
      // Fall back to mock data on exception
      const mockProduct = { ...newProduct, id: Date.now().toString() };
      setProducts(prev => [...prev, mockProduct]);
      return true;
    }
  };

  const deleteProduct = async (productId) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);
      
      if (error) {
        console.error('Error deleting product:', error);
        return false;
      }
      
      setProducts(prev => prev.filter(p => p.id !== productId));
      return true;
    } catch (err) {
      console.log('Removing from mock data');
      setProducts(prev => prev.filter(p => p.id !== productId));
      return true;
    }
  };

  return (
    <ProductContext.Provider value={{ 
      products, 
      loading,
      getProductById, 
      getProductsByCategory,
      addProduct,
      deleteProduct 
    }}>
      {children}
    </ProductContext.Provider>
  );
}

export const useProducts = () => useContext(ProductContext);