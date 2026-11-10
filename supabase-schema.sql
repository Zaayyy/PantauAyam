-- ==========================================================================
-- BRMP DIY POULTRY TRACKER - SUPABASE DATABASE SCHEMA
-- Salin dan jalankan seluruh script ini di Supabase SQL Editor
-- ==========================================================================

-- 1. Buat Tabel Floks / Kandang
CREATE TABLE IF NOT EXISTS public.flocks (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    code TEXT NOT NULL UNIQUE,
    breed TEXT NOT NULL,
    production_type TEXT NOT NULL DEFAULT 'broiler',
    doc_date DATE NOT NULL,
    initial_pop INTEGER NOT NULL,
    current_pop INTEGER NOT NULL,
    cage_type TEXT DEFAULT '',
    location TEXT DEFAULT '',
    officer TEXT DEFAULT '',
    notes TEXT DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Buat Tabel Penimbangan Mingguan
CREATE TABLE IF NOT EXISTS public.weighings (
    id TEXT PRIMARY KEY,
    flock_id TEXT NOT NULL REFERENCES public.flocks(id) ON DELETE CASCADE,
    week INTEGER NOT NULL,
    date DATE NOT NULL,
    age_days INTEGER NOT NULL,
    avg_weight NUMERIC(8, 2) NOT NULL,
    target_weight NUMERIC(8, 2) NOT NULL,
    sample_count INTEGER DEFAULT 0,
    samples_json JSONB DEFAULT '[]'::jsonb,
    uniformity NUMERIC(5, 2) DEFAULT 0,
    feed_intake_kg NUMERIC(8, 2) DEFAULT 0,
    mortality INTEGER DEFAULT 0,
    cull INTEGER DEFAULT 0,
    population_added INTEGER DEFAULT 0,
    population_decreased INTEGER DEFAULT 0,
    population_shipped INTEGER DEFAULT 0,
    egg_count INTEGER DEFAULT 0,
    egg_weight_kg NUMERIC(8, 2) DEFAULT 0,
    health_note TEXT DEFAULT '',
    photo_url TEXT DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT unique_flock_week UNIQUE (flock_id, week)
);

-- Tambahkan kolom monitoring saat schema lama sudah pernah diterapkan.
ALTER TABLE public.flocks
    ADD COLUMN IF NOT EXISTS production_type TEXT NOT NULL DEFAULT 'broiler';

ALTER TABLE public.weighings
    ADD COLUMN IF NOT EXISTS population_added INTEGER DEFAULT 0,
    ADD COLUMN IF NOT EXISTS population_decreased INTEGER DEFAULT 0,
    ADD COLUMN IF NOT EXISTS population_shipped INTEGER DEFAULT 0,
    ADD COLUMN IF NOT EXISTS egg_count INTEGER DEFAULT 0,
    ADD COLUMN IF NOT EXISTS egg_weight_kg NUMERIC(8, 2) DEFAULT 0;

-- 3. Atur Hak Akses (Row Level Security - RLS)
-- Mengizinkan akses baca dan tulis publik untuk API web
ALTER TABLE public.flocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weighings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access on flocks" ON public.flocks FOR SELECT USING (true);
CREATE POLICY "Allow public insert on flocks" ON public.flocks FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on flocks" ON public.flocks FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on flocks" ON public.flocks FOR DELETE USING (true);

CREATE POLICY "Allow public read access on weighings" ON public.weighings FOR SELECT USING (true);
CREATE POLICY "Allow public insert on weighings" ON public.weighings FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on weighings" ON public.weighings FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on weighings" ON public.weighings FOR DELETE USING (true);

-- 4. Buat Storage Bucket Publik untuk Foto Dokumentasi
INSERT INTO storage.buckets (id, name, public) 
VALUES ('poultry-docs', 'poultry-docs', true)
ON CONFLICT (id) DO UPDATE SET public = true;

CREATE POLICY "Public Access for poultry-docs" ON storage.objects
FOR SELECT USING (bucket_id = 'poultry-docs');

CREATE POLICY "Public Upload for poultry-docs" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'poultry-docs');

CREATE POLICY "Public Delete for poultry-docs" ON storage.objects
FOR DELETE USING (bucket_id = 'poultry-docs');
