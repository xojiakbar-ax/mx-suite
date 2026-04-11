-- Add approval and start work columns to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS approved BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS started BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS start_image TEXT;
