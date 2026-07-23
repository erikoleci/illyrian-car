import { supabase, isSupabaseConfigured } from '../config/supabase';
import { Product } from '../types/product';
import { initialCars } from '../data/cars';

const PRODUCTS_TABLE = 'products';
const STORAGE_BUCKET = 'product-images';

const LOCAL_STORAGE_KEY = 'illyrian_custom_products';

const isUUID = (str: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);

/**
 * Convert any image File to Base64 Data URL (works offline, PC, or mobile)
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
 * Upload image file to Supabase Storage bucket 'product-images' or fallback to Base64
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
      } else {
        console.warn('Supabase storage upload failed, converting to Base64 fallback:', uploadError.message);
      }
    }
  } catch (e) {
    console.warn('Error in uploadProductImage, using base64 fallback:', e);
  }

  // Fallback to Base64 Data URL (works for any PC/Phone photo format)
  return await fileToBase64(file);
};

/**
 * Fetch all products from Supabase database or Local Cache
 */
export const getProducts = async (): Promise<Product[]> => {
  try {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from(PRODUCTS_TABLE)
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return data.map((item: any) => ({
          id: String(item.id),
          name: item.name || `${item.brand || ''} ${item.model || ''}`.trim() || 'Produkt',
          category: item.category || item.type || 'Sedan',
          description: item.description || '',
          price: Number(item.price ?? item.pricePerDay ?? 0),
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
    }
  } catch (err) {
    console.warn('Could not fetch from Supabase, loading local products:', err);
  }

  return getLocalProducts();
};

/**
 * Add a new product to Supabase or Local Storage
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

  const payload = {
    name: productData.name,
    category: productData.category || 'Sedan',
    description: productData.description || '',
    price: Number(productData.price || 0),
    image_url: finalImageUrl,
    available: productData.available ?? true,
  };

  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from(PRODUCTS_TABLE)
        .insert([payload])
        .select()
        .single();

      if (!error && data) {
        return {
          id: String(data.id),
          name: data.name,
          category: data.category,
          description: data.description,
          price: Number(data.price),
          image_url: data.image_url,
          available: data.available,
          created_at: data.created_at,
        };
      } else {
        console.warn('Supabase insert failed, saving locally:', error?.message);
      }
    } catch (e) {
      console.warn('Error adding product to Supabase, fallback to local:', e);
    }
  }

  // Local fallback creation
  const newProduct: Product = {
    id: `custom-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    ...payload,
    created_at: new Date().toISOString(),
  };

  saveToLocalStorage(newProduct);
  return newProduct;
};

/**
 * Update an existing product in Supabase or Local Storage
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

  const payload: any = {
    ...(updates.name && { name: updates.name }),
    ...(updates.category && { category: updates.category }),
    ...(updates.description !== undefined && { description: updates.description }),
    ...(updates.price !== undefined && { price: Number(updates.price) }),
    ...(finalImageUrl && { image_url: finalImageUrl }),
    ...(updates.available !== undefined && { available: updates.available }),
  };

  if (isSupabaseConfigured() && isUUID(id)) {
    try {
      const { data, error } = await supabase
        .from(PRODUCTS_TABLE)
        .update(payload)
        .eq('id', id)
        .select()
        .single();

      if (!error && data) {
        return {
          id: String(data.id),
          name: data.name,
          category: data.category,
          description: data.description,
          price: Number(data.price),
          image_url: data.image_url,
          available: data.available,
          created_at: data.created_at,
        };
      }
    } catch (e) {
      console.warn('Error updating product in Supabase:', e);
    }
  }

  // Update local cache item
  updateInLocalStorage(id, payload);
  return {
    id,
    name: updates.name || 'Produkt',
    category: updates.category || 'Sedan',
    description: updates.description || '',
    price: Number(updates.price || 0),
    image_url: finalImageUrl || 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80',
    available: updates.available ?? true,
  };
};

/**
 * Delete product safely from Supabase and Local Storage
 */
export const deleteProduct = async (id: string): Promise<void> => {
  if (isSupabaseConfigured() && isUUID(id)) {
    try {
      const { error } = await supabase
        .from(PRODUCTS_TABLE)
        .delete()
        .eq('id', id);

      if (error) {
        console.warn('Supabase delete returned error:', error.message);
      }
    } catch (err) {
      console.warn('Error deleting from Supabase:', err);
    }
  }

  // Always clear from local storage / cache
  deleteFromLocalStorage(id);
};

// ================= LOCAL STORAGE HELPERS =================

function getLocalProducts(): Product[] {
  try {
    const customJson = localStorage.getItem(LOCAL_STORAGE_KEY);
    const customProducts: Product[] = customJson ? JSON.parse(customJson) : [];

    const deletedIds: string[] = JSON.parse(localStorage.getItem('illyrian_deleted_products') || '[]');

    const fallback = initialCars.map((car) => ({
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

    const combined = [...customProducts, ...fallback];
    return combined.filter((p) => !deletedIds.includes(p.id));
  } catch (e) {
    console.error('Error reading local products:', e);
    return getLocalFallbackProducts();
  }
}

function saveToLocalStorage(product: Product) {
  try {
    const customJson = localStorage.getItem(LOCAL_STORAGE_KEY);
    const customProducts: Product[] = customJson ? JSON.parse(customJson) : [];
    customProducts.unshift(product);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(customProducts));
  } catch (e) {
    console.error('Error saving to localStorage:', e);
  }
}

function updateInLocalStorage(id: string, updates: any) {
  try {
    const customJson = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (customJson) {
      let customProducts: Product[] = JSON.parse(customJson);
      customProducts = customProducts.map((p) => (p.id === id ? { ...p, ...updates } : p));
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(customProducts));
    }
  } catch (e) {
    console.error('Error updating localStorage:', e);
  }
}

function deleteFromLocalStorage(id: string) {
  try {
    const customJson = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (customJson) {
      let customProducts: Product[] = JSON.parse(customJson);
      customProducts = customProducts.filter((p) => p.id !== id);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(customProducts));
    }

    const deletedIds: string[] = JSON.parse(localStorage.getItem('illyrian_deleted_products') || '[]');
    if (!deletedIds.includes(id)) {
      deletedIds.push(id);
      localStorage.setItem('illyrian_deleted_products', JSON.stringify(deletedIds));
    }
  } catch (e) {
    console.error('Error deleting from localStorage:', e);
  }
}

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

