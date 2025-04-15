import api from '../services/apiConfig';
import type { ApiResponse } from './types';

interface LoginCredentials {
  email: string;
  password: string;
}

interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    role: string;
  };
}

export const authService = {
  login: async (credentials: LoginCredentials) => {
    const token = btoa(`${credentials.email}:${credentials.password}`);
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/login', null, {
      headers: {
        Authorization: `Basic ${token}`
      }
    });
    if (response.data.data.token) {
      localStorage.setItem('token', token);
    }
    return response;
  },
    
  logout: () => {
    localStorage.removeItem('token');
    return api.post('/auth/logout');
  },
    
  refreshToken: () => 
    api.post<ApiResponse<AuthResponse>>('/auth/refresh'),
    
  forgotPassword: (email: string) => 
    api.post('/auth/forgot-password', { email }),
    
  resetPassword: (token: string, newPassword: string) => 
    api.post('/auth/reset-password', { token, newPassword })
};








