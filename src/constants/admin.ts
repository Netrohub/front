/**
 * Admin Panel Constants
 * Centralized configuration for pagination, rates, timeouts, and limits
 */

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 25,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100],
  MAX_PAGE_SIZE: 100,
} as const;

export const RATES = {
  API_TIMEOUT: 10000, // 10 seconds
  DEBOUNCE_DELAY: 300, // milliseconds
  REFRESH_INTERVAL: 30000, // 30 seconds
} as const;

export const CACHE = {
  STALE_TIME: 30 * 1000, // 30 seconds
  CACHE_TIME: 5 * 60 * 1000, // 5 minutes
} as const;

export const LIMITS = {
  MAX_SEARCH_RESULTS: 100,
  MAX_EXPORT_RECORDS: 10000,
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5 MB
} as const;

export const DATE_FORMATS = {
  DISPLAY: 'MMM dd, yyyy',
  FULL: 'MMMM dd, yyyy',
  DATETIME: 'MMM dd, yyyy HH:mm',
  TIME: 'HH:mm:ss',
} as const;

export const STATUS_COLORS = {
  pending: 'yellow',
  processing: 'blue',
  completed: 'green',
  failed: 'red',
  cancelled: 'gray',
  active: 'green',
  inactive: 'gray',
  open: 'blue',
  in_progress: 'yellow',
  resolved: 'green',
  closed: 'gray',
} as const;
