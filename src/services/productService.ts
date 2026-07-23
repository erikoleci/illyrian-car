import { supabase, isSupabaseConfigured } from '../config/supabase';
import { Product } from '../types/product';
import { initialCars } from '../data/cars';

const CARS_TABLE = 'cars';
const PRODUCTS_TABLE = 'products';
const STORAGE_BUCKET = 'product-images';

/**
 * Convert image File to Base64 Data URL
 */
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};

/**
 * Upload image file to Supabase Storage bucket or fallback to Base64
 */
export const uploadProductImage = async (file: File): Promise<string> => {
  try {
    if (isSupabaseConfigured()) {
      const fileExt = file.name.split('.').pop() || 'jpg';
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
      const filePath = `items/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(filePath, file, { cacheControl: '3600', upsert: true });

      if (!uploadError) {
        const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(filePath);
        if (data?.publicUrl) {
          return data.publicUrl;
        }
      }
    }
  } catch (e) {
    console.warn('Error uploading image to Supabase Storage, using Base64:', e);
  }

  return await fileToBase64(file);
};

/**
 * Subscribe to real-time changes in Supabase (Project: nzboklccdeytymhbjyiu)
 */
export const subscribeProducts = (onProductsUpdated: (products: Product[]) => void) => {
  // Initial fetch
  getProducts().then(onProductsUpdated);

  if (!isSupabaseConfigured()) {
    return () => {};
  }

  const channelId = `realtime-cars-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const channel = supabase
    .channel(channelId)
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: CARS_TABLE },
      () => {
        getProducts().then(onProductsUpdated);
      }
    )
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: PRODUCTS_TABLE },
      () => {
        getProducts().then(onProductsUpdated);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};

/**
 * Fetch all cars/products directly from Supabase DB
 */
export const getProducts = async (): Promise<Product[]> => {
  try {
    if (isSupabaseConfigured()) {
      // 1. Try fetching from 'cars' table
      const { data: carsData, error: carsErr } = await supabase
        .from(CARS_TABLE)
        .select('*')
        .order('created_at', { ascending: false });

      if (!carsErr && carsData && carsData.length > 0) {
        return carsData.map((item: any) => ({
          id: String(item.id),
          name: item.name || `${item.brand || ''} ${item.model || ''}`.trim() || 'Makinë',
          category: item.category || 'Sedan',
          description: item.description || '',
          price: Number(item.price_per_day ?? item.price ?? 0),
          image_url: item.image_url || item.image || 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80',
          available: item.available ?? true,
          created_at: item.created_at,
          brand: item.brand,
          model: item.model,
          year: item.year,
          transmission: item.transmission,
          fuel: item.fuel,
          seats: item.seats,
        }));
      }

      // 2. Secondary check for 'products' table
      const { data: prodData, error: prodErr } = await supabase
        .from(PRODUCTS_TABLE)
        .select('*')
        .order('created_at', { ascending: false });

      if (!prodErr && prodData && prodData.length > 0) {
        return prodData.map((item: any) => ({
          id: String(item.id),
          name: item.name,
          category: item.category || 'Sedan',
          description: item.description || '',
          price: Number(item.price || 0),
          image_url: item.image_url || 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80',
          available: item.available ?? true,
          created_at: item.created_at,
          brand: item.brand,
          model: item.model,
        }));
      }
    }
  } catch (err) {
    console.warn('Could not fetch from Supabase, loading default list:', err);
  }

  return getLocalFallbackProducts();
};

/**
 * Add a new car to Supabase
 */
