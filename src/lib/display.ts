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
    // Try to extract meaningful string representation first
    if (value && typeof value === 'object') {
      // Common properties to extract (in priority order)
      if ('title' in value && value.title) return String(value.title);
      if ('name' in value && value.name) return String(value.name);
      if ('label' in value && value.label) return String(value.label);
      if ('email' in value && value.email) return String(value.email);
      if ('username' in value && value.username) return String(value.username);
      if ('phone' in value && value.phone) return String(value.phone);
      if ('address' in value && value.address) return String(value.address);
      if ('city' in value && value.city) return String(value.city);
      if ('country' in value && value.country) return String(value.country);
      if ('method' in value && value.method) return String(value.method);
      if ('status' in value && value.status) return String(value.status);
      if ('amount' in value && typeof value.amount === 'number') return String(value.amount.toFixed(2));
      if ('price' in value && typeof value.price === 'number') return String(value.price.toFixed(2));
      if ('rating' in value && typeof value.rating === 'number') return String(value.rating);
      if ('id' in value && value.id != null) return String(value.id);
      
      // For nested objects, try to get a summary
      const keys = Object.keys(value);
      if (keys.length > 0) {
        if (import.meta.env.DEV) {
          console.warn('Display helper: Object has no stringifiable properties:', value);
          return JSON.stringify(value, null, 2);
        }
        // In production, return empty string or a safe placeholder
        return '';
      }
    }
    
    // Last resort fallback
    return '';
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
