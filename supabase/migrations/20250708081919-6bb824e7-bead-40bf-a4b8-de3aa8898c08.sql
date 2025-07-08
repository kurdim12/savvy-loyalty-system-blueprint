-- Let me completely disable the trigger temporarily to test
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- And also drop any other potential user signup bonus triggers
DROP TRIGGER IF EXISTS award_signup_bonus_trigger ON public.profiles;