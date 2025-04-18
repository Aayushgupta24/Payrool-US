export const utf8ToBase64 = (str: string): string => {
  try {
    // First encode the string as UTF-8
    const encodedStr = encodeURIComponent(str.trim());
    // Convert encoded string to unescaped ASCII
    const ascii = unescape(encodedStr);
    // Use btoa to encode to base64
    return btoa(ascii);
  } catch (error) {
    console.error('Error in utf8ToBase64:', error);
    // If the above fails, try a simpler approach
    return btoa(unescape(encodeURIComponent(str.trim())));
  }
};

export const base64ToUtf8 = (str: string): string => {
  try {
    // Decode base64 to ASCII
    const ascii = atob(str);
    // Convert ASCII to percent-encoded UTF-8
    const encoded = escape(ascii);
    // Decode the percent-encoded UTF-8
    return decodeURIComponent(encoded);
  } catch (error) {
    console.error('Error in base64ToUtf8:', error);
    return decodeURIComponent(escape(atob(str)));
  }
};



