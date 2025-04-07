import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AddTeamMemberModal from '../components/AddTeamMemberModal';
import api from '../services/apiConfig';

interface TeamMember {
  userID: string;
  user: string;
  email: string;
  phoneNumber: string;
  jobTitle: string;
  dateOfJoin: string;
  workerType: {
    workerType: string;
  };
  status?: string;
}

const HiringPage: React.FC = () => {
  const navigate = useNavigate();
  const [showAddTeamMemberModal, setShowAddTeamMemberModal] = useState(false);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeamMembers = async () => {
      setLoading(true);
      try {
        const selectedCompanyStr = localStorage.getItem('selectedCompany');
        if (!selectedCompanyStr) {
          throw new Error('No company selected');
        }

        const selectedCompany = JSON.parse(selectedCompanyStr);
        
        const response = await api.post('/reports', {
          method: 'getUsersByCompanyName',
          companyName: selectedCompany.company
        });

        const data = response.data;
        console.log('API Response:', data);

        if (data && typeof data === 'object') {
          let usersData: TeamMember[] = [];
          
          if (Array.isArray(data)) {
            usersData = data;
          } else if (Array.isArray(data.users)) {
            usersData = data.users;
          } else if (data.data && Array.isArray(data.data.users)) {
            usersData = data.data.users;
          } else if (data.data && Array.isArray(data.data)) {
            usersData = data.data;
          }

          setTeamMembers(usersData);
        } else {
          throw new Error('Invalid response format');
        }
      } catch (err: any) {
        const errorMessage = err.response?.data?.error?.message || err.message || 'Failed to fetch team members';
        console.error('Error fetching team members:', err);
        setError(errorMessage);
        setTeamMembers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamMembers();
  }, []);

  const handleAddEmployee = () => {
    navigate('/employer/hiring/add-employee');
  };

  const handleAddIndependentContractor = () => {
    navigate('/employer/hiring/add-independent-contractor');
  };

  const handleAddBusinessContractor = () => {
    navigate('/employer/hiring/add-business-contractor');
  };

  return (
    <div className="flex-1 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold">Hiring and Onboarding</h1>
          <div className="space-x-4">
            <button
              onClick={handleAddEmployee}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Add Employee
            </button>
            <button
              onClick={handleAddIndependentContractor}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Add Independent Contractor
            </button>
            <button
              onClick={handleAddBusinessContractor}
              className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
            >
              Add Business Contractor
            </button>
          </div>
        </div>

        {loading && <div className="text-center py-4">Loading team members...</div>}
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="bg-white shadow rounded-lg">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {teamMembers.map((member) => (
                  <tr key={member.userID}>
                    <td className="px-6 py-4 whitespace-nowrap">{member.user}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{member.jobTitle}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{member.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{member.phoneNumber}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{new Date(member.dateOfJoin).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        member.workerType.workerType === 'Employee' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {member.workerType.workerType}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {showAddTeamMemberModal && (
          <AddTeamMemberModal
            isOpen={showAddTeamMemberModal}
            onClose={() => setShowAddTeamMemberModal(false)}
          />
        )}
      </div>
    </div>
  );
};

export default HiringPage;

