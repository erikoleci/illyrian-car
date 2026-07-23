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

-- 2. Create cars table
CREATE TABLE IF NOT EXISTS public.cars (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER,
  category TEXT,
  description TEXT,
  price_per_day NUMERIC NOT NULL,
  image_url TEXT,
  transmission TEXT,
  fuel TEXT,
  seats INTEGER,
  available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cars ENABLE ROW LEVEL SECURITY;

-- 4. Public READ policies
CREATE POLICY "Allow public read access for products"
  ON public.products FOR SELECT TO public USING (true);

CREATE POLICY "Anyone can view cars"
  ON public.cars FOR SELECT TO public USING (true);

-- 5. Public Write Policies for Admin Management (products)
CREATE POLICY "Allow write access for products"
  ON public.products FOR INSERT TO public WITH CHECK (true);

CREATE POLICY "Allow update access for products"
  ON public.products FOR UPDATE TO public USING (true);

CREATE POLICY "Allow delete access for products"
  ON public.products FOR DELETE TO public USING (true);

-- 6. Public Write Policies for Admin Management (cars)
CREATE POLICY "Admin can insert cars"
  ON public.cars FOR INSERT TO public WITH CHECK (true);

CREATE POLICY "Admin can update cars"
  ON public.cars FOR UPDATE TO public USING (true);

CREATE POLICY "Admin can delete cars"
  ON public.cars FOR DELETE TO public USING (true);

-- 7. Create Storage Bucket for Images
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- 8. Storage Bucket Public Access Policies
CREATE POLICY "Public Read Access for product-images"
  ON storage.objects FOR SELECT TO public USING (bucket_id = 'product-images');

CREATE POLICY "Public Upload Access for product-images"
  ON storage.objects FOR INSERT TO public WITH CHECK (bucket_id = 'product-images');

CREATE POLICY "Public Delete Access for product-images"
  ON storage.objects FOR DELETE TO public WITH CHECK (bucket_id = 'product-images');

