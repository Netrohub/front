import { QueryClient } from '@tanstack/react-query';

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
  password_confirmation: string;
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

// Seller Types
export interface SellerDashboard {
  total_revenue: number;
  total_orders: number;
  total_products: number;
  average_rating: number;
  pending_orders: number;
  active_products: number;
  monthly_revenue: Array<{
    month: string;
    revenue: number;
  }>;
  recent_orders: Order[];
  top_products: Product[];
}

export interface SellerOrder {
  id: number;
  order_number: string;
  status: string;
  total: number;
  buyer: User;
  items: OrderItem[];
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

// API Client Class
class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.token = localStorage.getItem('auth_token');
  }

  async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    // Always get fresh token from localStorage
    const token = localStorage.getItem('auth_token');
    
    console.log('🌐 API Request:', {
      url,
      method: options.method || 'GET',
      endpoint,
      baseURL: this.baseURL,
      hasToken: !!token,
      tokenLength: token ? token.length : 0
    });
    
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };
    
    console.log('📋 Request headers:', {
      'Content-Type': headers['Content-Type'],
      'Accept': headers['Accept'],
      'Authorization': headers['Authorization'] ? `${headers['Authorization'].substring(0, 30)}...` : 'none'
    });
    
    const config: RequestInit = {
      headers,
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();
      
      console.log('📥 API Response:', {
        url,
        status: response.status,
        ok: response.ok,
        data: data
      });

      if (!response.ok) {
        // Handle standardized error format
        const errorMessage = data.message || data.error?.message || `HTTP error! status: ${response.status}`;
        const error = new Error(errorMessage);
        (error as any).status = response.status;
        (error as any).errors = data.errors || {};
        throw error;
      }

      return data;
    } catch (error) {
      console.error('❌ API request failed:', error);
      throw error;
    }
  }

  // Auth Methods
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const apiResponse = await this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    console.log('🔍 API Client: Full backend response:', apiResponse);
    
    // Handle wrapped response from backend: { data: { user, access_token }, message, status }
    let response: AuthResponse;
    
    if ('data' in apiResponse && apiResponse.data) {
      // Response is wrapped in { data: { ... } }
      response = apiResponse.data as AuthResponse;
    } else {
      // Response is direct
      response = apiResponse as any;
    }
    
    console.log('🔍 API Client: Extracted auth response:', response);
    
    if (response && response.access_token) {
      this.setToken(response.access_token);
      console.log('✅ API Client: Token saved to localStorage');
    } else {
      console.error('❌ API Client: No access_token in response', response);
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
    
    // Handle wrapped response: { data: { ... }, message, status }
    if ('data' in apiResponse && apiResponse.data) {
      return apiResponse.data;
    }
    return apiResponse as any;
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

  // Seller Methods
  async getSellerDashboard(): Promise<SellerDashboard> {
    const response = await this.request<SellerDashboard>('/seller/dashboard');
    return response;
  }

  async getSellerProducts(): Promise<Product[]> {
    const response = await this.request<Product[]>('/seller/products');
    return response;
  }

  async createProduct(data: FormData): Promise<Product> {
    const response = await this.request<Product>('/seller/products', {
      method: 'POST',
      headers: {}, // Let browser set Content-Type for FormData
      body: data,
    });
    return response;
  }

  async updateProduct(id: number, data: FormData): Promise<Product> {
    const response = await this.request<Product>(`/seller/products/${id}`, {
      method: 'PUT',
      headers: {}, // Let browser set Content-Type for FormData
      body: data,
    });
    return response;
  }

  async deleteProduct(id: number): Promise<void> {
    await this.request(`/seller/products/${id}`, { method: 'DELETE' });
  }

  async getSellerOrders(): Promise<SellerOrder[]> {
    const response = await this.request<SellerOrder[]>('/seller/orders');
    return response;
  }

  async getSellerPayouts(): Promise<SellerPayout[]> {
    const response = await this.request<SellerPayout[]>('/seller/payouts');
    return response;
  }

  async getSellerNotifications(): Promise<any[]> {
    const response = await this.request<any[]>('/seller/notifications');
    return response;
  }

  async listGamingAccount(data: FormData): Promise<Product> {
    const response = await this.request<Product>('/seller/listing/gaming-account', {
      method: 'POST',
      headers: {}, // Let browser set Content-Type for FormData
      body: data,
    });
    return response;
  }

  async listSocialAccount(data: FormData): Promise<Product> {
    const response = await this.request<Product>('/seller/listing/social-account', {
      method: 'POST',
      headers: {}, // Let browser set Content-Type for FormData
      body: data,
    });
    return response;
  }


  // Utility Methods
  setToken(token: string): void {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }

  clearToken(): void {
    this.token = null;
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

// React Query keys for consistent caching
export const queryKeys = {
  // Auth
  auth: ['auth'] as const,
  currentUser: () => [...queryKeys.auth, 'me'] as const,
  
  // Products
  products: ['products'] as const,
  product: (id: number) => [...queryKeys.products, id] as const,
  featuredProducts: () => [...queryKeys.products, 'featured'] as const,
  
  // Cart
  cart: ['cart'] as const,
  
  // Orders
  orders: ['orders'] as const,
  order: (id: number) => [...queryKeys.orders, id] as const,
  
  // Wishlist
  wishlist: ['wishlist'] as const,
  
  // Disputes
  disputes: ['disputes'] as const,
  dispute: (id: number) => [...queryKeys.disputes, id] as const,
  adminDisputes: () => [...queryKeys.disputes, 'admin'] as const,
  
  // Seller
  seller: ['seller'] as const,
  sellerDashboard: () => [...queryKeys.seller, 'dashboard'] as const,
  sellerProducts: () => [...queryKeys.seller, 'products'] as const,
  sellerOrders: () => [...queryKeys.seller, 'orders'] as const,
  sellerPayouts: () => [...queryKeys.seller, 'payouts'] as const,
  sellerNotifications: () => [...queryKeys.seller, 'notifications'] as const,
  
  // Members
  members: ['members'] as const,
};