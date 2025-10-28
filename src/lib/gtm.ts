/**
 * Google Tag Manager (GTM) Integration
 * 
 * This module provides GTM integration with GA4 support.
 * All analytics events are pushed to GTM's dataLayer for flexible tag management.
 * 
 * Features:
 * - Non-blocking script loading
 * - Environment-based enabling (disabled in dev)
 * - Device type tracking (mobile/desktop)
 * - Privacy-compliant (cookie consent friendly)
 * - Type-safe event tracking
 */

// Extend Window interface for GTM dataLayer
declare global {
  interface Window {
    dataLayer: any[];
    gtag?: (...args: any[]) => void;
  }
}

// Environment configuration
const GTM_ID = import.meta.env.VITE_GTM_ID;
const IS_PRODUCTION = import.meta.env.PROD;
const IS_ENABLED = GTM_ID && IS_PRODUCTION;

/**
 * Device type detection
 */
export const getDeviceType = (): 'mobile' | 'tablet' | 'desktop' => {
  const width = window.innerWidth;
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
};

/**
 * Get user agent category
 */
export const getUserAgent = (): string => {
  const ua = navigator.userAgent.toLowerCase();
  if (/mobile|android|iphone|ipad|ipod/.test(ua)) return 'mobile';
  if (/tablet/.test(ua)) return 'tablet';
  return 'desktop';
};

/**
 * Initialize GTM
 * Injects GTM script and initializes dataLayer
 */
export const initGTM = (): void => {
  if (!IS_ENABLED) {
    console.log('GTM disabled in development mode');
    return;
  }

  // Initialize dataLayer
  window.dataLayer = window.dataLayer || [];
  
  // Push initial configuration
  window.dataLayer.push({
    'gtm.start': new Date().getTime(),
    event: 'gtm.js',
    deviceType: getDeviceType(),
    userAgent: getUserAgent(),
  });

  // Inject GTM script (non-blocking)
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`;
  document.head.appendChild(script);

  // Inject noscript iframe for fallback
  const noscript = document.createElement('noscript');
  const iframe = document.createElement('iframe');
  iframe.src = `https://www.googletagmanager.com/ns.html?id=${GTM_ID}`;
  iframe.height = '0';
  iframe.width = '0';
  iframe.style.display = 'none';
  iframe.style.visibility = 'hidden';
  noscript.appendChild(iframe);
  document.body.insertBefore(noscript, document.body.firstChild);

  console.log('GTM initialized:', GTM_ID);
};

/**
 * Push event to dataLayer
 */
export const pushToDataLayer = (data: Record<string, any>): void => {
  if (!IS_ENABLED) {
    console.log('GTM Event (dev):', data);
    return;
  }

  window.dataLayer = window.dataLayer || [];
  
  // Add device context to every event
  window.dataLayer.push({
    ...data,
    deviceType: getDeviceType(),
    timestamp: new Date().toISOString(),
  });
};

/**
 * Track page view
 * Called automatically on route changes
 */
export const trackPageView = (url: string, title?: string): void => {
  pushToDataLayer({
    event: 'page_view',
    page_path: url,
    page_title: title || document.title,
    page_location: window.location.href,
  });
};

/**
 * Track custom event
 */
export const trackEvent = (
  eventName: string,
  eventParams?: Record<string, any>
): void => {
  pushToDataLayer({
    event: eventName,
    ...eventParams,
  });
};

/**
 * E-commerce and user action tracking
 */
