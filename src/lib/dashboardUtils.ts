/**
 * Dashboard Utility Functions
 * Shared helpers for dashboard components
 */

import { format, parseISO } from 'date-fns';

// ============================================
// STATUS COLOR UTILITIES
// ============================================

export const ORDER_STATUS_COLORS = {
  completed: 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20',
  delivered: 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20',
  processing: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20',
  pending: 'bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20',
  cancelled: 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20',
  refunded: 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20',
  default: 'bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20',
} as const;

export const PRODUCT_STATUS_COLORS = {
  active: 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20',
  pending: 'bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20',
  inactive: 'bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20',
  sold: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20',
  rejected: 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20',
  default: 'bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20',
} as const;

export function getOrderStatusColor(status: string): string {
  return ORDER_STATUS_COLORS[status as keyof typeof ORDER_STATUS_COLORS] || ORDER_STATUS_COLORS.default;
}

export function getProductStatusColor(status: string): string {
  return PRODUCT_STATUS_COLORS[status as keyof typeof PRODUCT_STATUS_COLORS] || PRODUCT_STATUS_COLORS.default;
}

// ============================================
// DATE FORMATTING UTILITIES
// ============================================

/**
 * Safely format a date string
 * Returns 'N/A' if date is invalid
 */
export function formatDate(dateString: string | Date | null | undefined, formatStr: string = 'MMM dd, yyyy'): string {
  if (!dateString) return 'N/A';
  
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
    return format(date, formatStr);
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn('Invalid date:', dateString, error);
    }
    return 'N/A';
  }
}

/**
 * Format date with time
 */
export function formatDateTime(dateString: string | Date | null | undefined): string {
  return formatDate(dateString, 'MMM dd, yyyy HH:mm');
}

/**
 * Format relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(dateString: string | Date | null | undefined): string {
  if (!dateString) return 'N/A';
  
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return formatDate(date, 'MMM dd');
  } catch (error) {
    return 'N/A';
  }
}

// ============================================
// CURRENCY FORMATTING UTILITIES
// ============================================

/**
 * Safely format currency
 * Returns '$0.00' if value is invalid
 */
export function formatCurrency(value: number | string | null | undefined, currency: string = 'USD'): string {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  
  if (numValue === null || numValue === undefined || isNaN(numValue)) {
    return '$0.00';
  }
  
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(numValue);
  } catch (error) {
    return `$${numValue.toFixed(2)}`;
  }
}

// ============================================
// DATA SAFETY UTILITIES
// ============================================

/**
 * Safely get property from object
 * Returns default value if property is undefined/null
 */
export function safeGet<T>(value: T | null | undefined, defaultValue: T): T {
  return value ?? defaultValue;
}

/**
 * Safely parse number
 */
export function safeNumber(value: any, defaultValue: number = 0): number {
  const parsed = typeof value === 'string' ? parseFloat(value) : value;
  return isNaN(parsed) ? defaultValue : parsed;
}

// ============================================
// CONSTANTS
// ============================================

export const DASHBOARD_LIMITS = {
  ORDERS_PREVIEW: 5,
  QUICK_VIEW: 3,
  ORDERS_PER_PAGE: 10,
  PRODUCTS_PER_PAGE: 10,
} as const;

export const VALID_TAB_IDS = [
  'overview',
  'buyer',
  'seller',
  'profile',
  'orders',
  'wallet',
  'notifications',
  'billing',
  'kyc',
] as const;

export type DashboardTab = typeof VALID_TAB_IDS[number];

/**
 * Check if tab is valid
 */
export function isValidTab(tab: string): tab is DashboardTab {
  return VALID_TAB_IDS.includes(tab as DashboardTab);
}

