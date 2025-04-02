import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AddTeamMemberModal from '../components/AddTeamMemberModal';

interface EmployerDashboardProps {}

const EmployerDashboard: React.FC<EmployerDashboardProps> = () => {
  const navigate = useNavigate();
  const [showAddTeamMemberModal, setShowAddTeamMemberModal] = useState(false);

  const handlePayContractors = () => {
    navigate('/employer/payroll', { state: { activeTab: 'Pay Contractors' } });
  };

  const handlePayEmployees = () => {
    navigate('/employer/payroll', { state: { activeTab: 'Pay Employees' } });
  };

  return (
    <div className="flex-1 p-8">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Tex James</h1>
          <div className="flex space-x-4">
            <button 
              onClick={() => setShowAddTeamMemberModal(true)}
              className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Add team member
            </button>
            <button 
              onClick={handlePayContractors}
              className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700"
            >
              Pay contractors
            </button>
            <button 
              onClick={handlePayEmployees}
              className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700"
            >
              Pay employees
            </button>
          </div>
        </div>
      </div>

      <AddTeamMemberModal 
        isOpen={showAddTeamMemberModal}
        onClose={() => setShowAddTeamMemberModal(false)}
      />
    </div>
  );
};

export default EmployerDashboard;
