import { isValidElement } from 'react';

/**
 * Safe display helper to prevent React error #130
 * Converts objects to strings in development mode for debugging
 * In production, returns a safe fallback
 */
export function display(value: any): string | number | React.ReactElement {
  // Handle null/undefined
  if (value === null || value === undefined) {
    return '';
  }

  // Handle primitive types
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return value;
  }

  // Handle React elements
  if (isValidElement(value)) {
    return value;
  }

  // Handle arrays
  if (Array.isArray(value)) {
    return value.map(item => display(item)).join(', ');
  }

  // Handle objects - convert to string in dev, fallback in prod
  if (typeof value === 'object') {
    if (process.env.NODE_ENV === 'development') {
      console.warn('Display helper: Converting object to string for debugging:', value);
      return JSON.stringify(value, null, 2);
    }
    
    // In production, try to extract meaningful string representation
    if (value.title) return String(value.title);
    if (value.name) return String(value.name);
    if (value.label) return String(value.label);
    if (value.id) return String(value.id);
    
    // Last resort fallback
    return '[Object]';
  }

  // Handle functions
  if (typeof value === 'function') {
    return '[Function]';
  }

  // Fallback
  return String(value);
}

/**
 * Type guard to check if a value is safe to render as React children
 */
export function isSafeToRender(value: any): value is string | number | React.ReactElement {
  return (
    value === null ||
    value === undefined ||
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean' ||
    isValidElement(value)
  );
}

/**
 * Safely render a value, converting objects to strings if needed
 */
export function safeRender(value: any): React.ReactNode {
  if (isSafeToRender(value)) {
    return value;
  }
  
  return display(value);
}
