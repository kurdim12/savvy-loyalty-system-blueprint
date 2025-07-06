-- Update the points recalculation trigger to also handle automatic tier upgrades
CREATE OR REPLACE FUNCTION public.trigger_recalculate_points()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  p INTEGER;
  current_tier membership_tier;
  new_tier membership_tier;
  rank_thresholds JSONB;
BEGIN
  -- Recalculate total points
  SELECT COALESCE(
    SUM(CASE
          WHEN transaction_type = 'earn'   THEN points
          WHEN transaction_type = 'redeem' THEN -points
          ELSE 0
        END), 0)
  INTO p
  FROM public.transactions
  WHERE user_id = NEW.user_id;

  -- Get current tier and rank thresholds
  SELECT membership_tier INTO current_tier
  FROM public.profiles
  WHERE id = NEW.user_id;

  -- Get rank thresholds from settings (default to standard values if not found)
  SELECT setting_value INTO rank_thresholds
  FROM public.settings
  WHERE setting_name = 'rank_thresholds';
  
  IF rank_thresholds IS NULL THEN
    rank_thresholds := '{"silver": 200, "gold": 550}'::jsonb;
  END IF;

  -- Determine new tier based on points
  IF p >= (rank_thresholds->>'gold')::integer THEN
    new_tier := 'gold';
  ELSIF p >= (rank_thresholds->>'silver')::integer THEN
    new_tier := 'silver';
  ELSE
    new_tier := 'bronze';
  END IF;

  -- Update points and tier if changed
  UPDATE public.profiles 
  SET current_points = p,
      membership_tier = new_tier,
      updated_at = now()
  WHERE id = NEW.user_id;

  -- Create notification if tier upgraded
  IF new_tier != current_tier AND 
     ((current_tier = 'bronze' AND new_tier IN ('silver', 'gold')) OR
      (current_tier = 'silver' AND new_tier = 'gold')) THEN
    
    INSERT INTO public.notifications (
      user_id,
      title,
      message,
      type
    ) VALUES (
      NEW.user_id,
      '🎉 ' || UPPER(new_tier::text) || ' Member!',
      'Congratulations! You''ve been promoted to ' || new_tier::text || ' membership tier with exclusive benefits!',
      'tier_upgrade'
    );
  END IF;

  RETURN NEW;
END; 
$$;