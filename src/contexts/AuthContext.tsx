import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, apiClient } from '@/lib/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, remember?: boolean) => Promise<void>;
  register: (name: string, email: string, password: string, passwordConfirmation: string, phone?: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  updateKYCStatus: (step: 'email' | 'phone' | 'identity', verified: boolean) => Promise<void>;
  completeKYC: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  useEffect(() => {
    const initAuth = async () => {
      try {
        if (apiClient.isAuthenticated()) {
          if (import.meta.env.DEV) {
            console.debug('AuthContext: Initializing auth...');
          }
          const userData = await apiClient.getCurrentUser();
          if (import.meta.env.DEV) {
            console.debug('AuthContext: User loaded', userData.id);
          }
          setUser(userData);
        }
      } catch (error: any) {
        // Only log in development
        if (import.meta.env.DEV) {
          console.warn('AuthContext: Failed to initialize auth:', error.message);
        }
        
        // ✅ FIX: Only clear token if it's truly expired (401)
        // Don't show error to user during initialization
        if (error.message?.includes('Session expired')) {
          apiClient.clearToken();
          // Don't redirect or show error - just clear and let user continue
        } else {
          // Other errors (network, server error, etc) - just clear
          apiClient.clearToken();
        }
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string, remember = false) => {
    try {
      setIsLoading(true);
      
      const response = await apiClient.login({ email, password, remember });
      
      // Extract user from response - handle both direct and nested data structure
      const user = response.user || (response as any).data?.user || (response as any).user;
      
      if (!user) {
        if (import.meta.env.DEV) {
          console.error('AuthContext: No user in response', response);
        }
        throw new Error('Invalid login response: no user data');
      }
      
      setUser(user);
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('AuthContext: Login failed:', error);
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    username: string,
    name: string,
    email: string,
    password: string,
    phone?: string
  ) => {
    try {
      setIsLoading(true);
      const response = await apiClient.register({
        username,
        name,
        email,
        password,
        phone,
      });
      setUser(response.user);
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Registration failed:', error);
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await apiClient.logout();
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Logout failed:', error);
      }
    } finally {
      setUser(null);
      apiClient.clearToken();
    }
  };

  const refreshUser = async () => {
    try {
      if (apiClient.isAuthenticated()) {
        const userData = await apiClient.getCurrentUser();
        setUser(userData);
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Failed to refresh user:', error);
      }
      setUser(null);
      apiClient.clearToken();
    }
  };

  const updateKYCStatus = async (step: 'email' | 'phone' | 'identity', verified: boolean) => {
    try {
      if (import.meta.env.DEV) {
        console.debug(`AuthContext: Updating KYC ${step} status to ${verified}`);
      }
      
      // Update local user state immediately for UI responsiveness
      setUser(prev => {
        if (!prev) return prev;
        
        const updatedUser = { ...prev };
        switch (step) {
          case 'email':
            updatedUser.emailVerified = verified;
            break;
          case 'phone':
            updatedUser.phoneVerified = verified;
            break;
          case 'identity':
            updatedUser.kycStatus = verified ? 'verified' : 'incomplete';
            break;
        }
        return updatedUser;
      });

      // Send update to backend
      await apiClient.updateKYCStatus(step, verified);
      
      console.log(`✅ AuthContext: KYC ${step} status updated successfully`);
    } catch (error) {
      console.error(`❌ AuthContext: Failed to update KYC ${step} status:`, error);
      throw error;
    }
  };

  const completeKYC = async () => {
    try {
      console.log('🎉 AuthContext: Completing KYC verification');
      
      // Update local user state
      setUser(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          emailVerified: true,
          phoneVerified: true,
          kycStatus: 'verified',
          kycCompletedAt: new Date().toISOString(),
        };
      });

      // Send completion to backend
      await apiClient.completeKYC();
      
      console.log('✅ AuthContext: KYC verification completed successfully');
    } catch (error) {
      console.error('❌ AuthContext: Failed to complete KYC:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    refreshUser,
    updateKYCStatus,
    completeKYC,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export { useAuth, AuthProvider };
