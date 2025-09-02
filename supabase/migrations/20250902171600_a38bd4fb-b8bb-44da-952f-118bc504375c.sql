-- First, let's create the admin_users table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on admin_users
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Create policy for admin_users
CREATE POLICY "Only admins can manage admin users" 
ON public.admin_users 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add the current authenticated user as admin
-- This will get the first user from profiles table and make them admin
INSERT INTO public.admin_users (user_id)
SELECT user_id FROM public.profiles LIMIT 1
ON CONFLICT (user_id) DO NOTHING;

-- Also add admin role to user_roles table
INSERT INTO public.user_roles (user_id, role)
SELECT user_id, 'admin'::app_role FROM public.profiles LIMIT 1
ON CONFLICT (user_id, role) DO NOTHING;

-- Create NFT packages table for NFT Management
CREATE TABLE IF NOT EXISTS public.nft_packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  price NUMERIC NOT NULL,
  daily_profit_rate NUMERIC DEFAULT 0.022,
  duration_days INTEGER DEFAULT 45,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on nft_packages
ALTER TABLE public.nft_packages ENABLE ROW LEVEL SECURITY;

-- Create policies for nft_packages
CREATE POLICY "Everyone can view active NFT packages" 
ON public.nft_packages 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Only admins can manage NFT packages" 
ON public.nft_packages 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add trigger for updated_at on nft_packages
CREATE TRIGGER update_nft_packages_updated_at
  BEFORE UPDATE ON nft_packages
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert some default NFT packages
INSERT INTO public.nft_packages (name, price, daily_profit_rate, duration_days, description) VALUES
('Starter NFT', 100, 0.022, 45, 'Perfect for beginners'),
('Pro NFT', 500, 0.025, 45, 'For experienced investors'),
('Premium NFT', 1000, 0.028, 45, 'Maximum returns package'),
('Elite NFT', 5000, 0.030, 45, 'VIP investment package')
ON CONFLICT DO NOTHING;

-- Add status column to profiles for blocking users
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';

-- Add admin_notes column to deposits for admin notes
ALTER TABLE public.deposits 
ADD COLUMN IF NOT EXISTS admin_notes TEXT;