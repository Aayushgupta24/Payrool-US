import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCopilotReadable, useCopilotAction } from '@copilotkit/react-core';
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

const TeamPage: React.FC = () => {
  const navigate = useNavigate();
  const [showAddTeamMemberModal, setShowAddTeamMemberModal] = useState(false);
  const [activeTab, setActiveTab] = useState('Employees');
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const tabs = ['Employees', 'Contractors', 'Inactive employees', 'Inactive contractors'];

  // Copilot Readable States
  useCopilotReadable({
    name: "teamMembers",
    description: "List of all team members in the company",
    value: teamMembers
  });

  useCopilotReadable({
    name: "teamStats",
    description: "Statistics about team members including counts by type and status",
    value: {
      totalMembers: teamMembers.length,
      activeEmployees: teamMembers.filter(m => m.workerType.workerType === 'W2' && m.status !== 'inactive').length,
      activeContractors: teamMembers.filter(m => m.workerType.workerType !== 'W2' && m.status !== 'inactive').length,
      inactiveEmployees: teamMembers.filter(m => m.workerType.workerType === 'W2' && m.status === 'inactive').length,
      inactiveContractors: teamMembers.filter(m => m.workerType.workerType !== 'W2' && m.status === 'inactive').length
    }
  });

  useCopilotReadable({
    name: "currentTab",
    description: "Currently active tab in the team page",
    value: activeTab
  });

  // Copilot Actions
  useCopilotAction({
    name: "switchTab",
    description: "Switch to a different tab in the team page",
    parameters: [
      {
        name: "tabName",
        type: "string",
        description: "Name of the tab to switch to (Employees, Contractors, Inactive employees, Inactive contractors)"
      }
    ],
    run: async (params) => {
      if (tabs.includes(params.tabName)) {
        setActiveTab(params.tabName);
        return `Switched to ${params.tabName} tab`;
      }
      return "Invalid tab name";
    }
  });

  useCopilotAction({
    name: "searchTeamMember",
    description: "Search for a team member by name or email",
    parameters: [
      {
        name: "searchTerm",
        type: "string",
        description: "Name or email to search for"
      }
    ],
    run: async (params) => {
      const searchResults = teamMembers.filter(member => 
        member.user.toLowerCase().includes(params.searchTerm.toLowerCase()) ||
        member.email.toLowerCase().includes(params.searchTerm.toLowerCase())
      );
      
      if (searchResults.length === 0) {
        return "No team members found matching your search criteria";
      }

      return `Found ${searchResults.length} team members:\n${searchResults.map(member => 
        `- ${member.user} (${member.email}) - ${member.workerType.workerType === 'W2' ? 'Employee' : 'Contractor'}`
      ).join('\n')}`;
    }
  });

  useCopilotAction({
    name: "addTeamMember",
    description: "Open the add team member modal",
    parameters: [],
    run: async () => {
      setShowAddTeamMemberModal(true);
      return "Opened add team member modal";
    }
  });

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

  const getFilteredTeamMembers = () => {
    return teamMembers.filter(member => {
      const isW2 = member.workerType.workerType === 'W2';
      const isActive = member.status !== 'inactive';

      switch (activeTab) {
        case 'Employees':
          return isW2 && isActive;
        case 'Contractors':
          return !isW2 && isActive;
        case 'Inactive employees':
          return isW2 && !isActive;
        case 'Inactive contractors':
          return !isW2 && !isActive;
        default:
          return false;
      }
    });
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-12 text-red-500">
          {error}
        </div>
      );
    }

    const filteredMembers = getFilteredTeamMembers();
    
    if (filteredMembers.length === 0) {
      return (
        <div className="text-center py-12 text-gray-500">
          No {activeTab.toLowerCase()} found
        </div>
      );
    }

    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredMembers.map((member, index) => (
              <tr key={member.userID || index}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{member.user}</div>
                  <div className="text-sm text-gray-500">{member.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {member.jobTitle}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(member.dateOfJoin).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    member.workerType.workerType === 'W2' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {member.workerType.workerType === 'W2' ? 'Employee' : 'Contractor'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="flex-1 p-8">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Team Members</h1>
          <button
            onClick={() => setShowAddTeamMemberModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Add Team Member
          </button>
        </div>

        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`
                  whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                  ${activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-6">
          {renderContent()}
        </div>

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
export default TeamPage;

