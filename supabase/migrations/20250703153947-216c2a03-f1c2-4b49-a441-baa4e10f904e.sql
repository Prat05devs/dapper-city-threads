-- Drop the existing check constraint
ALTER TABLE public.products DROP CONSTRAINT IF EXISTS products_condition_check;

-- Add the correct check constraint with proper condition values
ALTER TABLE public.products ADD CONSTRAINT products_condition_check 
CHECK (condition IN ('New', 'Like New', 'Good', 'Fair'));