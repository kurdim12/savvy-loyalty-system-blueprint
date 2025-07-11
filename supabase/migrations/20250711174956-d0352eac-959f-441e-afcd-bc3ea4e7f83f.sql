-- Add missing referee_email column to referrals table
ALTER TABLE public.referrals ADD COLUMN IF NOT EXISTS referee_email TEXT;

-- Add status column to referrals table 
ALTER TABLE public.referrals ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending';