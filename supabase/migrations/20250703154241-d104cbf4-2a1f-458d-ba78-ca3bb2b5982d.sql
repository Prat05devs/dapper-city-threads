-- Remove check constraints that might be causing issues
ALTER TABLE public.products DROP CONSTRAINT IF EXISTS products_condition_check;
ALTER TABLE public.products DROP CONSTRAINT IF EXISTS products_category_check;

-- Update existing data to match our form values
UPDATE public.products 
SET condition = 'Like New' 
WHERE condition = 'As New';

UPDATE public.products 
SET category = 'Accessories' 
WHERE category = 'Jewelry';

-- Add the correct check constraints
ALTER TABLE public.products ADD CONSTRAINT products_condition_check 
CHECK (condition IN ('New', 'Like New', 'Good', 'Fair'));

ALTER TABLE public.products ADD CONSTRAINT products_category_check 
CHECK (category IN ('Clothing', 'Shoes', 'Accessories', 'Other'));