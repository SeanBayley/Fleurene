-- =====================================================
-- PHASE 2: PRODUCT MANAGEMENT SYSTEM
-- =====================================================
-- Run this in Supabase SQL Editor to set up product tables

-- =====================================================
-- 1. PRODUCT CATEGORIES TABLE
-- =====================================================
CREATE TABLE public.product_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  parent_id UUID REFERENCES public.product_categories(id) ON DELETE SET NULL,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- =====================================================
-- 2. PRODUCTS TABLE
-- =====================================================
CREATE TABLE public.products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  short_description TEXT,
  sku TEXT UNIQUE,
  price DECIMAL(10,2) NOT NULL,
  compare_price DECIMAL(10,2), -- For showing discounts
  cost_price DECIMAL(10,2), -- For profit calculations
  category_id UUID REFERENCES public.product_categories(id) ON DELETE SET NULL,
  brand TEXT,
  weight DECIMAL(8,2), -- in grams
  dimensions JSONB, -- {length, width, height}
  materials JSONB DEFAULT '[]'::jsonb, -- Array of materials
  care_instructions TEXT,
  stock_quantity INTEGER DEFAULT 0,
  track_quantity BOOLEAN DEFAULT TRUE,
  allow_backorder BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  is_featured BOOLEAN DEFAULT FALSE,
  meta_title TEXT,
  meta_description TEXT,
  tags JSONB DEFAULT '[]'::jsonb, -- Array of tags
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- =====================================================
-- 3. PRODUCT IMAGES TABLE
-- =====================================================
CREATE TABLE public.product_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  image_url TEXT NOT NULL,
  alt_text TEXT,
  sort_order INTEGER DEFAULT 0,
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- =====================================================
-- 4. PRODUCT VARIANTS TABLE (for different sizes, colors, etc.)
-- =====================================================
CREATE TABLE public.product_variants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL, -- e.g., "Small - Gold", "Medium - Silver"
  sku TEXT UNIQUE,
  price DECIMAL(10,2), -- Override product price if different
  compare_price DECIMAL(10,2),
  stock_quantity INTEGER DEFAULT 0,
  weight DECIMAL(8,2),
  dimensions JSONB,
  options JSONB NOT NULL, -- {size: "Small", color: "Gold"}
  image_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- =====================================================
-- 5. PRODUCT COLLECTIONS TABLE
-- =====================================================
CREATE TABLE public.product_collections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  is_featured BOOLEAN DEFAULT FALSE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- =====================================================
-- 6. PRODUCT COLLECTION ITEMS (Many-to-Many)
-- =====================================================
CREATE TABLE public.product_collection_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  collection_id UUID REFERENCES public.product_collections(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  UNIQUE(collection_id, product_id)
);

-- =====================================================
-- 7. ENABLE ROW LEVEL SECURITY
-- =====================================================
ALTER TABLE public.product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_collection_items ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 8. CREATE RLS POLICIES (Public read, admin write)
-- =====================================================

-- Categories
CREATE POLICY "Anyone can view active categories" ON public.product_categories
  FOR SELECT USING (is_active = true);

-- Products
CREATE POLICY "Anyone can view active products" ON public.products
  FOR SELECT USING (is_active = true);

-- Product Images
CREATE POLICY "Anyone can view product images" ON public.product_images
  FOR SELECT USING (true);

-- Product Variants
CREATE POLICY "Anyone can view active variants" ON public.product_variants
  FOR SELECT USING (is_active = true);

-- Collections
CREATE POLICY "Anyone can view active collections" ON public.product_collections
  FOR SELECT USING (is_active = true);

-- Collection Items
CREATE POLICY "Anyone can view collection items" ON public.product_collection_items
  FOR SELECT USING (true);

-- =====================================================
-- 9. CREATE INDEXES FOR PERFORMANCE
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_products_category_id ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_sku ON public.products(sku);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON public.products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_is_featured ON public.products(is_featured);
CREATE INDEX IF NOT EXISTS idx_products_price ON public.products(price);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON public.products(created_at);

CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON public.product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_product_images_is_primary ON public.product_images(is_primary);

CREATE INDEX IF NOT EXISTS idx_product_variants_product_id ON public.product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_product_variants_sku ON public.product_variants(sku);

CREATE INDEX IF NOT EXISTS idx_product_categories_slug ON public.product_categories(slug);
CREATE INDEX IF NOT EXISTS idx_product_categories_parent_id ON public.product_categories(parent_id);

CREATE INDEX IF NOT EXISTS idx_product_collections_slug ON public.product_collections(slug);
CREATE INDEX IF NOT EXISTS idx_collection_items_collection_id ON public.product_collection_items(collection_id);
CREATE INDEX IF NOT EXISTS idx_collection_items_product_id ON public.product_collection_items(product_id);

-- =====================================================
-- 10. CREATE TRIGGERS FOR UPDATED_AT
-- =====================================================
CREATE TRIGGER update_product_categories_updated_at
  BEFORE UPDATE ON public.product_categories
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_product_variants_updated_at
  BEFORE UPDATE ON public.product_variants
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_product_collections_updated_at
  BEFORE UPDATE ON public.product_collections
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================
-- 11. INSERT SAMPLE DATA
-- =====================================================

-- Sample Categories
INSERT INTO public.product_categories (name, slug, description) VALUES
('Necklaces', 'necklaces', 'Beautiful necklaces for every occasion'),
('Earrings', 'earrings', 'Elegant earrings to complete your look'),
('Bracelets', 'bracelets', 'Charming bracelets and bangles'),
('Rings', 'rings', 'Stunning rings for all your fingers');

-- Sample Collections
INSERT INTO public.product_collections (name, slug, description, is_featured) VALUES
('Wildflower Dreams', 'wildflower-dreams', 'Inspired by nature''s beauty', true),
('Celestial Magic', 'celestial-magic', 'Stars, moons, and cosmic wonder', true),
('Vintage Romance', 'vintage-romance', 'Timeless pieces with vintage charm', false);

-- =====================================================
-- 12. GRANT PERMISSIONS
-- =====================================================
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON public.product_categories TO anon, authenticated;
GRANT SELECT ON public.products TO anon, authenticated;
GRANT SELECT ON public.product_images TO anon, authenticated;
GRANT SELECT ON public.product_variants TO anon, authenticated;
GRANT SELECT ON public.product_collections TO anon, authenticated;
GRANT SELECT ON public.product_collection_items TO anon, authenticated;

-- =====================================================
-- ✅ PHASE 2 SETUP COMPLETE!
-- =====================================================
-- Next steps:
-- 1. Execute this script in your Supabase SQL Editor
-- 2. Build admin product management interface
-- 3. Create public product catalog pages
-- 4. Implement search and filtering
-- ===================================================== 