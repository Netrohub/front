import { DataProvider } from '@refinedev/core';

// API-based data provider for admin panel
// This will be replaced with real API endpoints when backend is ready

export const dataProvider: DataProvider = {
  getList: async ({ resource, pagination, sorters, filters, meta }) => {
    console.log('📊 Admin API: Get List', { resource, pagination, sorters, filters });
    
    // TODO: Replace with real API calls
    const data = [];
    const total = 0;
    
    return {
      data,
      total,
    };
  },

  getOne: async ({ resource, id, meta }) => {
    console.log('📊 Admin API: Get One', { resource, id });
    
    // TODO: Replace with real API calls
    const data = null;
    
    return { data };
  },

  create: async ({ resource, variables, meta }) => {
    console.log('📊 Admin API: Create', { resource, variables });
    
    // TODO: Replace with real API calls
    const data = { id: Date.now(), ...variables };
    
    return { data };
  },

  update: async ({ resource, id, variables, meta }) => {
    console.log('📊 Admin API: Update', { resource, id, variables });
    
    // TODO: Replace with real API calls
    const data = { id, ...variables };
    
    return { data };
  },

  deleteOne: async ({ resource, id, meta }) => {
    console.log('📊 Admin API: Delete', { resource, id });
    
    // TODO: Replace with real API calls
    const data = { id };
    
    return { data };
  },

  getApiUrl: () => {
    return 'https://api.nxoland.com/api';
  },

  custom: async ({ url, method, payload, meta }) => {
    console.log('📊 Admin API: Custom', { url, method, payload });
    
    // TODO: Replace with real API calls
    const data = { success: true };
    
    return { data };
  },
};