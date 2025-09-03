-- Enable realtime for key tables and set replica identity
ALTER TABLE public.deposits REPLICA IDENTITY FULL;
ALTER TABLE public.withdrawals REPLICA IDENTITY FULL;
ALTER TABLE public.user_wallets REPLICA IDENTITY FULL;
ALTER TABLE public.nft_staking_plans REPLICA IDENTITY FULL;
ALTER TABLE public.profiles REPLICA IDENTITY FULL;

-- Add tables to supabase_realtime publication (ignore if already present)
DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.deposits;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.withdrawals;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.user_wallets;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.nft_staking_plans;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Create storage bucket for transaction screenshots if not exists
INSERT INTO storage.buckets (id, name, public)
VALUES ('transaction-screenshots', 'transaction-screenshots', true)
ON CONFLICT (id) DO NOTHING;

-- Public read access for transaction screenshots
DO $$ BEGIN
  CREATE POLICY "Transaction screenshots are publicly accessible"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'transaction-screenshots');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;