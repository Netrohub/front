import { QueryClient, useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.nxoland.com/api';

// Types
interface ApiResponse<T = any> {
  data: T;
  message?: string;
  status: 'success' | 'error';
  errors?: Record<string, string[]>;
}

// Seller-specific Types
export interface SellerDashboard {
  stats: {
    totalRevenue: number;
    totalOrders: number;
    activeListings: number;
    pendingPayouts: number;
  };
  recentOrders: SellerOrder[];
  recentPayouts: SellerPayout[];
}

export interface SellerOrder {
  id: number;
  buyer: {
    id: number;
    name: string;
    email: string;
  };
  product: {
    id: number;
    title: string;
    price: number;
  };
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  total: number;
  created_at: string;
}

export interface SellerPayout {
  id: number;
  amount: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  method: string;
  reference: string;
  created_at: string;
  processed_at?: string;
}

export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discount_price?: number;
  category: string;
  subcategory: string;
  platform?: string;
  level?: string;
  type?: string;
  images: string[];
  tags: string[];
  status: 'active' | 'inactive' | 'pending' | 'sold';
  seller_id: number;
  created_at: string;
  updated_at: string;
}

// Seller API Client Class
class SellerApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    // Always get fresh token from localStorage
    const token = localStorage.getItem('auth_token');
    
    console.log('🏪 Seller API Request:', {
      url,
      method: options.method || 'GET',
      endpoint,
      hasToken: !!token
    });
    
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ Seller API Error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData
      });
      throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('✅ Seller API Success:', { endpoint, data });
    
    return data;
  }

  // Seller Dashboard
  async getDashboard(): Promise<SellerDashboard> {
    try {
      const response = await this.request<SellerDashboard>('/seller/dashboard');
      // Ensure we always return a valid object structure
      if (!response || !response.data) {
        return {
          stats: {
            totalRevenue: 0,
            totalOrders: 0,
            activeListings: 0,
            pendingPayouts: 0,
          },
          recentOrders: [],
          recentPayouts: [],
        };
      }
      return response.data;
    } catch (error) {
      console.error('Error fetching seller dashboard:', error);
      // Return default structure on error
      return {
        stats: {
          totalRevenue: 0,
          totalOrders: 0,
          activeListings: 0,
          pendingPayouts: 0,
        },
        recentOrders: [],
        recentPayouts: [],
      };
    }
  }

  // Seller Products
  async getProducts(options?: { limit?: number }): Promise<Product[]> {
    try {
      const params = options?.limit ? `?limit=${options.limit}` : '';
      const response = await this.request<Product[]>(`/seller/products${params}`);
      // Ensure we always return an array
      return Array.isArray(response?.data) ? response.data : [];
    } catch (error) {
      console.error('Error fetching seller products:', error);
      return [];
    }
  }

  async createProduct(data: FormData): Promise<Product> {
    const response = await this.request<Product>('/seller/products', {
      method: 'POST',
      headers: {}, // Let browser set Content-Type for FormData
      body: data,
    });
    return response.data;
  }

  async updateProduct(id: number, data: FormData): Promise<Product> {
    const response = await this.request<Product>(`/seller/products/${id}`, {
      method: 'PUT',
      headers: {}, // Let browser set Content-Type for FormData
      body: data,
    });
    return response.data;
  }

  async deleteProduct(id: number): Promise<void> {
    await this.request(`/seller/products/${id}`, { method: 'DELETE' });
  }

  // Seller Orders
  async getOrders(options?: { limit?: number }): Promise<SellerOrder[]> {
    try {
      const params = options?.limit ? `?limit=${options.limit}` : '';
      const response = await this.request<SellerOrder[]>(`/seller/orders${params}`);
      // Ensure we always return an array
      return Array.isArray(response?.data) ? response.data : [];
    } catch (error) {
      console.error('Error fetching seller orders:', error);
      return [];
    }
  }

  // Seller Payouts
  async getPayouts(): Promise<SellerPayout[]> {
    try {
      const response = await this.request<SellerPayout[]>('/seller/payouts');
      // Ensure we always return an array
      return Array.isArray(response?.data) ? response.data : [];
    } catch (error) {
      console.error('Error fetching seller payouts:', error);
      return [];
    }
  }

  // Seller Notifications
  async getNotifications(): Promise<any[]> {
    try {
      const response = await this.request<any[]>('/seller/notifications');
      // Ensure we always return an array
      return Array.isArray(response?.data) ? response.data : [];
    } catch (error) {
      console.error('Error fetching seller notifications:', error);
      return [];
    }
  }

  // Product Listing
  async listGamingAccount(data: FormData): Promise<Product> {
    const response = await this.request<Product>('/seller/listing/gaming-account', {
      method: 'POST',
      headers: {},
      body: data,
    });
    return response.data;
  }

  async listSocialAccount(data: FormData): Promise<Product> {
    const response = await this.request<Product>('/seller/listing/social-account', {
      method: 'POST',
      headers: {},
      body: data,
    });
    return response.data;
  }
}

// Create and export seller API client instance
export const sellerApiClient = new SellerApiClient(API_BASE_URL);

// Seller Query Keys - standardized for React Query
export const sellerQueryKeys = {
  all: ['seller'] as const,
  dashboard: () => [...sellerQueryKeys.all, 'dashboard'] as const,
  products: () => [...sellerQueryKeys.all, 'products'] as const,
  orders: () => [...sellerQueryKeys.all, 'orders'] as const,
  payouts: () => [...sellerQueryKeys.all, 'payouts'] as const,
  notifications: () => [...sellerQueryKeys.all, 'notifications'] as const,
} as const;

// React Query Hooks for Seller API

// Query Hooks
export const useSellerDashboard = () => {
  return useQuery({
    queryKey: sellerQueryKeys.dashboard(),
    queryFn: () => sellerApiClient.getDashboard(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useSellerProducts = () => {
  return useQuery({
    queryKey: sellerQueryKeys.products(),
    queryFn: () => sellerApiClient.getProducts(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useSellerOrders = () => {
  return useQuery({
    queryKey: sellerQueryKeys.orders(),
    queryFn: () => sellerApiClient.getOrders(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useSellerPayouts = () => {
  return useQuery({
    queryKey: sellerQueryKeys.payouts(),
    queryFn: () => sellerApiClient.getPayouts(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useSellerNotifications = () => {
  return useQuery({
    queryKey: sellerQueryKeys.notifications(),
    queryFn: () => sellerApiClient.getNotifications(),
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

// Mutation Hooks
export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: FormData) => sellerApiClient.createProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sellerQueryKeys.products() });
      toast.success('Product created successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create product');
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: FormData }) => sellerApiClient.updateProduct(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sellerQueryKeys.products() });
      toast.success('Product updated successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update product');
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => sellerApiClient.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sellerQueryKeys.products() });
      toast.success('Product deleted successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete product');
    },
  });
};

// Export query client for React Query
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

export default sellerApiClient;
