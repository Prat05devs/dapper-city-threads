
-- Add product_id column to listing_payments table to support featured listing payments
ALTER TABLE public.listing_payments 
ADD COLUMN product_id UUID REFERENCES public.products(id);
