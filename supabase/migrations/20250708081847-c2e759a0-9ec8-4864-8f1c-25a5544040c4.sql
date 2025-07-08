-- Let me check if there are any triggers or constraints causing issues
-- First check what triggers exist on auth.users
SELECT 
    trigger_name,
    event_manipulation,
    action_statement,
    action_timing
FROM information_schema.triggers
WHERE event_object_table = 'users' 
AND event_object_schema = 'auth';