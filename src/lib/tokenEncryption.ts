/**
 * Token Encryption Utility
 * 
 * Provides basic encryption/obfuscation for JWT tokens stored in localStorage
 * to prevent casual XSS attacks from immediately reading tokens.
 * 
 * Note: This is client-side obfuscation. For true security, use httpOnly cookies
 * with the backend. This is a defense-in-depth measure.
 */

// Simple obfuscation key (in production, use environment variable)
const ENCRYPTION_KEY = import.meta.env.VITE_ENCRYPTION_KEY || 'nxoland-admin-secure-key-2025';

/**
 * Obfuscates a token using XOR cipher
 */
function obfuscateToken(token: string): string {
  const key = ENCRYPTION_KEY;
  let obfuscated = '';
  
  for (let i = 0; i < token.length; i++) {
    const char = token.charCodeAt(i);
    const keyChar = key.charCodeAt(i % key.length);
    obfuscated += String.fromCharCode(char ^ keyChar);
  }
  
  // Convert to base64 for storage
  return btoa(obfuscated);
}

/**
 * Deobfuscates a token from storage
 */
function deobfuscateToken(obfuscatedToken: string): string {
  try {
    const key = ENCRYPTION_KEY;
    const decoded = atob(obfuscatedToken);
    let deobfuscated = '';
    
    for (let i = 0; i < decoded.length; i++) {
      const char = decoded.charCodeAt(i);
      const keyChar = key.charCodeAt(i % key.length);
      deobfuscated += String.fromCharCode(char ^ keyChar);
    }
    
    return deobfuscated;
  } catch (error) {
    console.error('Failed to deobfuscate token:', error);
    return '';
  }
}

/**
 * Securely store a token
 */
export function storeSecureToken(key: string, token: string): void {
  try {
    const obfuscated = obfuscateToken(token);
    localStorage.setItem(`enc_${key}`, obfuscated);
    localStorage.setItem(`${key}_timestamp`, Date.now().toString());
  } catch (error) {
    console.error('Failed to store secure token:', error);
  }
}

/**
 * Retrieve a secure token
 */
export function getSecureToken(key: string): string | null {
  try {
    const obfuscated = localStorage.getItem(`enc_${key}`);
    if (!obfuscated) return null;
    
    const token = deobfuscateToken(obfuscated);
    
    // Check if token is expired (older than 24 hours)
    const timestamp = localStorage.getItem(`${key}_timestamp`);
    if (timestamp) {
      const age = Date.now() - parseInt(timestamp, 10);
      const maxAge = 24 * 60 * 60 * 1000; // 24 hours
      if (age > maxAge) {
        removeSecureToken(key);
        return null;
      }
    }
    
    return token;
  } catch (error) {
    console.error('Failed to get secure token:', error);
    return null;
  }
}

/**
 * Remove a secure token
 */
export function removeSecureToken(key: string): void {
  localStorage.removeItem(`enc_${key}`);
  localStorage.removeItem(`${key}_timestamp`);
}

/**
 * Check if a secure token exists
 */
export function hasSecureToken(key: string): boolean {
  return !!localStorage.getItem(`enc_${key}`);
}
