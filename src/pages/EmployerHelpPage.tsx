import React from 'react';
import { useNavigate } from 'react-router-dom';

const EmployerHelpPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">How can we help you?</h1>

      {/* Support Categories */}
      <div className="space-y-4 max-w-3xl">
        {/* Taxes Category */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Taxes</h2>
            <button
              onClick={() => navigate('/employer/help/report')}
              className="text-teal-600 hover:text-teal-700 font-medium"
            >
              Report notice
            </button>
          </div>
        </div>

        {/* Support Tickets */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-xl font-semibold">0 active support tickets</h2>
            </div>
            <button
              onClick={() => navigate('/employer/help/tickets')}
              className="text-teal-600 hover:text-teal-700 font-medium"
            >
              View Tickets
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployerHelpPage;