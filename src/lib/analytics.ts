/**
 * Google Analytics Utility
 * Track custom events and page views
 */

// Extend Window interface for gtag
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

const GA_TRACKING_ID = import.meta.env.VITE_GA_TRACKING_ID;
const IS_ENABLED = import.meta.env.VITE_ENABLE_ANALYTICS === 'true';

/**
 * Track page view
 */
export const trackPageView = (url: string, title?: string) => {
  if (!IS_ENABLED || !window.gtag) return;

  window.gtag('config', GA_TRACKING_ID, {
    page_path: url,
    page_title: title,
  });
};

/**
 * Track custom event
 */
export const trackEvent = (
  eventName: string,
  eventParams?: Record<string, any>
) => {
  if (!IS_ENABLED || !window.gtag) return;

  window.gtag('event', eventName, eventParams);
};

/**
 * E-commerce tracking events
 */
export const analytics = {
  // Product events
  viewProduct: (product: { id: number | string; name: string; category: string; price: number }) => {
    trackEvent('view_item', {
      currency: 'USD',
      value: product.price,
      items: [
        {
          item_id: product.id,
          item_name: product.name,
          item_category: product.category,
          price: product.price,
        },
      ],
    });
  },

  viewProductList: (products: Array<{ id: number | string; name: string; category: string; price: number }>) => {
    trackEvent('view_item_list', {
      items: products.map((product, index) => ({
        item_id: product.id,
        item_name: product.name,
        item_category: product.category,
        price: product.price,
        index,
      })),
    });
  },

  addToCart: (product: { id: number | string; name: string; category: string; price: number; quantity?: number }) => {
    trackEvent('add_to_cart', {
      currency: 'USD',
      value: product.price * (product.quantity || 1),
      items: [
        {
          item_id: product.id,
          item_name: product.name,
          item_category: product.category,
          price: product.price,
          quantity: product.quantity || 1,
        },
      ],
    });
  },

  removeFromCart: (product: { id: number | string; name: string; price: number; quantity?: number }) => {
    trackEvent('remove_from_cart', {
      currency: 'USD',
      value: product.price * (product.quantity || 1),
      items: [
        {
          item_id: product.id,
          item_name: product.name,
          price: product.price,
          quantity: product.quantity || 1,
        },
      ],
    });
  },

  beginCheckout: (cart: { total: number; items: Array<{ id: number | string; name: string; price: number; quantity: number }> }) => {
    trackEvent('begin_checkout', {
      currency: 'USD',
      value: cart.total,
      items: cart.items.map(item => ({
        item_id: item.id,
        item_name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
    });
  },

  purchase: (order: {
    order_number: string;
    total: number;
    items: Array<{ id: number | string; name: string; price: number; quantity: number }>;
  }) => {
    trackEvent('purchase', {
      transaction_id: order.order_number,
      currency: 'USD',
      value: order.total,
      items: order.items.map(item => ({
        item_id: item.id,
        item_name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
    });
  },

  // User events
  signUp: (method: string = 'email') => {
    trackEvent('sign_up', {
      method,
    });
  },

  login: (method: string = 'email') => {
    trackEvent('login', {
      method,
    });
  },

  // Search events
  search: (searchTerm: string) => {
    trackEvent('search', {
      search_term: searchTerm,
    });
  },

  // Seller events
  listProduct: (category: string) => {
    trackEvent('list_product', {
      category,
    });
  },

  // Dispute events
  createDispute: (type: string) => {
    trackEvent('create_dispute', {
      dispute_type: type,
    });
  },

  // Engagement events
  addToWishlist: (productId: number | string) => {
    trackEvent('add_to_wishlist', {
      item_id: productId,
    });
  },

  shareProduct: (productId: number | string, method: string) => {
    trackEvent('share', {
      method,
      content_type: 'product',
      item_id: productId,
    });
  },

  // Custom events
  customEvent: (eventName: string, params?: Record<string, any>) => {
    trackEvent(eventName, params);
  },
};

/**
 * Initialize analytics (called automatically by gtag script)
 */
export const initAnalytics = () => {
  if (!IS_ENABLED) {
    console.log('Analytics disabled');
    return;
  }

  console.log('Google Analytics initialized:', GA_TRACKING_ID);
};

export default analytics;
