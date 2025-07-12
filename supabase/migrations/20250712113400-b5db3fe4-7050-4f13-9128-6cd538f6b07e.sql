-- Insert the "A Drop of Science 87+" reward into the database
INSERT INTO rewards (
  name,
  description,
  points_required,
  category,
  membership_required,
  cupping_score_min,
  image_url,
  active
) VALUES (
  'A Drop of Science 87+',
  'Premium Yellow Bourbon from Cerrado, Brazil. Natural process, grown at 1,200 masl. Notes of Chocolate and Dried Apricot. Perfect for pour-over or espresso brewing.',
  550,
  'beans',
  'gold',
  87,
  '/lovable-uploads/ea892e95-03ff-454c-9499-73f097aeaa40.png',
  true
);