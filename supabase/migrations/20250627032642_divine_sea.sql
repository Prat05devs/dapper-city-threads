/*
  # Complete Database Schema Setup

  1. New Tables
    - `profiles` - User profile information
    - `products` - Product listings
    - `bids` - Bidding system
    - `seller_reviews` - Seller rating system
    - `product_likes` - Product like system
    - `notifications` - User notifications
    - `transactions` - Payment transactions
    - `listing_payments` - Listing fee payments

  2. Security
    - Enable RLS on all tables
    - Add comprehensive policies for data access
    - Secure user data and transactions

  3. Functions & Triggers
    - Auto-create user profiles
    - Update seller statistics
    - Manage product likes count
    - Handle featured listings
*/

-- Create user profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  city TEXT,
  phone TEXT,
  avatar_url TEXT,
  user_type TEXT CHECK (user_type IN ('buyer', 'seller', 'donor')) DEFAULT 'buyer',
  total_sales INTEGER DEFAULT 0,
  total_ratings INTEGER DEFAULT 0,
  average_rating DECIMAL(3,2) DEFAULT 0.00,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  stripe_account_id TEXT,
  stripe_onboarding_completed BOOLEAN DEFAULT false,
  listing_count INTEGER DEFAULT 0,
  free_listings_used INTEGER DEFAULT 0
);

-- Add new columns to profiles if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'stripe_account_id'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN stripe_account_id TEXT;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'stripe_onboarding_completed'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN stripe_onboarding_completed BOOLEAN DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'listing_count'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN listing_count INTEGER DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'free_listings_used'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN free_listings_used INTEGER DEFAULT 0;
  END IF;
END $$;

-- Create products table
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  condition TEXT CHECK (condition IN ('Fair', 'Good', 'As New')) NOT NULL,
  category TEXT NOT NULL,
  image_urls TEXT[] DEFAULT '{}',
  likes_count INTEGER DEFAULT 0,
  status TEXT CHECK (status IN ('active', 'sold', 'pending')) DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  is_featured BOOLEAN DEFAULT false,
  featured_until TIMESTAMPTZ,
  listing_type TEXT DEFAULT 'free',
  payment_status TEXT DEFAULT 'pending'
);

-- Add new columns to products if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'is_featured'
  ) THEN
    ALTER TABLE public.products ADD COLUMN is_featured BOOLEAN DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'featured_until'
  ) THEN
    ALTER TABLE public.products ADD COLUMN featured_until TIMESTAMPTZ;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'listing_type'
  ) THEN
    ALTER TABLE public.products ADD COLUMN listing_type TEXT DEFAULT 'free';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'payment_status'
  ) THEN
    ALTER TABLE public.products ADD COLUMN payment_status TEXT DEFAULT 'pending';
  END IF;
END $$;

-- Create bids table
CREATE TABLE IF NOT EXISTS public.bids (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  buyer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  status TEXT CHECK (status IN ('pending', 'accepted', 'rejected', 'countered')) DEFAULT 'pending',
  counter_amount DECIMAL(10,2),
  message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create seller reviews table
CREATE TABLE IF NOT EXISTS public.seller_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  buyer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  comment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create product likes table
CREATE TABLE IF NOT EXISTS public.product_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add unique constraint if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_name = 'product_likes' AND constraint_name = 'product_likes_product_id_user_id_key'
  ) THEN
    ALTER TABLE public.product_likes ADD CONSTRAINT product_likes_product_id_user_id_key UNIQUE(product_id, user_id);
  END IF;
END $$;

-- Create notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  type TEXT CHECK (type IN ('bid_accepted', 'bid_rejected', 'bid_countered', 'new_message', 'new_review')) NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  related_id UUID,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create transactions table for Stripe payments
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bid_id UUID REFERENCES public.bids(id) ON DELETE CASCADE NOT NULL,
  buyer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  seller_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  stripe_session_id TEXT,
  stripe_payment_intent_id TEXT,
  status TEXT CHECK (status IN ('pending', 'completed', 'failed', 'refunded')) DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  platform_fee DECIMAL(10,2),
  seller_amount DECIMAL(10,2),
  confirmation_status TEXT DEFAULT 'pending',
  confirmed_at TIMESTAMPTZ
);