export const addProduct = async (
  productData: Omit<Product, 'id'>,
  imageFile?: File
): Promise<Product> => {
  let finalImageUrl = productData.image_url;

  if (imageFile) {
    finalImageUrl = await uploadProductImage(imageFile);
  }

  if (!finalImageUrl) {
    finalImageUrl = 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80';
  }

  const nameParts = productData.name.trim().split(' ');
  const brand = productData.brand || nameParts[0] || 'Auto';
  const model = productData.model || nameParts.slice(1).join(' ') || nameParts[0] || 'Model';

  const carPayload = {
    brand,
    model,
    category: productData.category || 'Sedan',
    description: productData.description || '',
    price_per_day: Number(productData.price || 0),
    image_url: finalImageUrl,
    available: productData.available ?? true,
    year: productData.year || 2024,
    transmission: productData.transmission || 'Automatic',
    fuel: productData.fuel || 'Diesel',
    seats: productData.seats || 5,
  };

  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from(CARS_TABLE)
        .insert([carPayload])
        .select()
        .single();

      if (!error && data) {
        return {
          id: String(data.id),
          name: `${data.brand} ${data.model}`.trim(),
          category: data.category,
          description: data.description,
          price: Number(data.price_per_day || data.price || 0),
          image_url: data.image_url,
          available: data.available,
          created_at: data.created_at,
          brand: data.brand,
          model: data.model,
          year: data.year,
          transmission: data.transmission,
          fuel: data.fuel,
          seats: data.seats,
        };
      }
    } catch (e) {
      console.warn('Error inserting car into Supabase:', e);
    }
  }

  // Fallback return
  return {
    id: `car-${Date.now()}`,
    name: productData.name,
    category: productData.category || 'Sedan',
    description: productData.description || '',
    price: Number(productData.price || 0),
    image_url: finalImageUrl,
    available: productData.available ?? true,
    brand,
    model,
  };
};

/**
 * Update an existing car in Supabase
 */
export const updateProduct = async (
  id: string,
  updates: Partial<Product>,
  newImageFile?: File
): Promise<Product> => {
  let finalImageUrl = updates.image_url;

  if (newImageFile) {
    finalImageUrl = await uploadProductImage(newImageFile);
  }

  const strId = String(id);
  const payload: any = {
    ...(updates.name && { name: updates.name }),
    ...(updates.brand && { brand: updates.brand }),
    ...(updates.model && { model: updates.model }),
    ...(updates.category && { category: updates.category }),
    ...(updates.description !== undefined && { description: updates.description }),
    ...(updates.price !== undefined && { price_per_day: Number(updates.price), price: Number(updates.price) }),
    ...(finalImageUrl && { image_url: finalImageUrl }),
    ...(updates.available !== undefined && { available: updates.available }),
  };

  if (isSupabaseConfigured()) {
    try {
      await supabase.from(CARS_TABLE).update(payload).eq('id', strId);
      await supabase.from(PRODUCTS_TABLE).update(payload).eq('id', strId);
    } catch (e) {
      console.warn('Error updating car in Supabase:', e);
    }
  }

  return {
    id: strId,
    name: updates.name || 'Produkt',
    category: updates.category || 'Sedan',
    description: updates.description || '',
    price: Number(updates.price || 0),
    image_url: finalImageUrl || 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80',
    available: updates.available ?? true,
  };
};

/**
 * Delete car from Supabase
 */
export const deleteProduct = async (id: string): Promise<void> => {
  const strId = String(id);

  if (isSupabaseConfigured()) {
    try {
      await supabase.from(CARS_TABLE).delete().eq('id', strId);
      await supabase.from(PRODUCTS_TABLE).delete().eq('id', strId);
    } catch (err) {
      console.warn('Error deleting car from Supabase:', err);
    }
  }
};

function getLocalFallbackProducts(): Product[] {
  return initialCars.map((car) => ({
    id: car.id.toString(),
    name: `${car.brand} ${car.model}`,
    category: car.type,
    description: car.description,
    price: car.pricePerDay,
    image_url: car.image,
    available: car.available,
    brand: car.brand,
    model: car.model,
    year: car.year,
    transmission: car.transmission,
    fuel: car.fuel,
    seats: car.seats,
  }));
}
