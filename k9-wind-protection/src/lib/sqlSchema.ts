export const SUPABASE_SQL_SCHEMA = `-- ============================================================
-- SK SERVICES & SOLUTIONS LTD - SUPABASE DATABASE SCHEMA
-- Run this script in your Supabase SQL Editor (SQL Editor -> New Query)
-- ============================================================

-- 1. Create LEADS Table (Contact Form & Quote Submissions)
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    service_interested TEXT,
    message TEXT,
    status TEXT NOT NULL DEFAULT 'new', -- 'new' or 'contacted'
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. Create SERVICES Table (Dynamic Services on Live Site)
CREATE TABLE IF NOT EXISTS public.services (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    icon TEXT DEFAULT 'Shield',
    image_url TEXT,
    display_order INTEGER DEFAULT 0,
    "order" INTEGER DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. Create TESTIMONIALS Table (Customer Reviews)
CREATE TABLE IF NOT EXISTS public.testimonials (
    id TEXT PRIMARY KEY DEFAULT ('test-' || substr(md5(random()::text), 1, 8)),
    name TEXT NOT NULL,
    quote TEXT NOT NULL,
    rating NUMERIC NOT NULL DEFAULT 5,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ============================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- LEADS POLICIES:
-- 1. Anyone (public anonymous visitors) can submit a lead / contact form
CREATE POLICY "Public insert leads" 
ON public.leads 
FOR INSERT 
TO anon, authenticated 
WITH CHECK (true);

-- 2. Authenticated admin users can view, update (e.g. mark contacted), and delete leads
CREATE POLICY "Admin full access leads" 
ON public.leads 
FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- SERVICES POLICIES:
-- 1. Anyone can read active services
CREATE POLICY "Public read services" 
ON public.services 
FOR SELECT 
TO anon, authenticated 
USING (true);

-- 2. Authenticated admin users can add, edit, or delete services
CREATE POLICY "Admin full access services" 
ON public.services 
FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- TESTIMONIALS POLICIES:
-- 1. Anyone can read testimonials
CREATE POLICY "Public read testimonials" 
ON public.testimonials 
FOR SELECT 
TO anon, authenticated 
USING (true);

-- 2. Authenticated admin users can add, edit, or delete testimonials
CREATE POLICY "Admin full access testimonials" 
ON public.testimonials 
FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- ============================================================
-- SEED INITIAL DATA (6 Core Services & Initial Testimonials)
-- ============================================================

INSERT INTO public.services (id, title, description, image_url, icon, display_order, is_active)
VALUES 
  (
    'security-guards',
    'Security Guards',
    'Professional, SIA-licensed security guards providing reliable on-site protection and peace of mind.',
    '/images/Security-Guards.webp',
    'Shield',
    1,
    true
  ),
  (
    'gatehouse-security',
    'Gatehouse Security',
    'Dedicated gatehouse officers controlling site access, monitoring visitors, and ensuring secure entry points.',
    '/images/Gatehouse-Security.webp',
    'Building2',
    2,
    true
  ),
  (
    'security-dog-services',
    'Security Dog Services',
    'Professional NASDU-certified security dogs and handlers providing reliable protection for all environments.',
    '/images/Security-Dog-Services.webp',
    'Dog',
    3,
    true
  ),
  (
    'construction-site-security-dogs',
    'Construction Site Security Dogs',
    'Trained guard dogs deterring theft, vandalism, and trespassing on construction projects of every size.',
    '/images/Construction-Site-Security-Dogs.webp',
    'HardHat',
    4,
    true
  ),
  (
    'k9-security-services',
    'K9 Security Services',
    'Specialist K9 teams delivering tailored security solutions for businesses, properties, and private clients.',
    '/images/K9-Security-Services.webp',
    'Activity',
    5,
    true
  ),
  (
    'vacant-property-security-dogs',
    'Vacant Property Security Dogs',
    'Proactive dog patrols safeguarding empty or disused buildings from trespassers, squatters, and damage.',
    '/images/Vacant-Property-Security-Dogs.webp',
    'Warehouse',
    6,
    true
  )
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  image_url = EXCLUDED.image_url,
  display_order = EXCLUDED.display_order;

INSERT INTO public.testimonials (id, name, quote, rating)
VALUES
  (
    'test-1',
    'Teresia Dua',
    'Professional company, great advice and really competitive prices. SK Services & Solutions looked after my property of 6 acres with valuable storage. Excellent job, thank you.',
    5
  ),
  (
    'test-2',
    'Thomas Edwards',
    'Brilliant company, we have been using them for a while now and have had no issues at all. Everyone has been very professional and always works to very high standards. Highly recommended.',
    5
  ),
  (
    'test-3',
    'Anne Frankline',
    'Always prepared to adapt to the requirements at the time, time keeping was spot on and always friendly and approachable. Will definitely use again.',
    5
  ),
  (
    'test-4',
    'Frankline',
    'Working with SK Services & Solutions Ltd has been a great experience. Direct communication, great support on the ground, and highly professional management.',
    5
  )
ON CONFLICT (id) DO NOTHING;
`;
