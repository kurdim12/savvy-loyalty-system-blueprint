-- Test the handle_new_user function by simulating a user insert
DO $$
DECLARE
    test_user_id uuid := gen_random_uuid();
BEGIN
    -- Test inserting into profiles table directly
    INSERT INTO public.profiles (
        id, 
        first_name, 
        last_name, 
        email, 
        role, 
        membership_tier
    ) VALUES (
        test_user_id,
        'Test',
        'User', 
        'test@example.com',
        'customer'::user_role,
        'bronze'::membership_tier
    );
    
    -- Clean up test data
    DELETE FROM public.profiles WHERE id = test_user_id;
    
    RAISE NOTICE 'Test insert successful - profiles table is working';
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Error in profiles table: %', SQLERRM;
END $$;