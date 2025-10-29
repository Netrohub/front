import { QueryClient } from '@tanstack/react-query';

import { storeSecureToken, getSecureToken, removeSecureToken } from './tokenEncryption';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.nxoland.com/api';

// Types
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  status: 'success' | 'error';
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
  };
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
}

// Auth Types
export interface User {
  id: number;
  username?: string;
  name?: string;
  email?: string;
  email_verified_at?: string | null;
  phone?: string | null;
  phone_verified_at?: string | null;
  avatar?: string | null;
  roles?: string[];
  created_at?: string;
  updated_at?: string;
  // Additional fields that might be returned
  emailVerified?: boolean;
  phoneVerified?: boolean;
  kycStatus?: 'incomplete' | 'pending' | 'verified';
  kycCompletedAt?: string;
}

export interface AuthResponse {
  user: User;
  access_token: string;
  token_type: string;
  expires_in: string;
}

export interface LoginRequest {
  email: string;
  password: string;
  remember?: boolean;
}

export interface RegisterRequest {
  username: string;
  name: string;
  email: string;
  password: string;
  phone?: string;
}

// Product Types
export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discount_price?: number;
  category: string;
  platform?: string;
  game?: string;
  images: string[];
  seller: {
    id: number;
    username?: string;
    name: string;
    avatar?: string;
    rating: number;
    verified: boolean;
  };
  rating: number;
  reviews_count: number;
  featured: boolean;
  status: 'active' | 'inactive' | 'pending' | 'rejected';
  created_at: string;
  updated_at: string;
}

export interface ProductFilters {
  category?: string;
  platform?: string;
  game?: string;
  min_price?: number;
  max_price?: number;
  rating?: number;
  featured?: boolean;
  search?: string;
  sort?: 'price_asc' | 'price_desc' | 'rating' | 'newest' | 'oldest';
  page?: number;
  per_page?: number;
}

// Cart Types
export interface CartItem {
  id: number;
  product: Product;
  quantity: number;
  price: number;
  created_at: string;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  service_fee: number;
  total: number;
  items_count: number;
}

// Order Types
export interface Order {
  id: number;
  order_number: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled' | 'refunded';
  total: number;
  items: OrderItem[];
  buyer: User;
  seller: User;
  payment_method: string;
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: number;
  product: Product;
  quantity: number;
  price: number;
  total: number;
}

// Dispute Types
export interface Dispute {
  id: number;
  order_id: number;
  order: Order;
  type: 'product_not_as_described' | 'product_not_delivered' | 'seller_not_responding' | 'other';
  reason: string;
  description: string;
  status: 'open' | 'in_review' | 'resolved' | 'declined';
  evidence: DisputeEvidence[];
  messages: DisputeMessage[];
  created_by: User;
  assigned_to?: User;
  resolution?: string;
  created_at: string;
  updated_at: string;
}

export interface DisputeEvidence {
  id: number;
  type: 'image' | 'document' | 'text';
  content: string;
  description?: string;
  uploaded_by: User;
  created_at: string;
}

export interface DisputeMessage {
  id: number;
  message: string;
  sender: User;
  is_admin: boolean;
  created_at: string;
}

export interface CreateDisputeRequest {
  order_id: number;
  type: string;
  reason: string;
  description: string;
}


