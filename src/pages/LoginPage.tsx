import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { useSmartNavigation } from '../hooks/useSmartNavigation';
import { authService } from '../services/authService';

const LoginPage: React.FC = () => {
  useSmartNavigation();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await authService.sendOtp(email);
      setIsOtpSent(true);
    } catch (err) {
      setError('Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = await authService.verifyOtp(email, otp);
      if (data.session) {
        // Store any necessary user data
        localStorage.setItem('userEmail', email);
        // Redirect to admin page
        navigate('/admin');
      } else {
        setError('Login failed. Please try again.');
      }
    } catch (err) {
      setError('Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
      <div className="mb-6 flex flex-col items-center">
        <img src="/main.png" alt="Growth Pods Logo" className="h-20 mb-2" />
        <p className="text-center text-sm text-gray-700">Hire. Pay. Manage.</p>
      </div>

      <div className="w-full max-w-md bg-white">
        <h2 className="text-3xl font-bold text-center mb-8">Welcome</h2>

        <form className="space-y-6" onSubmit={isOtpSent ? handleVerifyOtp : handleSendOtp}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
              disabled={isOtpSent}
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
              required
            />
          </div>

          {isOtpSent && (
            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                Enter OTP
              </label>
              <input
                type="text"
                id="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP"
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
                required
              />
            </div>
          )}

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-teal-700 text-white font-semibold rounded-md shadow hover:bg-teal-800 disabled:opacity-50"
          >
            {loading ? 'Please wait...' : isOtpSent ? 'Verify OTP' : 'Send OTP'}
          </button>

          {isOtpSent && (
            <button
              type="button"
              onClick={() => {
                setIsOtpSent(false);
                setOtp('');
                setError(null);
              }}
              className="w-full py-2 px-4 text-teal-700 border border-teal-700 font-semibold rounded-md shadow hover:bg-teal-50"
            >
              Change Email
            </button>
          )}

          <p className="text-center text-sm text-gray-700 mt-6">
            Don't have an account?{' '}
            <Link 
              to="/signup" 
              className="text-teal-600 hover:text-teal-700 font-medium"
            >
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
