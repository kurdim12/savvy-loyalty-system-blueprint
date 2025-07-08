-- Create all required enum types that are missing
DO $$ 
BEGIN
    -- Create membership_tier enum if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'membership_tier') THEN
        CREATE TYPE public.membership_tier AS ENUM ('bronze', 'silver', 'gold');
    END IF;
    
    -- Create user_role enum if it doesn't exist  
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE public.user_role AS ENUM ('customer', 'admin');
    END IF;
    
    -- Create transaction_type enum if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'transaction_type') THEN
        CREATE TYPE public.transaction_type AS ENUM ('earn', 'redeem');
    END IF;
END $$;