// API Client Class
class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    // Use encrypted token storage
    this.token = getSecureToken('auth_token');
  }

  async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    // Always get fresh token from encrypted storage
    const token = getSecureToken('auth_token');
    
    // Log only in development
    if (import.meta.env.DEV) {
      console.debug('API Request:', {
        url,
        method: options.method || 'GET',
        endpoint,
        hasToken: !!token,
      });
    }
    
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };
    
    const config: RequestInit = {
      headers,
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();
      
      // Log errors only (not success responses)
      if (!response.ok && import.meta.env.DEV) {
        console.warn('API Response Error:', {
          url,
          status: response.status,
          message: data.message,
        });
      }

      if (!response.ok) {
        // Handle 401 Unauthorized - token expired or invalid
        if (response.status === 401) {
          if (import.meta.env.DEV) {
            console.warn('Token expired or invalid, clearing authentication');
          }
          this.clearToken();
          
          // ✅ FIX: Only redirect to login if not on login/register pages
          // This prevents "session expired" message immediately after login on mobile
          if (typeof window !== 'undefined') {
            const currentPath = window.location.pathname;
            const isAuthPage = currentPath === '/login' || currentPath === '/register' || currentPath === '/admin/login';
            
            if (!isAuthPage) {
              // Only redirect if user is not already on an auth page
              window.location.href = '/login';
            }
          }
          
          throw new Error('Session expired. Please login again.');
        }
        // Handle standardized error format
        const errorMessage = data.message || data.error?.message || `HTTP error! status: ${response.status}`;
        const error = new Error(errorMessage);
        (error as any).status = response.status;
        (error as any).errors = data.errors || {};
        throw error;
      }

      return data;
    } catch (error: any) {
      // Network errors
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        // Always log network errors as they're critical
        console.error('Network error:', error.message);
        throw new Error('Network error. Please check your internet connection.');
      }
      
      // Log other errors in development
      if (import.meta.env.DEV) {
        console.error('API request failed:', error);
      }
      throw error;
    }
  }

  // Auth Methods
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const apiResponse = await this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    // Handle wrapped response from backend: { data: { user, access_token }, message, status }
    let response: AuthResponse;
    
    if ('data' in apiResponse && apiResponse.data) {
      // Response is wrapped in { data: { ... } }
      response = apiResponse.data as AuthResponse;
    } else {
      // Response is direct AuthResponse
      response = apiResponse as AuthResponse;
    }
    
    if (response.access_token) {
      this.setToken(response.access_token);
    } else {
      if (import.meta.env.DEV) {
        console.error('No access_token in response', response);
      }
      throw new Error('Invalid login response: no access token');
    }
    
    return response;
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    if (response && response.access_token) {
      this.setToken(response.access_token);
    }
    
    return response;
  }

  async logout(): Promise<void> {
    try {
      await this.request('/auth/logout', { method: 'POST' });
    } finally {
      this.clearToken();
    }
  }

  async getCurrentUser(): Promise<User> {
    const apiResponse = await this.request<User>('/auth/me');
    
    // Handle wrapped response from backend
    if ('data' in apiResponse && apiResponse.data) {
      return apiResponse.data as User;
    }
    return apiResponse as User;
  }

  async getUserByUsername(username: string): Promise<User> {
    const apiResponse = await this.request<User>(`/users/${username}`);
    
    // Handle wrapped response from backend
    if ('data' in apiResponse && apiResponse.data) {
      return apiResponse.data as User;
    }
    return apiResponse as User;
  }

  async getProductsByUser(username: string): Promise<Product[]> {
    const response = await this.request<any>(`/users/${username}/listings`);
    
    // Backend returns { data: Product[], meta: {...} }
    if (response && 'data' in response && Array.isArray(response.data)) {
      return response.data;
    }
    
    // Fallback: if response is already an array
    if (Array.isArray(response)) {
      return response;
    }
    
      if (import.meta.env.DEV) {
        console.warn('Unexpected response format from getProductsByUser:', response);
      }
    return [];
  }

  async getMembers(): Promise<User[]> {
    const response = await this.request<User[]>('/users/members');
    return response;
  }

  async verifyPhone(phone: string, code: string): Promise<void> {
    await this.request('/auth/verify-phone', {
      method: 'POST',
      body: JSON.stringify({ phone, code }),
    });
  }

  async submitKYC(data: FormData): Promise<void> {
    await this.request('/kyc/complete', {
      method: 'POST',
      headers: {}, // Let browser set Content-Type for FormData
      body: data,
    });
  }

  // Product Methods
  async getProducts(filters: ProductFilters = {}): Promise<PaginatedResponse<Product>> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });
    
    const response = await this.request<PaginatedResponse<Product>>(`/products?${params}`);
    return response;
  }

  async getProduct(id: number): Promise<Product> {
    const response = await this.request<Product>(`/products/${id}`);
    return response;
  }

  async getFeaturedProducts(): Promise<Product[]> {
    const response = await this.request<Product[]>('/products?featured=true');
    return response;
  }

  // Cart Methods
  async getCart(): Promise<Cart> {
    const response = await this.request<Cart>('/cart');
    return response;
  }

  async addToCart(productId: number, quantity: number = 1): Promise<void> {
    await this.request('/cart', {
      method: 'POST',
      body: JSON.stringify({ product_id: productId, quantity }),
    });
  }

  async updateCartItem(itemId: number, quantity: number): Promise<void> {
    await this.request(`/cart/${itemId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity }),
    });
  }

  async removeFromCart(itemId: number): Promise<void> {
    await this.request(`/cart/${itemId}`, { method: 'DELETE' });
  }

  async clearCart(): Promise<void> {
    await this.request('/cart', { method: 'DELETE' });
  }

  // Order Methods
  async createOrder(data: { items: Array<{ product_id: number; quantity: number }> }): Promise<Order> {
    const response = await this.request<Order>('/orders', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response;
  }

  async getOrders(page: number = 1): Promise<PaginatedResponse<Order>> {
    const response = await this.request<PaginatedResponse<Order>>(`/orders?page=${page}`);
    return response;
  }

  async getOrder(id: number): Promise<Order> {
    const response = await this.request<Order>(`/orders/${id}`);
    return response;
  }

  // Wishlist Methods
  async getWishlist(): Promise<Product[]> {
    const response = await this.request<Product[]>('/wishlist');
    return response;
  }

  async addToWishlist(productId: number): Promise<void> {
    await this.request(`/wishlist/${productId}`, {
      method: 'POST',
    });
  }

  async removeFromWishlist(productId: number): Promise<void> {
    await this.request(`/wishlist/${productId}`, { method: 'DELETE' });
  }

  // Dispute Methods
  async getDisputes(): Promise<Dispute[]> {
    const response = await this.request<Dispute[]>('/disputes');
    return response;
  }

  async getAdminDisputes(): Promise<Dispute[]> {
    const response = await this.request<Dispute[]>('/disputes/admin/all');
    return response;
  }

  async getDispute(id: number): Promise<Dispute> {
    const response = await this.request<Dispute>(`/disputes/${id}`);
    return response;
  }

  async createDispute(data: CreateDisputeRequest): Promise<Dispute> {
    const response = await this.request<Dispute>('/disputes', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response;
  }

  async addDisputeMessage(disputeId: number, message: string): Promise<DisputeMessage> {
    const response = await this.request<DisputeMessage>(`/disputes/${disputeId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
    return response;
  }

  async uploadDisputeEvidence(disputeId: number, evidence: FormData): Promise<DisputeEvidence> {
    const response = await this.request<DisputeEvidence>(`/disputes/${disputeId}/evidence`, {
      method: 'POST',
      headers: {}, // Let browser set Content-Type for FormData
      body: evidence,
    });
    return response;
  }

  // Admin Dispute Methods

  async updateDisputeStatus(disputeId: number, status: string, resolution?: string): Promise<Dispute> {
    const response = await this.request<Dispute>(`/admin/disputes/${disputeId}`, {
      method: 'PUT',
      body: JSON.stringify({ status, resolution }),
    });
    return response;
  }

  // ✅ NEW: Notification Methods
  async getNotifications(unreadOnly: boolean = false): Promise<any[]> {
    const params = unreadOnly ? '?unread=true' : '';
    const response = await this.request<any[]>(`/notifications${params}`);
    return response;
  }

  async getUnreadNotificationCount(): Promise<number> {
    const response = await this.request<{ count: number }>('/notifications/unread-count');
    return response.count;
  }

  async markNotificationAsRead(notificationId: number): Promise<void> {
    await this.request(`/notifications/${notificationId}/read`, {
      method: 'POST',
    });
  }

  async markAllNotificationsAsRead(): Promise<void> {
    await this.request('/notifications/read-all', {
      method: 'POST',
    });
  }

  async deleteNotification(notificationId: number): Promise<void> {
    await this.request(`/notifications/${notificationId}`, {
      method: 'DELETE',
    });
  }

  // Utility Methods
  setToken(token: string): void {
    this.token = token;
    // Store token with encryption
    storeSecureToken('auth_token', token);
  }

  clearToken(): void {
    this.token = null;
    // Remove encrypted token
    removeSecureToken('auth_token');
    // Also remove legacy plain token if exists
    localStorage.removeItem('auth_token');
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  // KYC Methods
  async updateKYCStatus(step: 'email' | 'phone' | 'identity', verified: boolean): Promise<void> {
    await this.request(`/kyc/${step}`, {
      method: 'POST',
      body: JSON.stringify({ verified }),
    });
  }

  async completeKYC(): Promise<void> {
    await this.request('/kyc/complete', {
      method: 'POST',
    });
  }
}

// Create and export API client instance
export const apiClient = new ApiClient(API_BASE_URL);

// React Query keys for consistent caching - User scope
export const queryKeys = {
  // Auth
  auth: ['auth'] as const,
  currentUser: () => [...queryKeys.auth, 'me'] as const,
  
  // Products (public)
  products: ['products'] as const,
  product: (id: number) => [...queryKeys.products, id] as const,
  featuredProducts: () => [...queryKeys.products, 'featured'] as const,
  
  // User-specific data
  user: {
    orders: ['user:orders'] as const,
    order: (id: number) => ['user:orders', id] as const,
    wallet: ['user:wallet'] as const,
    kyc: ['user:kyc'] as const,
    wishlist: ['user:wishlist'] as const,
    cart: ['user:cart'] as const,
    notifications: ['user:notifications'] as const,
    billing: ['user:billing'] as const,
  },
  
  // Disputes
  disputes: ['disputes'] as const,
  dispute: (id: number) => [...queryKeys.disputes, id] as const,
  adminDisputes: () => [...queryKeys.disputes, 'admin'] as const,
  
  // Members (public)
  members: ['members'] as const,
  
  // Users (public)
  users: ['users'] as const,
  userByUsername: (username: string) => [...queryKeys.users, username] as const,
};