-- Create a better version of the trigger with error handling
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    BEGIN
        INSERT INTO public.profiles (
            id, 
            first_name, 
            last_name, 
            email, 
            role,
            membership_tier,
            current_points,
            visits
        ) VALUES (
            NEW.id,
            COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
            COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
            NEW.email,
            CASE
                WHEN NEW.email LIKE '%admin%' THEN 'admin'::public.user_role
                ELSE 'customer'::public.user_role
            END,
            'bronze'::public.membership_tier,
            0,
            0
        );
        
        RETURN NEW;
    EXCEPTION
        WHEN OTHERS THEN
            -- Log the error and re-raise it
            RAISE LOG 'Error in handle_new_user trigger: %', SQLERRM;
            RAISE;
    END;
END;
$$;

-- Ensure the trigger is properly attached
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW 
    EXECUTE FUNCTION public.handle_new_user();