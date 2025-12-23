import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Shield, Lock, AlertTriangle, Check } from 'lucide-react';
import { z } from 'zod';

const passwordSchema = z.string().min(6, 'Password must be at least 6 characters');

const ResetPassword: React.FC = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { updatePassword, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If no session (user didn't come from reset email), redirect to login
    const checkSession = async () => {
      // Give a moment for the session to be established from the URL token
      await new Promise(resolve => setTimeout(resolve, 1000));
    };
    checkSession();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate password
    try {
      passwordSchema.parse(newPassword);
    } catch {
      setError('Password must be at least 6 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);

    const { error } = await updatePassword(newPassword);
    
    if (error) {
      setError(error);
    } else {
      setSuccess(true);
      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        navigate('/');
      }, 2000);
    }
    
    setIsLoading(false);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-background grid-bg scanlines flex items-center justify-center p-4">
        <div className="w-full max-w-md animate-fade-in">
          <div className="border border-border bg-card/80 backdrop-blur-sm p-8 relative text-center">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-success to-transparent" />
            
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full border-2 border-success/50 mb-4">
              <Check className="w-10 h-10 text-success" />
            </div>
            
            <h1 className="font-orbitron text-2xl font-bold text-foreground mb-2">
              PASSWORD UPDATED
            </h1>
            <p className="text-muted-foreground text-sm font-mono">
              Redirecting to mission control...
            </p>
            
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-success to-transparent" />
          </div>
        </div>
      </div>
    );
  }

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
          STATUS: PASSWORD RESET
        </div>
      </div>

      {/* Main card */}
      <div className="w-full max-w-md animate-fade-in">
        <div className="border border-border bg-card/80 backdrop-blur-sm p-8 relative">
          {/* Top border accent */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full border-2 border-primary/50 mb-4 animate-pulse-glow">
              <Shield className="w-10 h-10 text-primary" />
            </div>
            <h1 className="font-orbitron text-2xl font-bold text-foreground glow-text mb-2">
              SET NEW PASSWORD
            </h1>
            <p className="text-muted-foreground text-sm tracking-widest uppercase">
              Create your new clearance code
            </p>
          </div>

          {/* Reset form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-orbitron text-primary uppercase tracking-wider flex items-center gap-2">
                <Lock className="w-3 h-3" />
                New Clearance Code
              </label>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password..."
                className="bg-background/50 border-border focus:border-primary"
                disabled={isLoading}
                autoFocus
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-orbitron text-primary uppercase tracking-wider flex items-center gap-2">
                <Lock className="w-3 h-3" />
                Confirm Clearance Code
              </label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password..."
                className="bg-background/50 border-border focus:border-primary"
                disabled={isLoading}
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
              disabled={isLoading || !newPassword || !confirmPassword}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin">◐</span>
                  UPDATING...
                </span>
              ) : (
                'UPDATE PASSWORD'
              )}
            </Button>
          </form>

          {/* Footer warning */}
          <div className="mt-8 pt-6 border-t border-border/50">
            <p className="text-xs text-muted-foreground text-center font-mono">
              ⚠ CHOOSE A STRONG CLEARANCE CODE
            </p>
            <p className="text-xs text-muted-foreground/50 text-center mt-1 font-mono">
              Minimum 6 characters required
            </p>
          </div>

          {/* Bottom border accent */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
