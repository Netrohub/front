import { DataProvider } from '@refinedev/core';
import { apiClient } from '@/lib/api';

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
      
      const response = await apiClient.request(endpoint);
      return {
        data: response.data || [],
        total: response.meta?.total || 0,
      };
    } catch (error) {
      console.error('Admin API Error:', error);
      return {
        data: [],
        total: 0,
      };
    }
  },

  getOne: async ({ resource, id, meta }) => {
    console.log('📊 Admin API: Get One', { resource, id });
    
    try {
      const response = await apiClient.request(`/${resource}/${id}`);
      return { data: response.data };
    } catch (error) {
      console.error('Admin API Error:', error);
      return { data: null };
    }
  },

  create: async ({ resource, variables, meta }) => {
    console.log('📊 Admin API: Create', { resource, variables });
    
    try {
      const response = await apiClient.request(`/${resource}`, {
        method: 'POST',
        body: JSON.stringify(variables),
      });
      return { data: response.data };
    } catch (error) {
      console.error('Admin API Error:', error);
      throw error;
    }
  },

  update: async ({ resource, id, variables, meta }) => {
    console.log('📊 Admin API: Update', { resource, id, variables });
    
    try {
      const response = await apiClient.request(`/${resource}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(variables),
      });
      return { data: response.data };
    } catch (error) {
      console.error('Admin API Error:', error);
      throw error;
    }
  },

  deleteOne: async ({ resource, id, meta }) => {
    console.log('📊 Admin API: Delete', { resource, id });
    
    try {
      await apiClient.request(`/${resource}/${id}`, {
        method: 'DELETE',
      });
      return { data: { id } };
    } catch (error) {
      console.error('Admin API Error:', error);
      throw error;
    }
  },

  getApiUrl: () => {
    return 'https://api.nxoland.com/api';
  },

  custom: async ({ url, method, payload, meta }) => {
    console.log('📊 Admin API: Custom', { url, method, payload });
    
    try {
      const response = await apiClient.request(url, {
        method: method || 'GET',
        body: payload ? JSON.stringify(payload) : undefined,
      });
      return { data: response.data };
    } catch (error) {
      console.error('Admin API Error:', error);
      throw error;
    }
  },
};