import { AuthProvider } from '@refinedev/core';
import { adminApiClient } from '@/lib/adminApi';

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

export const authProvider: AuthProvider = {
  login: async ({ email, password, remember }) => {
    try {
      // Get CSRF cookie first
      await adminApiClient.get('/sanctum/csrf-cookie');
      
      // Login request
      const { data } = await adminApiClient.post('/login', {
        email,
        password,
        remember: remember || false,
      });

      if (data.user) {
        localStorage.setItem('auth', JSON.stringify(data.user));
        return {
          success: true,
          redirectTo: '/dashboard',
        };
      }

      return {
        success: false,
        error: {
          name: 'LoginError',
          message: 'Invalid credentials',
        },
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          name: 'LoginError',
          message: error.response?.data?.message || 'Login failed',
        },
      };
    }
  },

  logout: async () => {
    try {
      await adminApiClient.post('/logout');
    } catch (error) {
      console.warn('Logout request failed:', error);
    } finally {
      localStorage.removeItem('auth');
      return {
        success: true,
        redirectTo: '/login',
      };
    }
  },

  check: async () => {
    const auth = localStorage.getItem('auth');
    if (!auth) {
      return {
        authenticated: false,
        redirectTo: '/login',
      };
    }

    try {
      const { data } = await adminApiClient.get('/api/user');
      return {
        authenticated: true,
        user: data,
      };
    } catch (error) {
      localStorage.removeItem('auth');
      return {
        authenticated: false,
        redirectTo: '/login',
      };
    }
  },

  getPermissions: async () => {
    const auth = localStorage.getItem('auth');
    if (!auth) return null;

    try {
      const { data } = await adminApiClient.get('/api/user');
      return data.permissions || [];
    } catch (error) {
      return null;
    }
  },

  getIdentity: async () => {
    const auth = localStorage.getItem('auth');
    if (!auth) return null;

    try {
      const { data } = await adminApiClient.get('/api/user');
      return data;
    } catch (error) {
      localStorage.removeItem('auth');
      return null;
    }
  },

  onError: async (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem('auth');
      return {
        logout: true,
        redirectTo: '/login',
      };
    }
    return {};
  },
};
