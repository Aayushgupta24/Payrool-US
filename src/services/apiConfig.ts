import axios from 'axios';

// Define credentials\

// Create base64 string using browser's btoa function
const basicAuth = btoa(`${import.meta.env.VITE_CLIENT_ID}:${import.meta.env.VITE_CLIENT_SECRET}`);

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': `Basic ${basicAuth}`
  }
});

// Add request interceptor for debugging
api.interceptors.request.use(request => {
  // Log request details (excluding sensitive data)
  console.log('Making request to:', request.url);
  const sanitizedHeaders = { ...request.headers };
  if (sanitizedHeaders.Authorization) {
    sanitizedHeaders.Authorization = 'Basic [REDACTED]';
  }
  console.log('Request Headers:', sanitizedHeaders);
  return request;
});

// Add response interceptor
api.interceptors.response.use(
  response => {
    console.log('Response Status:', response.status);
    console.log('Response Data:', typeof response.data, Array.isArray(response.data) ? 'array' : 'object');
    return response;
  },
  error => {
    console.error('API Error:', {
      status: error.response?.status,
      message: error.response?.data?.error?.message || error.message,
      url: error.config?.url
    });
    return Promise.reject(error);
  }
);

export default api;





