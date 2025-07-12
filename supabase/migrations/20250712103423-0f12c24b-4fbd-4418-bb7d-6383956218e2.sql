-- Update rewards without images to have placeholder images

-- Update the 50g Premium Coffee Beans reward
UPDATE rewards 
SET image_url = '/src/assets/coffee-beans-placeholder.jpg'
WHERE id = '527e0602-40ec-47d4-ac34-1a88439f76cd' AND image_url IS NULL;

-- Update the Dose of Premium Coffee reward  
UPDATE rewards 
SET image_url = '/src/assets/coffee-dose-placeholder.jpg'
WHERE id = '058ce236-bfa5-4f95-8b0d-04d616b6fb50' AND image_url IS NULL;

-- Update the Free Coffee Drink (88+ Score) reward
UPDATE rewards 
SET image_url = '/src/assets/coffee-cup-placeholder.jpg'
WHERE id = '2ad54adf-c769-458e-b00d-2209cd57dacc' AND image_url IS NULL;

-- Update the Free Premium Coffee Cup (89+ Score) reward
UPDATE rewards 
SET image_url = '/src/assets/coffee-cup-placeholder.jpg'
WHERE id = '76cf40fa-e81b-4dc8-99e6-1a605da1f7ed' AND image_url IS NULL;

-- Update the Free Premium Coffee Cup Experience (90+ Score) reward
UPDATE rewards 
SET image_url = '/src/assets/coffee-cup-placeholder.jpg'
WHERE id = '6dd39473-8a93-45f3-8d4d-aeb47d2a56bb' AND image_url IS NULL;