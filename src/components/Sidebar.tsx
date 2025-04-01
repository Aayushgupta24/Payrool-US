import React from 'react';

const Sidebar: React.FC = () => {
  return (
    <div className="sidebar w-64 border-r border-gray-200">
      <div className="p-4">
        <img 
          src="/logo.svg" 
          alt="Growth Pods Logo" 
          className="h-12 mb-2" 
        />
        <div className="text-lg font-medium mt-4 mb-6">GrowthPods Demo</div>
        <div className="border-t border-gray-200 my-2"></div>

        <div className="relative mb-6 mt-4">
          <select className="w-full border border-gray-300 p-2 rounded appearance-none pr-8">
            <option>Select employee</option>
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path>
            </svg>
          </div>
        </div>

        <nav className="space-y-2">
          <a href="#" className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded">
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M9 3v18M3 9h18" />
            </svg>
            Dashboard
          </a>
          <a href="#" className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded">
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4M12 8h.01" />
            </svg>
            Your details
          </a>
          <a href="#" className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded">
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="16" rx="2" />
              <path d="M16 2v4M8 2v4M3 10h18" />
            </svg>
            Paystub
          </a>
          <a href="#" className="flex items-center p-2 text-gray-700 bg-teal-600 text-white rounded">
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8L14 2z" />
              <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
            </svg>
            Documents
          </a>
        </nav>

        <div className="border-t border-gray-200 my-6"></div>

        <a href="#" className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded">
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 4v16m0-16H8m4 0h4" />
          </svg>
          Switch to admin
        </a>
      </div>
    </div>
  );
};

export default Sidebar;
