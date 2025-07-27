-- Add shipping address columns to user_profiles table
-- This allows logged-in users to save their shipping information for future orders

ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS shipping_address1 text,
ADD COLUMN IF NOT EXISTS shipping_address2 text,
ADD COLUMN IF NOT EXISTS shipping_city text,
ADD COLUMN IF NOT EXISTS shipping_state text,
ADD COLUMN IF NOT EXISTS shipping_zip_code text,
ADD COLUMN IF NOT EXISTS shipping_country text DEFAULT 'US';

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_shipping_city ON public.user_profiles(shipping_city);
CREATE INDEX IF NOT EXISTS idx_user_profiles_shipping_state ON public.user_profiles(shipping_state);

-- Add comments for documentation
COMMENT ON COLUMN public.user_profiles.shipping_address1 IS 'Primary shipping address line';
COMMENT ON COLUMN public.user_profiles.shipping_address2 IS 'Secondary shipping address line (apartment, suite, etc.)';
COMMENT ON COLUMN public.user_profiles.shipping_city IS 'Shipping city';
COMMENT ON COLUMN public.user_profiles.shipping_state IS 'Shipping state/province';
COMMENT ON COLUMN public.user_profiles.shipping_zip_code IS 'Shipping ZIP/postal code';
COMMENT ON COLUMN public.user_profiles.shipping_country IS 'Shipping country (default: US)'; 