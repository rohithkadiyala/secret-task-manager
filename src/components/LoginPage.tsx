import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Shield, Lock, AlertTriangle } from 'lucide-react';

/**
 * Login page component for the secret agency application
 * Features a sleek, spy-themed interface with password authentication
 */
const LoginPage: React.FC = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  /**
   * Handles the login form submission
   * Validates password and shows appropriate feedback
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate network delay for dramatic effect
    await new Promise(resolve => setTimeout(resolve, 1500));

    const success = login(password);
    
    if (!success) {
      setError('ACCESS DENIED - Invalid clearance code');
      setPassword('');
    }
    
    setIsLoading(false);
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
              SHADOW OPS
            </h1>
            <p className="text-muted-foreground text-sm tracking-widest uppercase">
              Mission Control Interface
            </p>
          </div>

          {/* Login form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-orbitron text-primary uppercase tracking-wider flex items-center gap-2">
                <Lock className="w-3 h-3" />
                Clearance Code
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter authorization code..."
                className="bg-background/50 border-border focus:border-primary"
                disabled={isLoading}
                autoFocus
              />
            </div>

            {/* Error message display */}
            {error && (
              <div className="flex items-center gap-2 text-accent text-sm animate-fade-in">
                <AlertTriangle className="w-4 h-4" />
                <span className="font-mono">{error}</span>
              </div>
            )}

            {/* Submit button */}
            <Button
              type="submit"
              className="w-full"
              variant="mission"
              disabled={isLoading || !password}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin">◐</span>
                  AUTHENTICATING...
                </span>
              ) : (
                'INITIATE ACCESS'
              )}
            </Button>
          </form>

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
