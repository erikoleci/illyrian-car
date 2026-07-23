import { supabase } from '../config/supabase';
import { Product } from '../types/product';
import { initialCars } from '../data/cars';

const PRODUCTS_TABLE = 'products';
const STORAGE_BUCKET = 'product-images';

/**
 * Upload image file to Supabase Storage bucket 'product-images'
 */
export const uploadProductImage = async (file: File): Promise<string> => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
  const filePath = `items/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(filePath, file, { cacheControl: '3600', upsert: true });

  if (uploadError) {
    console.error('Error uploading image to Supabase Storage:', uploadError);
    throw new Error(`Dështoi ngarkimi i fotos: ${uploadError.message}`);
  }

  const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(filePath);
  return data.publicUrl;
};

/**
 * Fetch all products from Supabase database
 */
export const getProducts = async (): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from(PRODUCTS_TABLE)
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Could not fetch products from Supabase, falling back to local dataset:', error.message);
      return getLocalFallbackProducts();
    }

    if (!data || data.length === 0) {
      console.log('Supabase products table empty.');
      return getLocalFallbackProducts();
    }

    return data.map((item: any) => ({
      id: item.id,
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
  } catch (err) {
    console.error('Error in getProducts:', err);
    return getLocalFallbackProducts();
  }
};

/**
 * Add a new product to Supabase
 */
export const addProduct = async (
  productData: Omit<Product, 'id'>,
  imageFile?: File
): Promise<Product> => {
  let finalImageUrl = productData.image_url || 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80';

  if (imageFile) {
    finalImageUrl = await uploadProductImage(imageFile);
  }

  const payload = {
    name: productData.name,
    category: productData.category,
    description: productData.description || '',
    price: Number(productData.price),
    image_url: finalImageUrl,
    available: productData.available ?? true,
  };

  const { data, error } = await supabase
    .from(PRODUCTS_TABLE)
    .insert([payload])
    .select()
    .single();

  if (error) {
    console.error('Error adding product to Supabase:', error);
    throw new Error(`Shtimi dështoi: ${error.message}`);
  }

  return {
    id: data.id,
    name: data.name,
    category: data.category,
    description: data.description,
    price: Number(data.price),
    image_url: data.image_url,
    available: data.available,
    created_at: data.created_at,
  };
};

/**
 * Update an existing product in Supabase
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

  const { data, error } = await supabase
    .from(PRODUCTS_TABLE)
    .update(payload)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating product in Supabase:', error);
    throw new Error(`Përditësimi dështoi: ${error.message}`);
  }

  return {
    id: data.id,
    name: data.name,
    category: data.category,
    description: data.description,
    price: Number(data.price),
    image_url: data.image_url,
    available: data.available,
    created_at: data.created_at,
  };
};

/**
 * Delete product from Supabase
 */
export const deleteProduct = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from(PRODUCTS_TABLE)
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting product from Supabase:', error);
    throw new Error(`Fshirja dështoi: ${error.message}`);
  }
};

/**
 * Fallback mapping from initial static dataset if Supabase is empty or unconfigured
 */
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
