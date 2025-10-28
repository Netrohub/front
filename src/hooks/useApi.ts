import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient, queryKeys, type Product, type ProductFilters, type Cart, type Order, type Dispute, type CreateDisputeRequest, type User } from '@/lib/api';
import { toast } from 'sonner';

// Auth Hooks
export const useCurrentUser = () => {
  return useQuery({
    queryKey: queryKeys.currentUser(),
    queryFn: () => apiClient.getCurrentUser(),
    enabled: apiClient.isAuthenticated(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useMembers = () => {
  return useQuery({
    queryKey: ['members'],
    queryFn: () => apiClient.getMembers(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useLogin = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ email, password, remember }: { email: string; password: string; remember?: boolean }) =>
      apiClient.login({ email, password, remember }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.currentUser() });
      toast.success('Login successful!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Login failed');
    },
  });
};

export const useRegister = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ username, name, email, password, passwordConfirmation, phone }: {
      username: string;
      name: string;
      email: string;
      password: string;
      passwordConfirmation: string;
      phone?: string;
    }) => apiClient.register({ username, name, email, password, phone }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.currentUser() });
      toast.success('Registration successful!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Registration failed');
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: () => apiClient.logout(),
    onSuccess: () => {
      queryClient.clear();
      toast.success('Logged out successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Logout failed');
    },
  });
};

// Product Hooks
export const useProducts = (filters: ProductFilters = {}) => {
  return useQuery({
    queryKey: [...queryKeys.products, filters],
    queryFn: () => apiClient.getProducts(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useProduct = (id: number) => {
  return useQuery({
    queryKey: queryKeys.product(id),
    queryFn: () => apiClient.getProduct(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useFeaturedProducts = () => {
  return useQuery({
    queryKey: queryKeys.featuredProducts(),
    queryFn: () => apiClient.getFeaturedProducts(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Cart Hooks
export const useCart = () => {
  return useQuery({
    queryKey: queryKeys.user.cart,
    queryFn: () => apiClient.getCart(),
    staleTime: 30 * 1000, // 30 seconds
  });
};

export const useAddToCart = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ productId, quantity }: { productId: number; quantity?: number }) =>
      apiClient.addToCart(productId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.user.cart });
      toast.success('Added to cart!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to add to cart');
    },
  });
};

export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: number; quantity: number }) =>
      apiClient.updateCartItem(itemId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.user.cart });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update cart item');
    },
  });
};

export const useRemoveFromCart = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (itemId: number) => apiClient.removeFromCart(itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.user.cart });
      toast.success('Removed from cart');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to remove from cart');
    },
  });
};

export const useClearCart = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: () => apiClient.clearCart(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.user.cart });
      toast.success('Cart cleared');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to clear cart');
    },
  });
};

// Order Hooks
export const useOrders = (page = 1) => {
  return useQuery({
    queryKey: [...queryKeys.user.orders, page] as const,
    queryFn: () => apiClient.getOrders(page),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useOrder = (id: number) => {
  return useQuery({
    queryKey: queryKeys.user.order(id),
    queryFn: () => apiClient.getOrder(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: { items: Array<{ product_id: number; quantity: number }> }) =>
      apiClient.createOrder(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.user.orders });
      queryClient.invalidateQueries({ queryKey: queryKeys.user.cart });
      toast.success('Order created successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create order');
    },
  });
};

// Wishlist Hooks
export const useWishlist = () => {
  return useQuery({
    queryKey: queryKeys.user.wishlist,
    queryFn: () => apiClient.getWishlist(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useAddToWishlist = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (productId: number) => apiClient.addToWishlist(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.user.wishlist });
      toast.success('Added to wishlist!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to add to wishlist');
    },
  });
};

export const useRemoveFromWishlist = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (productId: number) => apiClient.removeFromWishlist(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.user.wishlist });
      toast.success('Removed from wishlist');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to remove from wishlist');
    },
  });
};

// Dispute Hooks
export const useDisputes = () => {
  return useQuery({
    queryKey: queryKeys.disputes,
    queryFn: () => apiClient.getDisputes(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useDispute = (id: number) => {
  return useQuery({
    queryKey: queryKeys.dispute(id),
    queryFn: () => apiClient.getDispute(id),
    enabled: !!id,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

export const useCreateDispute = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateDisputeRequest) => apiClient.createDispute(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.disputes });
      toast.success('Dispute created successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create dispute');
    },
  });
};

export const useAddDisputeMessage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ disputeId, message }: { disputeId: number; message: string }) =>
      apiClient.addDisputeMessage(disputeId, message),
    onSuccess: (_, { disputeId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.dispute(disputeId) });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to send message');
    },
  });
};

export const useUploadDisputeEvidence = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ disputeId, evidence }: { disputeId: number; evidence: FormData }) =>
      apiClient.uploadDisputeEvidence(disputeId, evidence),
    onSuccess: (_, { disputeId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.dispute(disputeId) });
      toast.success('Evidence uploaded successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to upload evidence');
    },
  });
};

// Admin Dispute Hooks
export const useAdminDisputes = () => {
  return useQuery({
    queryKey: queryKeys.adminDisputes(),
    queryFn: () => apiClient.getAdminDisputes(),
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

export const useUpdateDisputeStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ disputeId, status, resolution }: {
      disputeId: number;
      status: string;
      resolution?: string;
    }) => apiClient.updateDisputeStatus(disputeId, status, resolution),
    onSuccess: (_, { disputeId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.dispute(disputeId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.adminDisputes() });
      toast.success('Dispute status updated!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update dispute status');
    },
  });
};

// Note: Seller-related hooks have been moved to sellerApi.ts
// This file now only contains user (buyer) scoped hooks

