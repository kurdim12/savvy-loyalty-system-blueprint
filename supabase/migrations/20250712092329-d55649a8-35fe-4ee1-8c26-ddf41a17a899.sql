-- Create QA errors log table
CREATE TABLE public.qa_errors_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  page_name TEXT NOT NULL,
  element TEXT NOT NULL,
  error_type TEXT NOT NULL,
  message TEXT NOT NULL,
  suggested_fix TEXT,
  severity TEXT DEFAULT 'medium',
  status TEXT DEFAULT 'open',
  reported_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.qa_errors_log ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Admins can manage QA errors"
ON public.qa_errors_log
FOR ALL
USING (is_admin(auth.uid()))
WITH CHECK (is_admin(auth.uid()));

-- Create trigger for updated_at
CREATE TRIGGER update_qa_errors_log_updated_at
BEFORE UPDATE ON public.qa_errors_log
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();