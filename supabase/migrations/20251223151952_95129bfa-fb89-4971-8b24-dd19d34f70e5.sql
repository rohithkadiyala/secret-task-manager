-- Add INSERT policy for profiles table (defense-in-depth)
-- This allows explicit profile creation while maintaining security
CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = id);