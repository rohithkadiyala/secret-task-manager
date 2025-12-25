-- Add length constraints to missions table for input validation
ALTER TABLE public.missions
ADD CONSTRAINT codename_length CHECK (length(codename) >= 1 AND length(codename) <= 200);

ALTER TABLE public.missions
ADD CONSTRAINT briefing_length CHECK (briefing IS NULL OR length(briefing) <= 5000);