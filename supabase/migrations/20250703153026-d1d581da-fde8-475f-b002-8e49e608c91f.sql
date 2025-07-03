-- Add location fields to products table
ALTER TABLE public.products 
ADD COLUMN city text,
ADD COLUMN country text;