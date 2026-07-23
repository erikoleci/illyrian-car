import { useState, useEffect, useCallback } from 'react';
import { Product } from '../types/product';
import {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from '../services/productService';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      console.error('Failed to load products:', err);
      setError((err as Error).message || 'Dështoi ngarkimi i produkteve');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleAdd = async (productData: Omit<Product, 'id'>, imageFile?: File) => {
    try {
      const newProduct = await addProduct(productData, imageFile);
      setProducts((prev) => [newProduct, ...prev]);
      return newProduct;
    } catch (err) {
      throw err;
    }
  };

  const handleUpdate = async (
    id: string,
    updates: Partial<Product>,
    newImageFile?: File
  ) => {
    try {
      const updated = await updateProduct(id, updates, newImageFile);
      setProducts((prev) => prev.map((p) => (p.id === id ? updated : p)));
      return updated;
    } catch (err) {
      throw err;
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      throw err;
    }
  };

  return {
    products,
    loading,
    error,
    refreshProducts: fetchProducts,
    addProduct: handleAdd,
    updateProduct: handleUpdate,
    deleteProduct: handleDelete,
  };
}
