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
  if (typeof value === 'object' && value !== null) {
    // Try to extract meaningful string representation first
    // Common properties to extract (in priority order)
    const stringProps = ['title', 'name', 'label', 'email', 'username', 'phone', 'address', 'city', 'country', 'method', 'status', 'description', 'code', 'subject'];
    
    for (const prop of stringProps) {
      if (prop in value && value[prop] != null && value[prop] !== '') {
        const propValue = value[prop];
        if (typeof propValue === 'string' || typeof propValue === 'number') {
          return String(propValue);
        }
        // If property itself is an object, recurse
        if (typeof propValue === 'object') {
          const nested = display(propValue);
          if (nested) return nested;
        }
      }
    }
    
    // Handle numeric properties
    const numericProps = ['amount', 'price', 'total', 'quantity', 'rating', 'count', 'balance'];
    for (const prop of numericProps) {
      if (prop in value && typeof value[prop] === 'number') {
        return String(Number(value[prop]).toFixed(2));
      }
    }
    
    // Handle ID as last resort
    if ('id' in value && value.id != null) {
      return String(value.id);
    }
    
    // For Date objects
    if (value instanceof Date && !isNaN(value.getTime())) {
      return value.toLocaleDateString();
    }
    
    // For nested objects with common patterns
    // Check if object has a displayable string property
    const keys = Object.keys(value);
    if (keys.length > 0) {
      // Try first value that's a string/number
      for (const key of keys) {
        const val = value[key];
        if (typeof val === 'string' || typeof val === 'number') {
          return String(val);
        }
      }
      
      // If in development, show JSON for debugging
      if (import.meta.env.DEV) {
        console.warn('Display helper: Could not extract string from object:', value);
        try {
          return JSON.stringify(value, null, 2);
        } catch {
          return '[Object]';
        }
      }
      
      // In production, return a safe placeholder
      return '—'; // Em dash, better than empty string
    }
    
    // Empty object
    return '';
  }

  // Handle functions
  if (typeof value === 'function') {
    return '[Function]';
  }

  // Fallback - NEVER return "[object Object]"
  const stringValue = String(value);
  if (stringValue === '[object Object]') {
    // This means an object was stringified incorrectly
    // Return a safe placeholder instead
    if (import.meta.env.DEV) {
      console.warn('Display helper: Received unhandled type:', typeof value, value);
      return '[Object]';
    }
    return '—'; // Em dash for production
  }
  
  return stringValue;
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
  // Handle null/undefined
  if (value === null || value === undefined) {
    return '';
  }
  
  // If it's already safe to render, return as-is
  if (isSafeToRender(value)) {
    return value;
  }
  
  // Convert to displayable value
  const displayValue = display(value);
  
  // Double-check: if display() somehow returns "[object Object]", replace it
  if (typeof displayValue === 'string' && displayValue === '[object Object]') {
    if (import.meta.env.DEV) {
      console.warn('safeRender: display() returned "[object Object]" for:', value);
    }
    return '—';
  }
  
  return displayValue;
}
