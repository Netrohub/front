import { useQueryClient } from '@tanstack/react-query';
import { apiClient, queryKeys } from '@/lib/api';

/**
 * Hook for prefetching data to improve perceived performance
 */
export const usePrefetch = () => {
  const queryClient = useQueryClient();

  /**
   * Prefetch product details when hovering over a product card
   */
  const prefetchProduct = (productId: number) => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.product(productId),
      queryFn: () => apiClient.getProduct(productId),
      staleTime: 5 * 60 * 1000, // 5 minutes
    });
  };

  /**
   * Prefetch user cart data
   */
  const prefetchCart = () => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.cart,
      queryFn: () => apiClient.getCart(),
      staleTime: 30 * 1000, // 30 seconds
    });
  };

  /**
   * Prefetch seller dashboard data
   */
  const prefetchSellerDashboard = () => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.sellerDashboard(),
      queryFn: () => apiClient.getSellerDashboard(),
      staleTime: 2 * 60 * 1000, // 2 minutes
    });
  };

  /**
   * Prefetch user orders
   */
  const prefetchOrders = (page = 1) => {
    queryClient.prefetchQuery({
      queryKey: [...queryKeys.orders, page],
      queryFn: () => apiClient.getOrders(page),
      staleTime: 2 * 60 * 1000, // 2 minutes
    });
  };

  /**
   * Prefetch disputes
   */
  const prefetchDisputes = () => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.disputes,
      queryFn: () => apiClient.getDisputes(),
      staleTime: 2 * 60 * 1000, // 2 minutes
    });
  };

  return {
    prefetchProduct,
    prefetchCart,
    prefetchSellerDashboard,
    prefetchOrders,
    prefetchDisputes,
  };
};

export default usePrefetch;
