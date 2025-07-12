-- Update the image paths to use the lovable-uploads folder (which is publicly accessible)
-- We need to copy the generated images to public URLs

-- For now, let's use the existing placeholder images and update them to proper public paths
-- Update the 50g Premium Coffee Beans reward
UPDATE rewards 
SET image_url = '/lovable-uploads/50g-coffee-beans-mockup.jpg'
WHERE name = '50g Premium Coffee Beans (87+ Score)';

-- Update the Free Coffee Drink (88+ Score) reward  
UPDATE rewards 
SET image_url = '/lovable-uploads/88-score-coffee-drink-mockup.jpg'
WHERE name = 'Free Coffee Drink (88+ Score)';

-- Update the Free Premium Coffee Cup (89+ Score) reward
UPDATE rewards 
SET image_url = '/lovable-uploads/89-score-coffee-cup-mockup.jpg'  
WHERE name = 'Free Premium Coffee Cup (89+ Score)';

-- Update the Free Premium Coffee Cup Experience (90+ Score) reward
UPDATE rewards 
SET image_url = '/lovable-uploads/90-score-coffee-experience-mockup.jpg'
WHERE name = 'Free Premium Coffee Cup Experience (90+ Score)';