import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import Layout from '../components/Layout';
import Header from '../components/Header';

const DocumentsPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isTeamActive = location.pathname.includes('/team');
  const isPersonalActive = location.pathname.includes('/personal');

  return (
    <Layout>
      <div className="p-8">
        <div className="w-full mb-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex space-x-4">
              <button 
                className={`px-4 py-2 ${isTeamActive 
                  ? 'text-white bg-teal-600 rounded' 
                  : 'text-gray-700 border-b-2 border-transparent hover:border-gray-300'}`}
                onClick={() => navigate('/employee/documents/team')}
              >
                Team documents
              </button>
              <button 
                className={`px-4 py-2 ${isPersonalActive 
                  ? 'text-white bg-teal-600 rounded' 
                  : 'text-gray-700 border-b-2 border-transparent hover:border-gray-300'}`}
                onClick={() => navigate('/employee/documents/personal')}
              >
                Personal documents
              </button>
            </div>
            <button className="px-4 py-2 border border-teal-600 text-teal-600 rounded hover:bg-teal-50">
              Upload document
            </button>
          </div>
        </div>
        <Outlet />
      </div>
    </Layout>
  );
};

export default DocumentsPage;
