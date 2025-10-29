import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiClient } from '@/lib/api';
import { storeSecureToken, getSecureToken, removeSecureToken } from '@/lib/tokenEncryption';

interface AdminUser {
  id: number;
  name: string;
  email: string;
  username: string;
  roles: string[];
  is_active: boolean;
}

interface AdminAuthContextType {
  adminUser: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  getAuthToken: () => string | null;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};

interface AdminAuthProviderProps {
  children: ReactNode;
}

export const AdminAuthProvider: React.FC<AdminAuthProviderProps> = ({ children }) => {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is authenticated
  const isAuthenticated = !!adminUser;

  // Get auth token from secure storage
  const getAuthToken = (): string | null => {
    return getSecureToken('auth_token');
  };

  // Login function
  const login = async (email: string, password: string): Promise<void> => {
    try {
      setIsLoading(true);
      console.log('🔐 AdminAuth: Logging in...', { email });

      const response = await apiClient.login({ email, password, remember: true });

      console.log('🔍 AdminAuth: Full response:', response);

      // Check if user has admin role
      if (response.user && response.user.roles && response.user.roles.includes('admin')) {
        console.log('✅ AdminAuth: Admin user authenticated');
        setAdminUser(response.user);
        
        // Store token securely for API calls
        if (response.access_token) {
          storeSecureToken('auth_token', response.access_token);
          console.log('💾 AdminAuth: Token stored securely');
        }
      } else {
        console.log('❌ AdminAuth: User is not an admin');
        console.log('🔧 Current user roles:', response.user?.roles);
        throw new Error('Access denied. Admin privileges required.');
      }
    } catch (error) {
      console.error('❌ AdminAuth: Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    console.log('🚪 AdminAuth: Logging out');
    setAdminUser(null);
    removeSecureToken('auth_token');
  };

  // Check for existing token on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = getSecureToken('auth_token');
        if (token) {
          console.log('🔍 AdminAuth: Checking existing token');
          // Verify token by calling getCurrentUser - handles auth properly
          const user = await apiClient.getCurrentUser();
          
          // Check if user has admin role
          if (user && user.roles && Array.isArray(user.roles) && user.roles.includes('admin')) {
            console.log('✅ AdminAuth: Valid admin token found');
            // Map to AdminUser interface
            setAdminUser({
              id: user.id,
              name: user.name || user.username || '',
              email: user.email || '',
              username: user.username || '',
              roles: user.roles || [],
              is_active: user.is_active ?? true,
            });
          } else {
            console.log('❌ AdminAuth: Invalid or non-admin token');
            logout();
          }
        }
      } catch (error) {
        console.error('❌ AdminAuth: Token verification failed:', error);
        logout();
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const value: AdminAuthContextType = {
    adminUser,
    isAuthenticated,
    isLoading,
    login,
    logout,
    getAuthToken,
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};
