/**
 * useGTM Hook
 * 
 * Convenient React hook for accessing GTM analytics functions
 * with proper TypeScript typing and React best practices
 */

import { useCallback } from 'react';
import gtmAnalytics from '@/lib/gtm';

export const useGTM = () => {
  // Wrap analytics functions in useCallback for stable references
  const trackLogin = useCallback((method: string = 'email', userId?: string) => {
    gtmAnalytics.login(method, userId);
  }, []);

  const trackSignUp = useCallback((method: string = 'email', userId?: string) => {
    gtmAnalytics.signUp(method, userId);
  }, []);

  const trackLogout = useCallback(() => {
    gtmAnalytics.logout();
  }, []);

  const trackViewProduct = useCallback((product: {
    id: number | string;
    name: string;
    category: string;
    price: number;
    seller?: string;
  }) => {
    gtmAnalytics.viewProduct(product);
  }, []);

  const trackAddToCart = useCallback((product: {
    id: number | string;
    name: string;
    category: string;
    price: number;
    quantity?: number;
  }) => {
    gtmAnalytics.addToCart(product);
  }, []);

  const trackRemoveFromCart = useCallback((product: {
    id: number | string;
    name: string;
    price: number;
    quantity?: number;
  }) => {
    gtmAnalytics.removeFromCart(product);
  }, []);

  const trackBeginCheckout = useCallback((cart: {
    total: number;
    items: Array<{
      id: number | string;
      name: string;
      price: number;
      quantity: number;
    }>;
  }) => {
    gtmAnalytics.beginCheckout(cart);
  }, []);

  const trackPurchase = useCallback((order: {
    order_id: string;
    total: number;
    tax?: number;
    shipping?: number;
    items: Array<{
      id: number | string;
      name: string;
      category?: string;
      price: number;
      quantity: number;
    }>;
  }) => {
    gtmAnalytics.purchase(order);
  }, []);

  const trackAddToWishlist = useCallback((product: {
    id: number | string;
    name: string;
    category?: string;
    price: number;
  }) => {
    gtmAnalytics.addToWishlist(product);
  }, []);

  const trackRemoveFromWishlist = useCallback((productId: number | string) => {
    gtmAnalytics.removeFromWishlist(productId);
  }, []);

  const trackSearch = useCallback((searchTerm: string, resultsCount?: number) => {
    gtmAnalytics.search(searchTerm, resultsCount);
  }, []);

  const trackListProduct = useCallback((product: {
    category: string;
    type: string;
    price: number;
  }) => {
    gtmAnalytics.listProduct(product);
  }, []);

  const trackBecomeSellerStart = useCallback(() => {
    gtmAnalytics.becomeSellerStart();
  }, []);

  const trackBecomeSellerComplete = useCallback(() => {
    gtmAnalytics.becomeSellerComplete();
  }, []);

  const trackKYCStart = useCallback(() => {
    gtmAnalytics.kycStart();
  }, []);

  const trackKYCSubmit = useCallback((verificationType: string) => {
    gtmAnalytics.kycSubmit(verificationType);
  }, []);

  const trackKYCComplete = useCallback(() => {
    gtmAnalytics.kycComplete();
  }, []);

  const trackShareProduct = useCallback((productId: number | string, method: string) => {
    gtmAnalytics.shareProduct(productId, method);
  }, []);

  const trackCreateDispute = useCallback((orderId: string, disputeType: string) => {
    gtmAnalytics.createDispute(orderId, disputeType);
  }, []);

  const trackCustomEvent = useCallback((eventName: string, params?: Record<string, any>) => {
    gtmAnalytics.customEvent(eventName, params);
  }, []);

  return {
    // Authentication
    trackLogin,
    trackSignUp,
    trackLogout,
    
    // Products
    trackViewProduct,
    trackAddToCart,
    trackRemoveFromCart,
    
    // Checkout
    trackBeginCheckout,
    trackPurchase,
    
    // Wishlist
    trackAddToWishlist,
    trackRemoveFromWishlist,
    
    // Search
    trackSearch,
    
    // Seller
    trackListProduct,
    trackBecomeSellerStart,
    trackBecomeSellerComplete,
    
    // KYC
    trackKYCStart,
    trackKYCSubmit,
    trackKYCComplete,
    
    // Social
    trackShareProduct,
    
    // Disputes
    trackCreateDispute,
    
    // Custom
    trackCustomEvent,
    
    // Direct access to analytics object
    gtm: gtmAnalytics,
  };
};

export default useGTM;

