-- Fix the points and tier calculation issue

-- First, let's manually fix users who have wrong tiers
UPDATE public.profiles 
SET 
  membership_tier = CASE
    WHEN current_points >= 550 THEN 'gold'::membership_tier
    WHEN current_points >= 200 THEN 'silver'::membership_tier
    ELSE 'bronze'::membership_tier
  END
WHERE (
  (current_points >= 550 AND membership_tier != 'gold') OR
  (current_points >= 200 AND current_points < 550 AND membership_tier != 'silver') OR
  (current_points < 200 AND membership_tier != 'bronze')
);

-- Now let's fix the trigger function to ensure it works correctly
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
  silver_threshold INTEGER;
  gold_threshold INTEGER;
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

  -- Get current tier
  SELECT membership_tier INTO current_tier
  FROM public.profiles
  WHERE id = NEW.user_id;

  -- Get rank thresholds from settings (default to standard values if not found)
  SELECT setting_value INTO rank_thresholds
  FROM public.settings
  WHERE setting_name = 'rank_thresholds';
  
  IF rank_thresholds IS NULL THEN
    silver_threshold := 200;
    gold_threshold := 550;
  ELSE
    silver_threshold := COALESCE((rank_thresholds->>'silver')::integer, 200);
    gold_threshold := COALESCE((rank_thresholds->>'gold')::integer, 550);
  END IF;

  -- Determine new tier based on points with proper logic
  IF p >= gold_threshold THEN
    new_tier := 'gold';
  ELSIF p >= silver_threshold THEN
    new_tier := 'silver';
  ELSE
    new_tier := 'bronze';
  END IF;

  -- Update points and tier
  UPDATE public.profiles 
  SET current_points = p,
      membership_tier = new_tier,
      updated_at = now()
  WHERE id = NEW.user_id;

  -- Create notification if tier upgraded (not downgraded)
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