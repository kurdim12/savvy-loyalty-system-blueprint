-- First, let's check if the enum types exist and their current state
SELECT 
    t.typname AS enum_name,
    e.enumlabel AS enum_value
FROM pg_type t 
JOIN pg_enum e ON t.oid = e.enumtypid  
WHERE t.typname IN ('membership_tier', 'user_role', 'transaction_type')
ORDER BY t.typname, e.enumsortorder;