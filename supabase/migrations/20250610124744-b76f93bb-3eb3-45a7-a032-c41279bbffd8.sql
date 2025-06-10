
-- Create songs table for the music system
CREATE TABLE public.songs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  artist TEXT NOT NULL,
  votes INTEGER NOT NULL DEFAULT 0,
  added_by UUID REFERENCES auth.users NOT NULL,
  seat_area TEXT NOT NULL DEFAULT 'global',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security
ALTER TABLE public.songs ENABLE ROW LEVEL SECURITY;

-- Create policies for songs table
CREATE POLICY "Anyone can view songs" 
  ON public.songs 
  FOR SELECT 
  USING (true);

CREATE POLICY "Authenticated users can add songs" 
  ON public.songs 
  FOR INSERT 
  WITH CHECK (auth.uid() = added_by);

CREATE POLICY "Authenticated users can update songs" 
  ON public.songs 
  FOR UPDATE 
  USING (true);

-- Create function to vote for songs
CREATE OR REPLACE FUNCTION public.vote_for_song(song_id UUID)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE public.songs 
  SET votes = votes + 1 
  WHERE id = song_id;
END;
$$;
