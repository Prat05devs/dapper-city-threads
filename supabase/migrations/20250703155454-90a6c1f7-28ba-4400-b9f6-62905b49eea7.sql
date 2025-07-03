-- Fix function search path security warnings by setting immutable search_path

-- Update update_likes_count function
CREATE OR REPLACE FUNCTION public.update_likes_count()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = ''
AS $function$
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
$function$;

-- Update update_listing_count function
CREATE OR REPLACE FUNCTION public.update_listing_count()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = ''
AS $function$
BEGIN
  UPDATE public.profiles 
  SET listing_count = listing_count + 1
  WHERE id = NEW.seller_id;
  RETURN NEW;
END;
$function$;

-- Update handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = ''
AS $function$
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
$function$;

-- Update update_seller_stats function
CREATE OR REPLACE FUNCTION public.update_seller_stats()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = ''
AS $function$
BEGIN
  UPDATE public.profiles 
  SET 
    total_ratings = (SELECT COUNT(*) FROM public.seller_reviews WHERE seller_id = NEW.seller_id),
    average_rating = (SELECT AVG(rating) FROM public.seller_reviews WHERE seller_id = NEW.seller_id)
  WHERE id = NEW.seller_id;
  RETURN NEW;
END;
$function$;

-- Update check_featured_expiry function
CREATE OR REPLACE FUNCTION public.check_featured_expiry()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = ''
AS $function$
BEGIN
  IF NEW.featured_until IS NOT NULL AND NEW.featured_until <= now() THEN
    NEW.is_featured = false;
    NEW.featured_until = NULL;
  END IF;
  RETURN NEW;
END;
$function$;