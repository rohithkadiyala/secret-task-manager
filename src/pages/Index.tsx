import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import LoginPage from '@/components/LoginPage';
import Dashboard from '@/components/Dashboard';
import { Loader2 } from 'lucide-react';

/**
 * Main index page component
 * Renders either the login page or dashboard based on authentication status
 */
const Index: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background grid-bg flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
          <p className="font-orbitron text-muted-foreground uppercase tracking-wider">
            Initializing secure connection...
          </p>
        </div>
      </div>
    );
  }

  // Show dashboard if authenticated, otherwise show login
  return isAuthenticated ? <Dashboard /> : <LoginPage />;
};

export default Index;
