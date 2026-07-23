-- =========================================================
-- ILLYRIAN CAR — SKEMA E KORRIGJUAR DHE E PLOTË
-- Ekzekuto këtë të tërën në Supabase → SQL Editor → Run
-- =========================================================

-- 1. Tabela CARS
create table if not exists cars (
  id uuid default gen_random_uuid() primary key,

  brand text not null,
  model text not null,
  year integer,

  category text,
  description text,

  price_per_day numeric not null,

  image_url text,
  gallery_urls text[] default '{}',

  transmission text,
  fuel text,
  seats integer,

  available boolean default true,

  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Në rast se tabela ekzistonte tashmë pa këtë kolonë (idempotent, e sigurt të rirendet):
alter table cars add column if not exists gallery_urls text[] default '{}';

-- 1b. Auto-update i updated_at në çdo UPDATE (mungonte — DEFAULT vetëm e vendos në INSERT)
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists cars_set_updated_at on cars;
create trigger cars_set_updated_at
  before update on cars
  for each row execute function set_updated_at();

-- 2. Row Level Security
alter table cars enable row level security;

drop policy if exists "Anyone can view cars" on cars;
create policy "Anyone can view cars"
on cars for select
using (true);

drop policy if exists "Admin can insert cars" on cars;
create policy "Admin can insert cars"
on cars for insert
with check (true);

drop policy if exists "Admin can update cars" on cars;
create policy "Admin can update cars"
on cars for update
using (true);

drop policy if exists "Admin can delete cars" on cars;
create policy "Admin can delete cars"
on cars for delete
using (true);

-- 3. Storage bucket për foto (KRITIKE — pa këtë, upload-i i fotove në Admin
--    dështon dhe bie automatikisht te Base64, që e fryn database-in shumë).
--    STORAGE_BUCKET = 'product-images' në src/services/productService.ts
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

drop policy if exists "Public Read Access for product-images" on storage.objects;
create policy "Public Read Access for product-images"
on storage.objects for select
using (bucket_id = 'product-images');

drop policy if exists "Public Upload Access for product-images" on storage.objects;
create policy "Public Upload Access for product-images"
on storage.objects for insert
with check (bucket_id = 'product-images');

drop policy if exists "Public Delete Access for product-images" on storage.objects;
create policy "Public Delete Access for product-images"
on storage.objects for delete
using (bucket_id = 'product-images');
