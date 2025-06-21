
-- Add missing columns to profiles table for complete user data
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS city TEXT;

-- Update the handle_new_user function to save all collected fields
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, phone, city)
  VALUES (
    NEW.id, 
    NEW.email, 
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'phone',
    NEW.raw_user_meta_data->>'city'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add missing columns to products table if they don't exist
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS listing_type TEXT DEFAULT 'free',
ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending';

-- Update profiles table to track free listings properly
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS free_listings_used INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS listing_count INTEGER DEFAULT 0;

-- Create function to update listing count when product is created
CREATE OR REPLACE FUNCTION public.update_listing_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.profiles 
  SET listing_count = listing_count + 1,
      free_listings_used = CASE 
        WHEN free_listings_used < 3 THEN free_listings_used + 1 
        ELSE free_listings_used 
      END
  WHERE id = NEW.seller_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updating listing count
DROP TRIGGER IF EXISTS update_listing_count_trigger ON public.products;
CREATE TRIGGER update_listing_count_trigger
  AFTER INSERT ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION update_listing_count();

-- Ensure proper RLS policies for products
DROP POLICY IF EXISTS "Anyone can view active products" ON public.products;
DROP POLICY IF EXISTS "Sellers can manage own products" ON public.products;

CREATE POLICY "Anyone can view active products" ON public.products 
FOR SELECT USING (status = 'active');

CREATE POLICY "Sellers can manage own products" ON public.products 
FOR ALL USING (auth.uid() = seller_id);

CREATE POLICY "Authenticated users can create products" ON public.products 
FOR INSERT WITH CHECK (auth.uid() = seller_id);

-- Ensure proper RLS policies for profiles
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;

CREATE POLICY "Users can view all profiles" ON public.profiles 
FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON public.profiles 
FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles 
FOR INSERT WITH CHECK (auth.uid() = id);
