import { DataProvider } from '@refinedev/core';
import { apiClient } from '@/lib/api';

// Helper function to get admin token
const getAdminToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

// Real API-based data provider for admin panel
export const dataProvider: DataProvider = {
  getList: async ({ resource, pagination, sorters, filters, meta }) => {
    console.log('📊 Admin API: Get List', { resource, pagination, sorters, filters });
    
    try {
      let endpoint = `/${resource}`;
      const params = new URLSearchParams();
      
      if (pagination) {
        params.append('page', pagination.current?.toString() || '1');
        params.append('per_page', pagination.pageSize?.toString() || '10');
      }
      
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            params.append(key, value.toString());
          }
        });
      }
      
      if (params.toString()) {
        endpoint += `?${params.toString()}`;
      }
      
      const token = getAdminToken();
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
      
      const response = await fetch(`https://api.nxoland.com/api${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...headers,
        },
      });
      const data = await response.json();
      return {
        data: Array.isArray(data.data) ? data.data : [],
        total: data.meta?.total || 0,
      };
    } catch (error) {
      console.error('Admin API Error:', error);
      console.log('🔄 API endpoint not available, returning empty data for:', resource);
      
      // Return empty data when API fails
      return {
        data: [],
        total: 0,
      };
    }
  },

  getOne: async ({ resource, id, meta }) => {
    console.log('📊 Admin API: Get One', { resource, id });
    
    try {
      const token = getAdminToken();
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
      
      const response = await fetch(`https://api.nxoland.com/api/${resource}/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...headers,
        },
      });
      const data = await response.json();
      return { data: data.data || null };
    } catch (error) {
      console.error('Admin API Error:', error);
      console.log('🔄 API endpoint not available, returning null for:', resource, id);
      
      // Return null when API fails
      return { data: null };
    }
  },

  create: async ({ resource, variables, meta }) => {
    console.log('📊 Admin API: Create', { resource, variables });
    
    try {
      const token = getAdminToken();
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
      
      const response = await fetch(`https://api.nxoland.com/api/${resource}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...headers,
        },
        body: JSON.stringify(variables),
      });
      const data = await response.json();
      return { data: data.data || null };
    } catch (error) {
      console.error('Admin API Error:', error);
      console.log('🔄 API endpoint not available for create:', resource);
      throw error;
    }
  },

  update: async ({ resource, id, variables, meta }) => {
    console.log('📊 Admin API: Update', { resource, id, variables });
    
    try {
      const token = getAdminToken();
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
      
      const response = await fetch(`https://api.nxoland.com/api/${resource}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...headers,
        },
        body: JSON.stringify(variables),
      });
      const data = await response.json();
      return { data: data.data || null };
    } catch (error) {
      console.error('Admin API Error:', error);
      console.log('🔄 API endpoint not available for update:', resource, id);
      throw error;
    }
  },

  deleteOne: async ({ resource, id, meta }) => {
    console.log('📊 Admin API: Delete', { resource, id });
    
    try {
      const token = getAdminToken();
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
      
      await fetch(`https://api.nxoland.com/api/${resource}/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...headers,
        },
      });
      return { data: { id } as any };
    } catch (error) {
      console.error('Admin API Error:', error);
      console.log('🔄 API endpoint not available for delete:', resource, id);
      throw error;
    }
  },

  getApiUrl: () => {
    return 'https://api.nxoland.com/api';
  },

  custom: async ({ url, method, payload, meta }) => {
    console.log('📊 Admin API: Custom', { url, method, payload });
    
    try {
      const response = await fetch(url, {
        method: method || 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: payload ? JSON.stringify(payload) : undefined,
      });
      const data = await response.json();
      return { data: data.data || null };
    } catch (error) {
      console.error('Admin API Error:', error);
      throw error;
    }
  },
};