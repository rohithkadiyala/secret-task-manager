import React, { createContext, useContext, useState, ReactNode } from 'react';

/**
 * Authentication context for the secret agency application
 * Manages user login state across the application
 */

interface AuthContextType {
  isAuthenticated: boolean;
  agentId: string | null;
  login: (password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// The secret password for agency access
// In a real application, this would be handled server-side with proper hashing
const AGENCY_PASSWORD = 'password';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [agentId, setAgentId] = useState<string | null>(null);

  /**
   * Attempts to authenticate with the provided password
   * Returns true if authentication was successful
   */
  const login = (password: string): boolean => {
    if (password === AGENCY_PASSWORD) {
      setIsAuthenticated(true);
      // Generate a random agent ID for the session
      setAgentId(`AGENT-${Math.random().toString(36).substring(2, 8).toUpperCase()}`);
      return true;
    }
    return false;
  };

  /**
   * Logs out the current agent and clears session data
   */
  const logout = () => {
    setIsAuthenticated(false);
    setAgentId(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, agentId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Custom hook to access authentication context
 * Must be used within an AuthProvider
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
