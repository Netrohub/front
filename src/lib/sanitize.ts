/**
 * Input Sanitization Utility
 * 
 * Provides sanitization functions to prevent XSS attacks in admin forms
 * and user-generated content.
 */

import DOMPurify from 'dompurify';

/**
 * Sanitize HTML content
 */
export function sanitizeHTML(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br'],
    ALLOWED_ATTR: ['href'],
  });
}

/**
 * Sanitize plain text content (strip all HTML)
 */
export function sanitizeText(dirty: string): string {
  return DOMPurify.sanitize(dirty, { 
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
  });
}

/**
 * Sanitize user input for display
 */
export function sanitizeInput(input: string | null | undefined): string {
  if (!input) return '';
  
  // Remove potential script tags and dangerous characters
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .trim();
}

/**
 * Sanitize object values recursively
 */
export function sanitizeObject<T extends Record<string, any>>(obj: T): T {
  const sanitized = { ...obj };
  
  for (const key in sanitized) {
    if (typeof sanitized[key] === 'string') {
      sanitized[key] = sanitizeInput(sanitized[key]) as T[Extract<keyof T, string>];
    } else if (typeof sanitized[key] === 'object' && sanitized[key] !== null) {
      sanitized[key] = sanitizeObject(sanitized[key]) as T[Extract<keyof T, string>];
    }
  }
  
  return sanitized;
}

/**
 * Validate email format
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate and sanitize email
 */
export function sanitizeEmail(email: string): string {
  const sanitized = sanitizeInput(email);
  if (!validateEmail(sanitized)) {
    throw new Error('Invalid email format');
  }
  return sanitized;
}

/**
 * Remove SQL injection patterns from input
 */
export function removeSQLInjection(input: string): string {
  const sqlPatterns = [
    /(\%27)|(\')|(\-\-)|(\%23)|(#)/gi,
    /((\%3D)|(=))[^\n]*((\%27)|(\')|(\-\-)|(\%3B)|(;))/gi,
    /\w*((\%27)|(\'))((\%6F)|o|(\%4F))((\%72)|r|(\%52))/gi,
    /((\%27)|(\'))union/gi,
  ];
  
  let sanitized = input;
  sqlPatterns.forEach(pattern => {
    sanitized = sanitized.replace(pattern, '');
  });
  
  return sanitized;
}

/**
 * Sanitize filename to prevent path traversal
 */
export function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .replace(/\.\./g, '')
    .substring(0, 255);
}
