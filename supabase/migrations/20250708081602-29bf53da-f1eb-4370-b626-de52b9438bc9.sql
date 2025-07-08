-- Check if the handle_new_user trigger exists and is properly configured
SELECT 
    p.proname as function_name,
    t.tgname as trigger_name,
    c.relname as table_name
FROM pg_proc p
LEFT JOIN pg_trigger t ON t.tgfoid = p.oid
LEFT JOIN pg_class c ON c.oid = t.tgrelid
WHERE p.proname = 'handle_new_user';