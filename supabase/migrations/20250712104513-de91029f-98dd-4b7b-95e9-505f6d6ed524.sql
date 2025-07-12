-- Update the Dose of Premium Coffee reward with the Himalaya Pineapple image
UPDATE rewards 
SET image_url = '/lovable-uploads/c52d1cfd-8ab5-4b21-b86e-aba52afcd8a7.png',
    name = 'Himalaya Pineapple Coffee Dose (87+ Score)',
    description = 'A measured dose of premium Himalaya Pineapple coffee from Apaneca, El Salvador. Bourbon variety, Natural process, grown at 1,550 masl with notes of Pineapple and Almond. Cupping score: 87+'
WHERE name = 'Dose of Premium Coffee (87+ Score)';