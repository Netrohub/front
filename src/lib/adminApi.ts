import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.nxoland.com';

export const adminApiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor to add CSRF token
adminApiClient.interceptors.request.use(async (config) => {
  // Get CSRF token for non-GET requests
  if (config.method !== 'get') {
    try {
      await axios.get(`${API_URL}/sanctum/csrf-cookie`, {
        withCredentials: true,
      });
    } catch (error) {
      console.warn('Failed to get CSRF token:', error);
    }
  }
  return config;
});

// Response interceptor for error handling
adminApiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default adminApiClient;
