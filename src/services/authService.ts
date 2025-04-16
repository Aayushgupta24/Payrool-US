import api from '../services/apiConfig';
import { createClient } from '@supabase/supabase-js';
import type { ApiResponse } from './types';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export const authService = {
  sendOtp: async (email: string) => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    });
    
    if (error) throw error;
  },

  verifyOtp: async (email: string, token: string) => {
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'email'
    });

    if (error) throw error;

    if (data.session) {
      localStorage.setItem('token', data.session.access_token);
    }

    return data;
  },

  logout: () => {
    localStorage.removeItem('token');
    return supabase.auth.signOut();
  },

  refreshToken: async () => {
    const { data, error } = await supabase.auth.refreshSession();
    if (error) throw error;
    return data;
  },

  forgotPassword: (email: string) => 
    api.post('/auth/forgot-password', { email }),

  resetPassword: (token: string, newPassword: string) => 
    api.post('/auth/reset-password', { token, newPassword })
};








