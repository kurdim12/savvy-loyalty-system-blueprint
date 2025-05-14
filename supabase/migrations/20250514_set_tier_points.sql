
-- Replace the old helper with a points-aware version
CREATE OR REPLACE FUNCTION set_user_tier(uid uuid, new_tier text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  floor_points integer := CASE
    WHEN lower(new_tier) = 'silver' THEN 200
    WHEN lower(new_tier) = 'gold'   THEN 550
    ELSE 0                           -- bronze or any fallback
  END;
BEGIN
  UPDATE profiles
  SET membership_tier = lower(new_tier)::membership_tier,
      current_points = floor_points,
      updated_at = now()
  WHERE id = uid;
END;
$$;
