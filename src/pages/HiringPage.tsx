import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AddTeamMemberModal from '../components/AddTeamMemberModal';
import api from '../services/apiConfig';
import { useCopilotAction, useCopilotReadable } from '@copilotkit/react-core';
import { employerService } from '../services/employerService';
import { useNavigationStore } from '../store/navigationStore';

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

interface HiringFormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dateOfJoin: string;
  workerType: 'W2' | '1099';
  jobTitle: string;
  companyLocationCategory: 'Remote' | 'On-site';
  stateCode: string;
  salary: number;
}

const HiringPage: React.FC = () => {
  const navigate = useNavigate();
  const [showAddTeamMemberModal, setShowAddTeamMemberModal] = useState(false);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formData, setFormData] = useState<HiringFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    dateOfJoin: '',
    workerType: 'W2',
    jobTitle: '',
    companyLocationCategory: 'Remote',
    stateCode: '',
    salary: 0
  });

  const { intent, setIntent } = useNavigationStore();

  useEffect(() => {
    if (intent?.page === 'hiring') {
      if (intent.action === 'prefillForm' && intent.payload) {
        setFormData(intent.payload);
        // Additional logic to handle form initialization
      }
      setIntent(null);
    }
  }, [intent, setIntent]);

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

  // Make form data readable by Copilot
  useCopilotReadable({
    name: "hiringFormData",
    description: "Current state of the hiring form",
    value: formData
  });

  // Add employee action for Copilot
  useCopilotAction({
    name: "addNewEmployee",
    description: "Add a new employee to the system",
    parameters: [
      { name: "firstName", type: "string", description: "Employee's first name" },
      { name: "lastName", type: "string", description: "Employee's last name" },
      { name: "email", type: "string", description: "Employee's email address" },
      { name: "phoneNumber", type: "string", description: "Employee's phone number" },
      { name: "dateOfJoin", type: "string", description: "Start date (YYYY-MM-DD)" },
      { name: "workerType", type: "string", description: "W2 or 1099" },
      { name: "jobTitle", type: "string", description: "Employee's job title" },
      { name: "companyLocationCategory", type: "string", description: "Remote or On-site" },
      { name: "stateCode", type: "string", description: "Two-letter state code" },
      { name: "salary", type: "number", description: "Annual salary amount" }
    ],
    run: async (params) => {
      try {
        setLoading(true);
        setError(null);
        
        // Validate email format
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(params.email)) {
          throw new Error('Invalid email format');
        }

        // Validate phone number (10 digits)
        if (!/^\d{10}$/.test(params.phoneNumber.replace(/\D/g, ''))) {
          throw new Error('Phone number must be 10 digits');
        }

        // Validate date format
        if (!/^\d{4}-\d{2}-\d{2}$/.test(params.dateOfJoin)) {
          throw new Error('Date must be in YYYY-MM-DD format');
        }

        const response = await employerService.addEmployee({
          ...params,
          salary: Number(params.salary)
        });

        setSuccess(`Successfully added ${params.firstName} ${params.lastName} as ${params.jobTitle}`);
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phoneNumber: '',
          dateOfJoin: '',
          workerType: 'W2',
          jobTitle: '',
          companyLocationCategory: 'Remote',
          stateCode: '',
          salary: 0
        });

        return `Successfully added employee: ${params.firstName} ${params.lastName}`;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to add employee';
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    }
  });

  // Clear success message after 5 seconds
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await employerService.addEmployee(formData);
      setSuccess(`Successfully added ${formData.firstName} ${formData.lastName}`);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        dateOfJoin: '',
        workerType: 'W2',
        jobTitle: '',
        companyLocationCategory: 'Remote',
        stateCode: '',
        salary: 0
      });
    } catch (error) {
      setError('Failed to add employee. Please try again.');
    }
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

