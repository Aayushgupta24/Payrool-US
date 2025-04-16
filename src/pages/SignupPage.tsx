import React from "react";

const SignupPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4 py-8">
      <div className="w-full max-w-md">
        <h1 className="text-[32px] font-bold text-center mb-2">Tell us about yourself</h1>
        <p className="text-gray-500 text-center mb-8">
          We'll create your account and add you as an admin to your company.
        </p>

        <form className="space-y-6">
          <div>
            <label className="block text-gray-700 mb-2">First name</label>
            <input
              type="text"
              placeholder="Enter first name"
              className="w-full px-4 py-3 text-gray-700 border border-gray-200 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Middle name</label>
            <input
              type="text"
              placeholder="Enter middle name"
              className="w-full px-4 py-3 text-gray-700 border border-gray-200 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Last name</label>
            <input
              type="text"
              placeholder="Enter last name"
              className="w-full px-4 py-3 text-gray-700 border border-gray-200 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Business email</label>
            <input
              type="email"
              placeholder="Enter email"
              className="w-full px-4 py-3 text-gray-700 border border-gray-200 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Confirm email</label>
            <input
              type="email"
              placeholder="Enter email"
              className="w-full px-4 py-3 text-gray-700 border border-gray-200 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Phone number</label>
            <input
              type="tel"
              placeholder="Enter phone number"
              className="w-full px-4 py-3 text-gray-700 border border-gray-200 rounded-lg"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 bg-[#008080] text-white font-medium rounded-lg mt-4"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;