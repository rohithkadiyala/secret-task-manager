-- Harden handle_new_user() with defense-in-depth check for duplicate profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  email_name text;
BEGIN
  -- Defense in depth: Check if profile already exists
  IF EXISTS (SELECT 1 FROM public.profiles WHERE id = new.id) THEN
    RETURN new;
  END IF;
  
  -- Extract name from email (everything before @)
  email_name := split_part(new.email, '@', 1);
  
  -- Insert profile with agent_id as "Agent-{email_name}"
  INSERT INTO public.profiles (id, agent_id, email)
  VALUES (new.id, 'Agent-' || email_name, new.email);
  
  RETURN new;
END;
$$;

-- Add comment documenting intentional SECURITY DEFINER usage
COMMENT ON FUNCTION public.handle_new_user() IS 'Trigger function to create user profile on signup. SECURITY DEFINER is intentionally required because this trigger fires on auth.users INSERT before the user context exists. Mitigations: fixed search_path, only uses trusted auth.users data, includes duplicate check.';