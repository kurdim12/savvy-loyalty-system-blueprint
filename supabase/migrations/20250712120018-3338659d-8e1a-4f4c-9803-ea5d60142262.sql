-- Fix user tiers based on their current points
-- Bronze: 0-199 points, Silver: 200-549 points, Gold: 550+ points

UPDATE profiles 
SET membership_tier = CASE 
  WHEN current_points >= 550 THEN 'gold'::membership_tier
  WHEN current_points >= 200 THEN 'silver'::membership_tier
  ELSE 'bronze'::membership_tier
END,
updated_at = now()
WHERE role = 'customer'
AND membership_tier != CASE 
  WHEN current_points >= 550 THEN 'gold'::membership_tier
  WHEN current_points >= 200 THEN 'silver'::membership_tier
  ELSE 'bronze'::membership_tier
END;