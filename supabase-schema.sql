-- =========================================================
-- SUPABASE DATABASE SETUP & ROW LEVEL SECURITY (RLS)
-- =========================================================

-- 1. Create products table
CREATE TABLE IF NOT EXISTS public.products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Sedan',
  description TEXT DEFAULT '',
  price NUMERIC NOT NULL DEFAULT 0,
  image_url TEXT NOT NULL,
  available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- 3. Public READ policy (Anyone can view products)
CREATE POLICY "Allow public read access for products"
  ON public.products
  FOR SELECT
  TO public
  USING (true);

-- 4. Public Write Policies for Admin Management
CREATE POLICY "Allow write access for products"
  ON public.products
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow update access for products"
  ON public.products
  FOR UPDATE
  TO public
  USING (true);

CREATE POLICY "Allow delete access for products"
  ON public.products
  FOR DELETE
  TO public
  USING (true);

-- 5. Create Storage Bucket for Images
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- 6. Storage Bucket Public Access Policies
CREATE POLICY "Public Read Access for product-images"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'product-images');

CREATE POLICY "Public Upload Access for product-images"
  ON storage.objects FOR INSERT
  TO public
  WITH CHECK (bucket_id = 'product-images');

CREATE POLICY "Public Delete Access for product-images"
  ON storage.objects FOR DELETE
  TO public
  USING (bucket_id = 'product-images');