export const gtmAnalytics = {
  // Authentication events
  login: (method: string = 'email', userId?: string) => {
    pushToDataLayer({
      event: 'login',
      method,
      user_id: userId,
    });
  },

  signUp: (method: string = 'email', userId?: string) => {
    pushToDataLayer({
      event: 'sign_up',
      method,
      user_id: userId,
    });
  },

  logout: () => {
    pushToDataLayer({
      event: 'logout',
    });
  },

  // Product events
  viewProduct: (product: {
    id: number | string;
    name: string;
    category: string;
    price: number;
    seller?: string;
  }) => {
    pushToDataLayer({
      event: 'view_item',
      ecommerce: {
        currency: 'USD',
        value: product.price,
        items: [
          {
            item_id: String(product.id),
            item_name: product.name,
            item_category: product.category,
            price: product.price,
            item_brand: product.seller || 'Unknown',
          },
        ],
      },
    });
  },

  viewProductList: (
    products: Array<{
      id: number | string;
      name: string;
      category: string;
      price: number;
    }>,
    listName?: string
  ) => {
    pushToDataLayer({
      event: 'view_item_list',
      ecommerce: {
        item_list_name: listName || 'Product List',
        items: products.map((product, index) => ({
          item_id: String(product.id),
          item_name: product.name,
          item_category: product.category,
          price: product.price,
          index,
        })),
      },
    });
  },

  selectProduct: (product: {
    id: number | string;
    name: string;
    category: string;
    price: number;
  }) => {
    pushToDataLayer({
      event: 'select_item',
      ecommerce: {
        items: [
          {
            item_id: String(product.id),
            item_name: product.name,
            item_category: product.category,
            price: product.price,
          },
        ],
      },
    });
  },

  // Cart events
  addToCart: (product: {
    id: number | string;
    name: string;
    category: string;
    price: number;
    quantity?: number;
  }) => {
    pushToDataLayer({
      event: 'add_to_cart',
      ecommerce: {
        currency: 'USD',
        value: product.price * (product.quantity || 1),
        items: [
          {
            item_id: String(product.id),
            item_name: product.name,
            item_category: product.category,
            price: product.price,
            quantity: product.quantity || 1,
          },
        ],
      },
    });
  },

  removeFromCart: (product: {
    id: number | string;
    name: string;
    price: number;
    quantity?: number;
  }) => {
    pushToDataLayer({
      event: 'remove_from_cart',
      ecommerce: {
        currency: 'USD',
        value: product.price * (product.quantity || 1),
        items: [
          {
            item_id: String(product.id),
            item_name: product.name,
            price: product.price,
            quantity: product.quantity || 1,
          },
        ],
      },
    });
  },

  viewCart: (cart: {
    total: number;
    items: Array<{
      id: number | string;
      name: string;
      price: number;
      quantity: number;
    }>;
  }) => {
    pushToDataLayer({
      event: 'view_cart',
      ecommerce: {
        currency: 'USD',
        value: cart.total,
        items: cart.items.map(item => ({
          item_id: String(item.id),
          item_name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
      },
    });
  },

  // Checkout events
  beginCheckout: (cart: {
    total: number;
    items: Array<{
      id: number | string;
      name: string;
      price: number;
      quantity: number;
    }>;
  }) => {
    pushToDataLayer({
      event: 'begin_checkout',
      ecommerce: {
        currency: 'USD',
        value: cart.total,
        items: cart.items.map(item => ({
          item_id: String(item.id),
          item_name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
      },
    });
  },

  addPaymentInfo: (paymentMethod: string, value: number) => {
    pushToDataLayer({
      event: 'add_payment_info',
      ecommerce: {
        currency: 'USD',
        value,
        payment_type: paymentMethod,
      },
    });
  },

  purchase: (order: {
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
    pushToDataLayer({
      event: 'purchase',
      ecommerce: {
        transaction_id: order.order_id,
        currency: 'USD',
        value: order.total,
        tax: order.tax || 0,
        shipping: order.shipping || 0,
        items: order.items.map(item => ({
          item_id: String(item.id),
          item_name: item.name,
          item_category: item.category || 'Unknown',
          price: item.price,
          quantity: item.quantity,
        })),
      },
    });
  },

  // Wishlist events
  addToWishlist: (product: {
    id: number | string;
    name: string;
    category?: string;
    price: number;
  }) => {
    pushToDataLayer({
      event: 'add_to_wishlist',
      ecommerce: {
        currency: 'USD',
        value: product.price,
        items: [
          {
            item_id: String(product.id),
            item_name: product.name,
            item_category: product.category || 'Unknown',
            price: product.price,
          },
        ],
      },
    });
  },

  removeFromWishlist: (productId: number | string) => {
    pushToDataLayer({
      event: 'remove_from_wishlist',
      item_id: String(productId),
    });
  },

  // Search events
  search: (searchTerm: string, resultsCount?: number) => {
    pushToDataLayer({
      event: 'search',
      search_term: searchTerm,
      results_count: resultsCount,
    });
  },

  // Seller events
  listProduct: (product: {
    category: string;
    type: string;
    price: number;
  }) => {
    pushToDataLayer({
      event: 'seller_list_product',
      product_category: product.category,
      product_type: product.type,
      product_price: product.price,
    });
  },

  becomeSellerStart: () => {
    pushToDataLayer({
      event: 'seller_onboarding_start',
    });
  },

  becomeSellerComplete: () => {
    pushToDataLayer({
      event: 'seller_onboarding_complete',
    });
  },

  // KYC events
  kycStart: () => {
    pushToDataLayer({
      event: 'kyc_verification_start',
    });
  },

  kycSubmit: (verificationType: string) => {
    pushToDataLayer({
      event: 'kyc_verification_submit',
      verification_type: verificationType,
    });
  },

  kycComplete: () => {
    pushToDataLayer({
      event: 'kyc_verification_complete',
    });
  },

  // Social/engagement events
  shareProduct: (productId: number | string, method: string) => {
    pushToDataLayer({
      event: 'share',
      method,
      content_type: 'product',
      item_id: String(productId),
    });
  },

  viewProfile: (userId: string, profileType: 'user' | 'seller') => {
    pushToDataLayer({
      event: 'view_profile',
      profile_user_id: userId,
      profile_type: profileType,
    });
  },

  // Dispute events
  createDispute: (orderId: string, disputeType: string) => {
    pushToDataLayer({
      event: 'dispute_create',
      order_id: orderId,
      dispute_type: disputeType,
    });
  },

  // Engagement events
  videoPlay: (videoId: string, videoName?: string) => {
    pushToDataLayer({
      event: 'video_start',
      video_id: videoId,
      video_name: videoName,
    });
  },

  fileDownload: (fileName: string, fileType: string) => {
    pushToDataLayer({
      event: 'file_download',
      file_name: fileName,
      file_type: fileType,
    });
  },

  // Custom events
  customEvent: (eventName: string, params?: Record<string, any>) => {
    pushToDataLayer({
      event: eventName,
      ...params,
    });
  },
};

export default gtmAnalytics;

