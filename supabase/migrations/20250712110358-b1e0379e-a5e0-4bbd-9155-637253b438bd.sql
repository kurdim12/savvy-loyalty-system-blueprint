-- Update rewards with proper working image URLs from uploaded files
UPDATE rewards 
SET image_url = '/lovable-uploads/50g-coffee-beans-mockup.jpg'
WHERE name LIKE '%50g%' OR name LIKE '%beans%';

UPDATE rewards 
SET image_url = '/lovable-uploads/88-score-coffee-drink-mockup.jpg'
WHERE name LIKE '%drink%' AND name LIKE '%88%';

UPDATE rewards 
SET image_url = '/lovable-uploads/89-score-coffee-cup-mockup.jpg'
WHERE name LIKE '%cup%' AND (name LIKE '%89%' OR name LIKE '%premium%');

UPDATE rewards 
SET image_url = '/lovable-uploads/90-score-coffee-experience-mockup.jpg'
WHERE name LIKE '%experience%' OR name LIKE '%90%';

-- For Himalaya Pineapple varieties, use the beans image
UPDATE rewards 
SET image_url = '/lovable-uploads/50g-coffee-beans-mockup.jpg'
WHERE name LIKE '%Himalaya%';