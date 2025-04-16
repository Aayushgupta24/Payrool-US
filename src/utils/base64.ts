// Import Buffer from 'buffer' package
import { Buffer } from 'buffer';

export const utf8ToBase64 = (str: string): string => {
  try {
    // Use Buffer to handle the encoding
    return Buffer.from(str, 'utf8').toString('base64');
  } catch (e) {
    console.error('Base64 encoding error:', e);
    throw new Error('Failed to encode string to base64');
  }
};

export const base64ToUtf8 = (base64: string): string => {
  try {
    // Use Buffer to handle the decoding
    return Buffer.from(base64, 'base64').toString('utf8');
  } catch (e) {
    console.error('Base64 decoding error:', e);
    throw new Error('Failed to decode base64 string');
  }
};


