-- Add a database trigger to validate that codename is not empty after trimming
-- This prevents bypassing client-side validation via direct API calls

CREATE OR REPLACE FUNCTION public.validate_mission_codename()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  -- Validate codename is not empty after trimming whitespace
  IF TRIM(NEW.codename) = '' THEN
    RAISE EXCEPTION 'Mission codename cannot be empty';
  END IF;
  
  -- Normalize the codename by trimming whitespace
  NEW.codename := TRIM(NEW.codename);
  
  -- Also trim briefing if present
  IF NEW.briefing IS NOT NULL THEN
    NEW.briefing := TRIM(NEW.briefing);
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for INSERT operations
CREATE TRIGGER validate_mission_codename_insert
  BEFORE INSERT ON public.missions
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_mission_codename();

-- Create trigger for UPDATE operations
CREATE TRIGGER validate_mission_codename_update
  BEFORE UPDATE ON public.missions
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_mission_codename();