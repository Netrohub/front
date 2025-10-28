import { format, isValid, parseISO } from 'date-fns';

/**
 * Safely format a date string or Date object
 * Returns '-' if the date is invalid or null
 */
export function safeFormatDate(
  date: string | Date | null | undefined,
  formatStr: string = 'MMM dd, yyyy'
): string {
  if (!date) return '-';
  
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    
    if (!isValid(dateObj)) {
      return '-';
    }
    
    return format(dateObj, formatStr);
  } catch (error) {
    console.warn('Invalid date value:', date, error);
    return '-';
  }
}

/**
 * Safely format a date with time
 */
export function safeFormatDateTime(
  date: string | Date | null | undefined,
  formatStr: string = 'MMM dd, yyyy HH:mm'
): string {
  return safeFormatDate(date, formatStr);
}

/**
 * Safely format a date relative to now (e.g., "2 days ago")
 */
export function safeFormatRelative(
  date: string | Date | null | undefined
): string {
  if (!date) return '-';
  
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    
    if (!isValid(dateObj)) {
      return '-';
    }
    
    const now = new Date();
    const diffMs = now.getTime() - dateObj.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffSecs < 60) return 'Just now';
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    
    return format(dateObj, 'MMM dd, yyyy');
  } catch (error) {
    console.warn('Invalid date value:', date, error);
    return '-';
  }
}