-- Add new columns to transactions if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'transactions' AND column_name = 'platform_fee'
  ) THEN
    ALTER TABLE public.transactions ADD COLUMN platform_fee DECIMAL(10,2);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'transactions' AND column_name = 'seller_amount'
  ) THEN
    ALTER TABLE public.transactions ADD COLUMN seller_amount DECIMAL(10,2);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'transactions' AND column_name = 'confirmation_status'
  ) THEN
    ALTER TABLE public.transactions ADD COLUMN confirmation_status TEXT DEFAULT 'pending';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'transactions' AND column_name = 'confirmed_at'
  ) THEN
    ALTER TABLE public.transactions ADD COLUMN confirmed_at TIMESTAMPTZ;
  END IF;
END $$;

-- Add check constraints if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.check_constraints
    WHERE constraint_name = 'transactions_confirmation_status_check'
  ) THEN
    ALTER TABLE public.transactions ADD CONSTRAINT transactions_confirmation_status_check 
    CHECK (confirmation_status IN ('pending', 'confirmed', 'auto_confirmed'));
  END IF;
END $$;

-- Create listing payments table
CREATE TABLE IF NOT EXISTS public.listing_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  stripe_session_id TEXT,
  amount DECIMAL(10,2) NOT NULL,
  type TEXT CHECK (type IN ('listing_fee', 'featured_3_days', 'featured_7_days')) NOT NULL,
  status TEXT CHECK (status IN ('pending', 'completed', 'failed')) DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  product_id UUID REFERENCES public.products(id)
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bids ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seller_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listing_payments ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist and recreate them
DO $$
BEGIN
  -- Profiles policies
  DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;
  DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
  DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
  
  CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
  CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
  CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

  -- Products policies
  DROP POLICY IF EXISTS "Anyone can view active products" ON public.products;
  DROP POLICY IF EXISTS "Sellers can manage own products" ON public.products;
  DROP POLICY IF EXISTS "Authenticated users can create products" ON public.products;
  
  CREATE POLICY "Anyone can view active products" ON public.products FOR SELECT USING (status = 'active');
  CREATE POLICY "Sellers can manage own products" ON public.products FOR ALL USING (auth.uid() = seller_id);
  CREATE POLICY "Authenticated users can create products" ON public.products FOR INSERT WITH CHECK (auth.uid() = seller_id);

  -- Bids policies
  DROP POLICY IF EXISTS "Users can view bids for own products or own bids" ON public.bids;
  DROP POLICY IF EXISTS "Buyers can create bids" ON public.bids;
  DROP POLICY IF EXISTS "Sellers can update bids on own products" ON public.bids;
  DROP POLICY IF EXISTS "Allow authenticated users to insert bids" ON public.bids;
  DROP POLICY IF EXISTS "Prevent self-bidding" ON public.bids;
  
  CREATE POLICY "Users can view bids for own products or own bids" ON public.bids FOR SELECT USING (
    auth.uid() = buyer_id OR 
    auth.uid() = (SELECT seller_id FROM public.products WHERE id = product_id)
  );
  CREATE POLICY "Buyers can create bids" ON public.bids FOR INSERT WITH CHECK (auth.uid() = buyer_id);
  CREATE POLICY "Sellers can update bids on own products" ON public.bids FOR UPDATE USING (
    auth.uid() = (SELECT seller_id FROM public.products WHERE id = product_id)
  );
  CREATE POLICY "Allow authenticated users to insert bids" ON public.bids FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
  CREATE POLICY "Prevent self-bidding" ON public.bids FOR INSERT WITH CHECK (
    (SELECT seller_id FROM public.products WHERE id = product_id) <> auth.uid()
  );

  -- Seller reviews policies
  DROP POLICY IF EXISTS "Anyone can view seller reviews" ON public.seller_reviews;
  DROP POLICY IF EXISTS "Buyers can create reviews" ON public.seller_reviews;
  
  CREATE POLICY "Anyone can view seller reviews" ON public.seller_reviews FOR SELECT USING (true);
  CREATE POLICY "Buyers can create reviews" ON public.seller_reviews FOR INSERT WITH CHECK (auth.uid() = buyer_id);

  -- Product likes policies
  DROP POLICY IF EXISTS "Users can view all likes" ON public.product_likes;
  DROP POLICY IF EXISTS "Users can manage own likes" ON public.product_likes;
  
  CREATE POLICY "Users can view all likes" ON public.product_likes FOR SELECT USING (true);
  CREATE POLICY "Users can manage own likes" ON public.product_likes FOR ALL USING (auth.uid() = user_id);

  -- Notifications policies
  DROP POLICY IF EXISTS "Users can view own notifications" ON public.notifications;
  DROP POLICY IF EXISTS "Users can update own notifications" ON public.notifications;
  DROP POLICY IF EXISTS "Authenticated users can create notifications" ON public.notifications;
  
  CREATE POLICY "Users can view own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
  CREATE POLICY "Users can update own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);
  CREATE POLICY "Authenticated users can create notifications" ON public.notifications FOR INSERT WITH CHECK (auth.role() = 'authenticated');

  -- Transactions policies
  DROP POLICY IF EXISTS "Users can view own transactions" ON public.transactions;
  
  CREATE POLICY "Users can view own transactions" ON public.transactions FOR SELECT USING (
    auth.uid() = buyer_id OR auth.uid() = seller_id
  );

  -- Listing payments policies
  DROP POLICY IF EXISTS "Users can view own listing payments" ON public.listing_payments;
  
  CREATE POLICY "Users can view own listing payments" ON public.listing_payments FOR SELECT USING (auth.uid() = seller_id);
