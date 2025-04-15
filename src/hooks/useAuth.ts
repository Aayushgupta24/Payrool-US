import { supabase } from '../lib/supabaseClient';

export const useAuth = () => {
  const signInWithOTP = async (email: string) => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin,
        shouldCreateUser: false,
        data: {
          email_confirm: true,
        }
      }
    });
    
    if (error) throw error;
  };

  const signUpWithOTP = async (userData: { firstName: string; lastName: string; email: string }) => {
    const { error } = await supabase.auth.signInWithOtp({
      email: userData.email,
      options: {
        emailRedirectTo: window.location.origin,
        shouldCreateUser: true,
        data: {
          first_name: userData.firstName,
          last_name: userData.lastName,
          email_confirm: true,
        }
      }
    });
    
    if (error) throw error;
  };

  const verifyOTP = async (email: string, token: string) => {
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'magiclink'
    });
    
    if (error) throw error;
    
    // Store user data in localStorage
    if (data.user) {
      localStorage.setItem('user', JSON.stringify({
        id: data.user.id,
        email: data.user.email,
        role: 'admin' // Set default role as admin for now
      }));
    }

    return data;
  };

  return {
    signInWithOTP,
    signUpWithOTP,
    verifyOTP
  };
};




