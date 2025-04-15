import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import Toast from '../components/Toast';
import { Shield } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [otpToken, setOtpToken] = useState(['', '', '', '', '', '']); // 6-digit OTP
  const [isLoading, setIsLoading] = useState(false);
  const [showOTPInput, setShowOTPInput] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { signInWithOTP, verifyOTP } = useAuth();
  const { toast, showToast, hideToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!showOTPInput) {
        await signInWithOTP(email);
        setShowOTPInput(true);
        showToast({
          type: 'success',
          message: 'Check your email for the OTP code!'
        });
      } else {
        const otpString = otpToken.join('');
        const user = await verifyOTP(email, otpString);
        
        // Store user data in localStorage
        localStorage.setItem('user', JSON.stringify(user));
        
        // Get the redirect path from location state or default to role-based path
        const from = location.state?.from?.pathname || getRoleBasedPath(user.role);
        navigate(from, { replace: true });
      }
    } catch (error) {
      showToast({
        type: 'error',
        message: error instanceof Error ? error.message : 'Authentication failed'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to determine the redirect path based on user role
  const getRoleBasedPath = (role: string) => {
    switch (role) {
      case 'admin':
        return '/admin';
      case 'employer':
        return '/employer/dashboard';
      case 'employee':
        return '/employee/dashboard';
      default:
        return '/login';
    }
  };

  const handleOTPChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1); // Take only the last character if pasted
    if (!/^\d*$/.test(value)) return; // Only allow digits

    const newOTP = [...otpToken];
    newOTP[index] = value;
    setOtpToken(newOTP);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otpToken[index] && index > 0) {
      // Focus previous input on backspace if current input is empty
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  return (
    <div className="min-h-screen flex bg-[#F4F9FF]">
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="flex items-center gap-2 mb-8">
            <Shield className="h-8 w-8 text-[#32CD32]" />
            <h1 className="text-2xl font-bold text-gray-900">Global SuperApp</h1>
          </div>
          
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900">Sign in</h2>
              <p className="mt-2 text-lg text-gray-600">Access your account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {!showOTPInput ? (
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#32CD32] focus:ring-[#32CD32]"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Enter 6-digit OTP
                  </label>
                  <div className="flex gap-2 justify-between">
                    {otpToken.map((digit, index) => (
                      <input
                        key={index}
                        id={`otp-${index}`}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOTPChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        className="w-12 h-12 text-center text-xl rounded-md border-gray-300 shadow-sm focus:border-[#32CD32] focus:ring-[#32CD32]"
                      />
                    ))}
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading || (showOTPInput && otpToken.join('').length !== 6)}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#32CD32] hover:bg-[#2AB12A] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#32CD32] disabled:opacity-50 transition-colors"
              >
                {isLoading 
                  ? 'Processing...' 
                  : showOTPInput
                  ? 'Verify OTP'
                  : 'Sign in'
                }
              </button>

              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <Link to="/forgot-password" className="text-[#32CD32] hover:text-[#2AB12A] font-medium">
                    Forgot password?
                  </Link>
                </div>
                <div className="text-sm">
                  <Link to="/signup" className="text-[#32CD32] hover:text-[#2AB12A] font-medium">
                    Create account
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={hideToast}
        />
      )}
    </div>
  );
}
