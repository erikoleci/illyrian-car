import { useState, useEffect, useCallback } from 'react';
import { Product } from '../types/product';
import {
  getProducts,
  subscribeProducts,
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
    let isSubscribed = true;
    setLoading(true);

    const unsubscribe = subscribeProducts((liveProducts) => {
      if (isSubscribed) {
        setProducts(liveProducts);
        setLoading(false);
      }
    });

    return () => {
      isSubscribed = false;
      unsubscribe();
    };
  }, []);

  const handleAdd = async (productData: Omit<Product, 'id'>, imageFiles?: File[]) => {
    try {
      const result = await addProduct(productData, imageFiles);
      await fetchProducts();
      return result;
    } catch (err) {
      throw err;
    }
  };

  const handleUpdate = async (
    id: string,
    updates: Partial<Product>,
    newImageFiles?: File[]
  ) => {
    try {
      const result = await updateProduct(id, updates, newImageFiles);
      await fetchProducts();
      return result;
    } catch (err) {
      throw err;
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteProduct(id);
      await fetchProducts();
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

