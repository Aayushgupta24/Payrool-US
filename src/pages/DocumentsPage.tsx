import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useSmartNavigation } from '../hooks/useSmartNavigation';

const DocumentsPage: React.FC = () => {
  useSmartNavigation();
  const navigate = useNavigate();
  const location = useLocation();

  const isBusinessActive = location.pathname.includes('/business');
  const isTeamActive = location.pathname.includes('/team');

  return (
    <div className="flex-1 p-6">
      {/* Top navigation tabs */}
      <div className="flex space-x-4 mb-8">
        <div 
          onClick={() => navigate('business')}
          className={`px-6 py-3 rounded-lg font-medium cursor-pointer ${
            isBusinessActive ? 'bg-[#008080] text-white' : 'text-gray-700 hover:text-gray-900'
          }`}
        >
          Business documents
        </div>
        <div 
          onClick={() => navigate('team')}
          className={`px-6 py-3 rounded-lg font-medium cursor-pointer ${
            isTeamActive ? 'bg-[#008080] text-white' : 'text-gray-700 hover:text-gray-900'
          }`}
        >
          Team documents
        </div>
      </div>

      {/* Content area */}
      <Outlet />

      {/* Empty state - shown when no route is matched */}
      {!isBusinessActive && !isTeamActive && (
        <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)]">
          <div className="bg-white rounded-lg shadow-md p-8 flex flex-col items-center max-w-md">
            <svg 
              width="32" 
              height="32" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
              strokeLinecap="round" 
              strokeLinejoin="round"
              className="text-gray-600 mb-4"
            >
              <path d="M10 12v6l4-3-4-3z"/>
              <circle cx="12" cy="12" r="10"/>
            </svg>
            <p className="text-gray-600">Nothing to see for now.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentsPage;
