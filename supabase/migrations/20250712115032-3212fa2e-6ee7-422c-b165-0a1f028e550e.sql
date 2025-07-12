-- Fix points system issues

-- 1. First, let's create the missing trigger for points recalculation
DROP TRIGGER IF EXISTS trigger_recalculate_points_on_transaction ON public.transactions;

CREATE TRIGGER trigger_recalculate_points_on_transaction
  AFTER INSERT OR UPDATE OR DELETE ON public.transactions
  FOR EACH ROW EXECUTE FUNCTION public.trigger_recalculate_points();

-- 2. Enable realtime for transactions table
ALTER TABLE public.transactions REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.transactions;

-- 3. Ensure profiles table is also available for realtime
ALTER TABLE public.profiles REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;