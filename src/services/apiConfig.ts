import axios from 'axios';

// Define credentials
const basicAuth = btoa(`${import.meta.env.VITE_CLIENT_ID}:${import.meta.env.VITE_CLIENT_SECRET}`);

// Create axios instance with retry configuration
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': `Basic ${basicAuth}`,
    'Connection': 'keep-alive'
  },
  timeout: 60000, // Increase timeout to 60 seconds
  validateStatus: (status) => status >= 200 && status < 500,
  // Add retry configuration
  maxRetries: 3,
  retryDelay: 1000,
});

// Export the default api instance
export default api;