END $$;

-- Create or replace functions
CREATE OR REPLACE FUNCTION update_seller_stats()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.profiles 
  SET 
    total_ratings = (SELECT COUNT(*) FROM public.seller_reviews WHERE seller_id = NEW.seller_id),
    average_rating = (SELECT AVG(rating) FROM public.seller_reviews WHERE seller_id = NEW.seller_id)
  WHERE id = NEW.seller_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.products 
    SET likes_count = likes_count + 1 
    WHERE id = NEW.product_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.products 
    SET likes_count = likes_count - 1 
    WHERE id = OLD.product_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION check_featured_expiry()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.featured_until IS NOT NULL AND NEW.featured_until <= now() THEN
    NEW.is_featured = false;
    NEW.featured_until = NULL;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_listing_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.profiles 
  SET listing_count = listing_count + 1
  WHERE id = NEW.seller_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, phone, city)
  VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    COALESCE(NEW.raw_user_meta_data->>'city', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing triggers if they exist and recreate them
DROP TRIGGER IF EXISTS update_seller_stats_trigger ON public.seller_reviews;
CREATE TRIGGER update_seller_stats_trigger
  AFTER INSERT ON public.seller_reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_seller_stats();

DROP TRIGGER IF EXISTS update_likes_count_trigger ON public.product_likes;
CREATE TRIGGER update_likes_count_trigger
  AFTER INSERT OR DELETE ON public.product_likes
  FOR EACH ROW
  EXECUTE FUNCTION update_likes_count();

DROP TRIGGER IF EXISTS check_featured_expiry_trigger ON public.products;
CREATE TRIGGER check_featured_expiry_trigger
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION check_featured_expiry();

DROP TRIGGER IF EXISTS update_listing_count_trigger ON public.products;
CREATE TRIGGER update_listing_count_trigger
  AFTER INSERT ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION update_listing_count();

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Enable realtime for tables that need real-time updates
DO $$
BEGIN
  -- Check if tables are already in the publication before adding
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'notifications'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'bids'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.bids;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'product_likes'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.product_likes;
  END IF;
EXCEPTION
  WHEN others THEN
    -- Ignore errors if publication doesn't exist or other issues
    NULL;
END $$;