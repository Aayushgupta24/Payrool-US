import axios from 'axios';
import { utf8ToBase64 } from '../utils/base64';

// Define credentials
const credentials = `${import.meta.env.VITE_CLIENT_ID}:${import.meta.env.VITE_CLIENT_SECRET}`;
const basicAuth = utf8ToBase64(credentials);

// Create axios instance with retry configuration
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': `Basic ${basicAuth}`
  },
  timeout: 60000, // 60 seconds
  validateStatus: (status) => status >= 200 && status < 500,
});

// Add retry logic
api.interceptors.response.use(undefined, async (error) => {
  const { config, response } = error;
  if (!config || !config.retry) {
    return Promise.reject(error);
  }

  config.retryCount = config.retryCount || 0;

  if (config.retryCount >= config.retry) {
    return Promise.reject(error);
  }

  config.retryCount += 1;

  const delayRetryRequest = new Promise(resolve => {
    setTimeout(resolve, config.retryDelay || 1000);
  });

  return delayRetryRequest.then(() => api(config));
});

export default api;
