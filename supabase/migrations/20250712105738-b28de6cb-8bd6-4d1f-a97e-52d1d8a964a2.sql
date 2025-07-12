-- Create the reward-images storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('reward-images', 'reward-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policy for reward images to be publicly readable
INSERT INTO storage.policies (id, bucket_id, operation, check_expression)
VALUES (
  'reward-images-public-read',
  'reward-images', 
  'SELECT',
  'true'
) ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload images
INSERT INTO storage.policies (id, bucket_id, operation, check_expression)
VALUES (
  'reward-images-upload',
  'reward-images',
  'INSERT', 
  'auth.role() = ''authenticated'''
) ON CONFLICT (id) DO NOTHING;