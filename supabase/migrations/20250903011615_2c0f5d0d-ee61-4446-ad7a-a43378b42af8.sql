-- Create missing tables to fix build errors

-- Create blockchain_networks table
CREATE TABLE IF NOT EXISTS public.blockchain_networks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  network_type TEXT NOT NULL,
  deposit_address TEXT NOT NULL,
  is_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on blockchain_networks
ALTER TABLE public.blockchain_networks ENABLE ROW LEVEL SECURITY;

-- Create policies for blockchain_networks
CREATE POLICY "Everyone can view enabled networks" 
ON public.blockchain_networks 
FOR SELECT 
USING (is_enabled = true);

CREATE POLICY "Only admins can manage networks" 
ON public.blockchain_networks 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Insert default blockchain networks
INSERT INTO public.blockchain_networks (name, network_type, deposit_address) VALUES
('Ethereum', 'ERC20', '0x1234567890123456789012345678901234567890'),
('Binance Smart Chain', 'BEP20', '0x0987654321098765432109876543210987654321'),
('Polygon', 'MATIC', '0x1111222233334444555566667777888899990000')
ON CONFLICT DO NOTHING;

-- Create nft_images table for content management
CREATE TABLE IF NOT EXISTS public.nft_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  image_url TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on nft_images
ALTER TABLE public.nft_images ENABLE ROW LEVEL SECURITY;

-- Create policies for nft_images
CREATE POLICY "Everyone can view active NFT images" 
ON public.nft_images 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Only admins can manage NFT images" 
ON public.nft_images 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create mining_token_images table
CREATE TABLE IF NOT EXISTS public.mining_token_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  image_url TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on mining_token_images
ALTER TABLE public.mining_token_images ENABLE ROW LEVEL SECURITY;

-- Create policies for mining_token_images
CREATE POLICY "Everyone can view active mining token images" 
ON public.mining_token_images 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Only admins can manage mining token images" 
ON public.mining_token_images 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Now let's modify the nft_staking_plans table to support the new locking mechanism
-- Add columns to track individual deposit timing
ALTER TABLE public.nft_staking_plans 
ADD COLUMN IF NOT EXISTS individual_start_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
ADD COLUMN IF NOT EXISTS individual_end_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS is_released BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS release_date TIMESTAMP WITH TIME ZONE;

-- Update individual_end_date for existing records
UPDATE public.nft_staking_plans 
SET 
  individual_start_date = start_date,
  individual_end_date = start_date + INTERVAL '45 days'
WHERE individual_end_date IS NULL;

-- Create a function to handle the new deposit locking logic
CREATE OR REPLACE FUNCTION public.handle_nft_deposit_locking()
RETURNS TRIGGER AS $$
DECLARE
  earliest_active_plan RECORD;
  remaining_days INTEGER;
BEGIN
  -- Find the earliest active (non-released) staking plan for this user
  SELECT * INTO earliest_active_plan
  FROM nft_staking_plans 
  WHERE user_id = NEW.user_id 
    AND is_released = false 
    AND status = 'active'
  ORDER BY start_date ASC 
  LIMIT 1;
  
  -- If there's an existing active plan, adopt its timeline
  IF earliest_active_plan.id IS NOT NULL AND earliest_active_plan.id != NEW.id THEN
    -- Calculate remaining days on the earliest plan
    remaining_days := GREATEST(0, EXTRACT(days FROM (earliest_active_plan.end_date - now()))::INTEGER);
    
    -- Set the new plan to follow the same end date as the earliest plan
    NEW.end_date := earliest_active_plan.end_date;
    NEW.individual_start_date := now();
    NEW.individual_end_date := now() + INTERVAL '45 days';
    
  ELSE
    -- This is the first plan or all previous plans are released
    NEW.end_date := NEW.start_date + INTERVAL '45 days';
    NEW.individual_start_date := NEW.start_date;
    NEW.individual_end_date := NEW.start_date + INTERVAL '45 days';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for new NFT deposits
DROP TRIGGER IF EXISTS nft_deposit_locking_trigger ON nft_staking_plans;
CREATE TRIGGER nft_deposit_locking_trigger
  BEFORE INSERT ON nft_staking_plans
  FOR EACH ROW
  EXECUTE FUNCTION handle_nft_deposit_locking();

-- Create a function to automatically release completed deposits
CREATE OR REPLACE FUNCTION public.release_completed_nft_deposits()
RETURNS void AS $$
BEGIN
  -- Release deposits where the collective lock period is complete
  UPDATE nft_staking_plans 
  SET 
    is_released = true,
    release_date = now(),
    status = 'completed'
  WHERE end_date <= now() 
    AND is_released = false 
    AND status = 'active';
    
  -- Also release individual deposits that have completed their 45-day period
  -- but only if they're not part of an active collective lock
  UPDATE nft_staking_plans 
  SET 
    is_released = true,
    release_date = now(),
    status = 'completed'
  WHERE individual_end_date <= now() 
    AND is_released = false 
    AND status = 'active'
    AND NOT EXISTS (
      SELECT 1 FROM nft_staking_plans nsp2 
      WHERE nsp2.user_id = nft_staking_plans.user_id 
        AND nsp2.end_date > now() 
        AND nsp2.is_released = false 
        AND nsp2.start_date < nft_staking_plans.start_date
    );
END;
$$ LANGUAGE plpgsql;