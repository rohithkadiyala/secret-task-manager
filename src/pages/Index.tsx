import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import LoginPage from '@/components/LoginPage';
import Dashboard from '@/components/Dashboard';

/**
 * Main index page component
 * Renders either the login page or dashboard based on authentication status
 */
const Index: React.FC = () => {
  const { isAuthenticated } = useAuth();

  // Show dashboard if authenticated, otherwise show login
  return isAuthenticated ? <Dashboard /> : <LoginPage />;
};

export default Index;
