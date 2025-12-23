import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Shield, Lock, AlertTriangle, Mail, UserPlus, LogIn, KeyRound } from 'lucide-react';
import { z } from 'zod';

const emailSchema = z.string().email('Please enter a valid email address');
const passwordSchema = z.string().min(6, 'Password must be at least 6 characters');

type AuthMode = 'signIn' | 'signUp' | 'forgotPassword';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<AuthMode>('signIn');
  const { signIn, signUp, resetPassword } = useAuth();

  const validateInputs = (): boolean => {
    try {
      emailSchema.parse(email);
    } catch {
      setError('Please enter a valid email address');
      return false;
    }

    if (mode !== 'forgotPassword') {
      try {
        passwordSchema.parse(password);
      } catch {
        setError('Password must be at least 6 characters');
        return false;
      }

      if (mode === 'signUp' && password !== confirmPassword) {
        setError('Passwords do not match');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateInputs()) return;

    setIsLoading(true);

    try {
      if (mode === 'forgotPassword') {
        const { error } = await resetPassword(email);
        if (error) {
          setError(error);
        } else {
          setSuccess('Password reset email sent! Check your inbox.');
          setEmail('');
        }
      } else if (mode === 'signUp') {
        const { error } = await signUp(email, password);
        if (error) {
          setError(error);
        } else {
          setSuccess('Account created successfully! You are now logged in.');
        }
      } else {
        const { error } = await signIn(email, password);
        if (error) {
          setError(error);
        }
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
    }
    
    setIsLoading(false);
  };

  const switchMode = (newMode: AuthMode) => {
    setMode(newMode);
    setError('');
    setSuccess('');
    setPassword('');
    setConfirmPassword('');
  };

  const getTitle = () => {
    switch (mode) {
      case 'signUp': return 'REGISTER AGENT';
      case 'forgotPassword': return 'RECOVER ACCESS';
      default: return 'SECRET TASK';
    }
  };

  const getSubtitle = () => {
    switch (mode) {
      case 'signUp': return 'Create New Agent Profile';
      case 'forgotPassword': return 'Reset Your Clearance Code';
      default: return 'Mission Control Interface';
    }
  };

  return (
    <div className="min-h-screen bg-background grid-bg scanlines flex items-center justify-center p-4">
      {/* Background decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 text-primary/10 font-orbitron text-xs">
          SYS_INIT: OK
        </div>
        <div className="absolute top-10 right-10 text-primary/10 font-orbitron text-xs">
          SECURE_CHANNEL: ACTIVE
        </div>
        <div className="absolute bottom-10 left-10 text-primary/10 font-orbitron text-xs">
          ENCRYPTION: AES-256
        </div>
        <div className="absolute bottom-10 right-10 text-primary/10 font-orbitron text-xs">
          STATUS: AWAITING AUTH
        </div>
      </div>

      {/* Main login card */}
      <div className="w-full max-w-md animate-fade-in">
        <div className="border border-border bg-card/80 backdrop-blur-sm p-8 relative">
          {/* Top border accent */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
          
          {/* Agency logo/header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full border-2 border-primary/50 mb-4 animate-pulse-glow">
              <Shield className="w-10 h-10 text-primary" />
            </div>
            <h1 className="font-orbitron text-2xl font-bold text-foreground glow-text mb-2">
              {getTitle()}
            </h1>
            <p className="text-muted-foreground text-sm tracking-widest uppercase">
              {getSubtitle()}
            </p>
          </div>

          {/* Auth form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-orbitron text-primary uppercase tracking-wider flex items-center gap-2">
                <Mail className="w-3 h-3" />
                Agent Email
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email..."
                className="bg-background/50 border-border focus:border-primary"
                disabled={isLoading}
                autoFocus
              />
            </div>

            {mode !== 'forgotPassword' && (
              <div className="space-y-2">
                <label className="text-xs font-orbitron text-primary uppercase tracking-wider flex items-center gap-2">
                  <Lock className="w-3 h-3" />
                  Clearance Code
                </label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password..."
                  className="bg-background/50 border-border focus:border-primary"
                  disabled={isLoading}
                />
              </div>
            )}

            {mode === 'signUp' && (
              <div className="space-y-2">
                <label className="text-xs font-orbitron text-primary uppercase tracking-wider flex items-center gap-2">
                  <Lock className="w-3 h-3" />
                  Confirm Clearance Code
                </label>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm password..."
                  className="bg-background/50 border-border focus:border-primary"
                  disabled={isLoading}
                />
              </div>
            )}

            {/* Error message display */}
            {error && (
              <div className="flex items-center gap-2 text-accent text-sm animate-fade-in">
                <AlertTriangle className="w-4 h-4" />
                <span className="font-mono">{error}</span>
              </div>
            )}

            {/* Success message display */}
            {success && (
              <div className="flex items-center gap-2 text-success text-sm animate-fade-in">
                <Shield className="w-4 h-4" />
                <span className="font-mono">{success}</span>
              </div>
            )}

            {/* Submit button */}
            <Button
              type="submit"
              className="w-full"
              variant="mission"
              disabled={isLoading || !email || (mode !== 'forgotPassword' && !password)}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin">◐</span>
                  PROCESSING...
                </span>
              ) : mode === 'signUp' ? (
                <span className="flex items-center gap-2">
                  <UserPlus className="w-4 h-4" />
                  CREATE AGENT PROFILE
                </span>
              ) : mode === 'forgotPassword' ? (
                <span className="flex items-center gap-2">
                  <KeyRound className="w-4 h-4" />
                  SEND RESET LINK
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <LogIn className="w-4 h-4" />
                  INITIATE ACCESS
                </span>
              )}
            </Button>
          </form>

          {/* Mode switch links */}
          <div className="mt-6 space-y-2 text-center">
            {mode === 'signIn' && (
              <>
                <button
                  type="button"
                  onClick={() => switchMode('forgotPassword')}
                  className="text-xs text-primary/70 hover:text-primary font-mono transition-colors"
                >
                  Forgot your clearance code?
                </button>
                <div className="text-xs text-muted-foreground font-mono">
                  New agent?{' '}
                  <button
                    type="button"
                    onClick={() => switchMode('signUp')}
                    className="text-primary hover:underline"
                  >
                    Register here
                  </button>
                </div>
              </>
            )}
            {mode === 'signUp' && (
              <div className="text-xs text-muted-foreground font-mono">
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => switchMode('signIn')}
                  className="text-primary hover:underline"
                >
                  Sign in
                </button>
              </div>
            )}
            {mode === 'forgotPassword' && (
              <button
                type="button"
                onClick={() => switchMode('signIn')}
                className="text-xs text-primary/70 hover:text-primary font-mono transition-colors"
              >
                ← Back to login
              </button>
            )}
          </div>

          {/* Footer warning */}
          <div className="mt-8 pt-6 border-t border-border/50">
            <p className="text-xs text-muted-foreground text-center font-mono">
              ⚠ UNAUTHORIZED ACCESS IS PROHIBITED
            </p>
            <p className="text-xs text-muted-foreground/50 text-center mt-1 font-mono">
              All activities are monitored and logged
            </p>
          </div>

          {/* Bottom border accent */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
