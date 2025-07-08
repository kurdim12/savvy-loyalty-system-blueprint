-- Create the missing membership_tier enum type
CREATE TYPE public.membership_tier AS ENUM ('bronze', 'silver', 'gold');

-- Create the missing user_role enum type  
CREATE TYPE public.user_role AS ENUM ('customer', 'admin');