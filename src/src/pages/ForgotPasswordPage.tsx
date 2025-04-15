import React from "react";

const ForgotPasswordPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
      <div className="w-full max-w-md">
        <h1 className="text-[32px] font-bold text-center mb-2">Reset password</h1>
        <p className="text-gray-500 text-center mb-8">
          Enter your email for a password reset link
        </p>

        <form className="space-y-6">
          <input
            type="email"
            placeholder="Enter email"
            className="w-full px-4 py-3 text-gray-700 border border-gray-200 rounded-lg"
          />

          <button
            type="submit"
            className="w-full py-3 bg-[#008080] text-white font-medium rounded-lg"
          >
            Reset password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;