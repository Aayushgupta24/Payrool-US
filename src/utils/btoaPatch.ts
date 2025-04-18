import { utf8ToBase64 } from './base64';

/**
 * Patches the global window.btoa function to handle non-Latin1 characters
 * by using our utf8ToBase64 utility function instead.
 * 
 * This prevents the "Failed to execute 'btoa' on 'Window': The string to be encoded 
 * contains characters outside of the Latin1 range" error.
 */
export function patchBtoa(): void {
  // Store the original btoa function
  const originalBtoa = window.btoa;
  
  // Override the global btoa function
  window.btoa = function(str: string): string {
    try {
      // First try the original btoa function
      return originalBtoa(str);
    } catch (e) {
      console.log('Original btoa failed, using utf8ToBase64 instead');
      // If it fails (likely due to non-Latin1 characters), use our utf8ToBase64 utility
      return utf8ToBase64(str);
    }
  };
  
}
