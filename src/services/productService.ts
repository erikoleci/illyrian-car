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
 * Fetch all products/cars from Supabase database or Local Cache
 */
export const getProducts = async (): Promise<Product[]> => {
  const deletedIds: string[] = JSON.parse(
    localStorage.getItem('illyrian_deleted_products') || '[]'
  );

  let fetchedProducts: Product[] = [];

  try {
    if (isSupabaseConfigured()) {
      // 1. Try fetching from 'products' table
      const { data: productsData } = await supabase
        .from(PRODUCTS_TABLE)
        .select('*')
        .order('created_at', { ascending: false });

      if (productsData && productsData.length > 0) {
        const mappedProducts = productsData.map((item: any) => ({
          id: String(item.id),
          name: item.name || `${item.brand || ''} ${item.model || ''}`.trim() || 'Produkt',
          category: item.category || item.type || 'Sedan',
          description: item.description || '',
          price: Number(item.price ?? item.price_per_day ?? item.pricePerDay ?? 0),
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
        fetchedProducts.push(...mappedProducts);
      }

      // 2. Try fetching from 'cars' table
      const { data: carsData } = await supabase
        .from('cars')
        .select('*')
        .order('created_at', { ascending: false });

      if (carsData && carsData.length > 0) {
        const mappedCars = carsData.map((item: any) => ({
          id: String(item.id),
          name: item.name || `${item.brand || ''} ${item.model || ''}`.trim() || 'Makinë',
          category: item.category || 'Sedan',
          description: item.description || '',
          price: Number(item.price_per_day ?? item.price ?? 0),
          image_url: item.image_url || 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80',
          available: item.available ?? true,
          created_at: item.created_at,
          brand: item.brand,
          model: item.model,
          year: item.year,
          transmission: item.transmission,
          fuel: item.fuel,
          seats: item.seats,
        }));

        // Merge keeping unique IDs
        for (const carItem of mappedCars) {
          if (!fetchedProducts.some((p) => String(p.id) === String(carItem.id))) {
            fetchedProducts.push(carItem);
          }
        }
      }
    }
  } catch (err) {
    console.warn('Could not fetch from Supabase, loading local products:', err);
  }

  if (fetchedProducts.length === 0) {
    fetchedProducts = getLocalProducts();
  }

  // Filter out any deleted product IDs regardless of source
  return fetchedProducts.filter((p) => !deletedIds.includes(String(p.id)));
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

  const nameParts = productData.name.trim().split(' ');
  const brand = nameParts[0] || 'Auto';
  const model = nameParts.slice(1).join(' ') || nameParts[0] || 'Model';

  const productPayload = {
    name: productData.name,
    category: productData.category || 'Sedan',
    description: productData.description || '',
    price: Number(productData.price || 0),
    image_url: finalImageUrl,
    available: productData.available ?? true,
  };

  const carPayload = {
    brand,
    model,
    category: productData.category || 'Sedan',
    description: productData.description || '',
    price_per_day: Number(productData.price || 0),
    image_url: finalImageUrl,
    available: productData.available ?? true,
  };

  if (isSupabaseConfigured()) {
    try {
      // Try inserting into 'cars' table first if available
      const { data: carData, error: carErr } = await supabase
        .from('cars')
        .insert([carPayload])
        .select()
        .single();

      if (!carErr && carData) {
        return {
          id: String(carData.id),
          name: `${carData.brand} ${carData.model}`.trim(),
          category: carData.category,
          description: carData.description,
          price: Number(carData.price_per_day),
          image_url: carData.image_url,
          available: carData.available,
          created_at: carData.created_at,
          brand: carData.brand,
          model: carData.model,
        };
      }

      // Try inserting into 'products' table
      const { data, error } = await supabase
        .from(PRODUCTS_TABLE)
        .insert([productPayload])
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
    ...productPayload,
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
    ...(updates.price !== undefined && { price: Number(updates.price), price_per_day: Number(updates.price) }),
    ...(finalImageUrl && { image_url: finalImageUrl }),
    ...(updates.available !== undefined && { available: updates.available }),
  };

  if (isSupabaseConfigured() && isUUID(id)) {
    try {
      await supabase.from('cars').update(payload).eq('id', id);
      await supabase.from(PRODUCTS_TABLE).update(payload).eq('id', id);
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
  const strId = String(id);

  if (isSupabaseConfigured()) {
    try {
      // Attempt delete from both 'cars' and 'products' tables in Supabase
      await supabase.from('cars').delete().eq('id', strId);
      await supabase.from(PRODUCTS_TABLE).delete().eq('id', strId);
    } catch (err) {
      console.warn('Error deleting from Supabase:', err);
    }
  }

  // Always clear from local storage / cache
  deleteFromLocalStorage(strId);
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
    const targetId = String(id);
    const customJson = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (customJson) {
      let customProducts: Product[] = JSON.parse(customJson);
      customProducts = customProducts.filter((p) => String(p.id) !== targetId);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(customProducts));
    }

    const deletedIds: string[] = JSON.parse(localStorage.getItem('illyrian_deleted_products') || '[]');
    if (!deletedIds.includes(targetId)) {
      deletedIds.push(targetId);
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

