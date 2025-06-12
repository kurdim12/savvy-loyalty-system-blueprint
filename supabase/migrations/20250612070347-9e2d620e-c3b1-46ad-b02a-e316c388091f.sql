
-- First, drop the foreign key constraint that's preventing the type change
ALTER TABLE public.messages DROP CONSTRAINT IF EXISTS messages_thread_id_fkey;

-- Now change thread_id to text type
ALTER TABLE public.messages ALTER COLUMN thread_id TYPE text;

-- Update any existing thread_id values to text
UPDATE public.messages SET thread_id = thread_id::text WHERE thread_id IS NOT NULL;
