-- Update rewards with the new mockup images

-- Update the 50g Premium Coffee Beans reward
UPDATE rewards 
SET image_url = '/src/assets/50g-coffee-beans-mockup.jpg'
WHERE name = '50g Premium Coffee Beans (87+ Score)';

-- Update the Free Coffee Drink (88+ Score) reward
UPDATE rewards 
SET image_url = '/src/assets/88-score-coffee-drink-mockup.jpg'
WHERE name = 'Free Coffee Drink (88+ Score)';

-- Update the Free Premium Coffee Cup (89+ Score) reward
UPDATE rewards 
SET image_url = '/src/assets/89-score-coffee-cup-mockup.jpg'
WHERE name = 'Free Premium Coffee Cup (89+ Score)';

-- Update the Free Premium Coffee Cup Experience (90+ Score) reward
UPDATE rewards 
SET image_url = '/src/assets/90-score-coffee-experience-mockup.jpg'
WHERE name = 'Free Premium Coffee Cup Experience (90+ Score)';