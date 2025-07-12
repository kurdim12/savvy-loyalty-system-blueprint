-- Fix image paths for the mockups to use proper file URLs
-- The generated images should be available as static files
UPDATE rewards 
SET image_url = '/lovable-uploads/dd3f28d1-2898-44d8-90c0-ccf0900182b8.png'
WHERE name = '50g Premium Coffee Beans (87+ Score)';

UPDATE rewards 
SET image_url = '/lovable-uploads/c52d1cfd-8ab5-4b21-b86e-aba52afcd8a7.png'
WHERE name = 'Free Coffee Drink (88+ Score)';

UPDATE rewards 
SET image_url = '/lovable-uploads/dd3f28d1-2898-44d8-90c0-ccf0900182b8.png'
WHERE name = 'Free Premium Coffee Cup (89+ Score)';

UPDATE rewards 
SET image_url = '/lovable-uploads/c52d1cfd-8ab5-4b21-b86e-aba52afcd8a7.png'
WHERE name = 'Free Premium Coffee Cup Experience (90+ Score)';