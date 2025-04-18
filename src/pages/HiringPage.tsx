import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AddTeamMemberModal from '../components/AddTeamMemberModal';
import api from '../services/apiConfig';
import { useCopilotAction, useCopilotReadable } from '@copilotkit/react-core';
import { employerService } from '../services/employerService';
import { useSmartNavigation } from '../hooks/useSmartNavigation';

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

interface DetailedUserInfo {
  firstName: string;
  lastName: string;
  email: string;
  businessEmail: string;
  businessPhone: string;
  phoneNumber: string;
  dateOfJoin: string;
  workerType: string;
  jobTitle: string;
  companyLocationCategory: string;
  stateCode: string;
  status: string;
  ssn?: string;
  directDepositStatus?: string;
  industry?: string;
  address?: string;
  compensation?: string;
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

interface UserActionModalProps {
  user: DetailedUserInfo | null;
  loading: boolean;
  error: string | null;
  onClose: () => void;
  onDeactivate: (user: DetailedUserInfo) => void;
  onEdit: (user: DetailedUserInfo) => void;
}

const UserActionModal: React.FC<UserActionModalProps> = ({ 
  user, 
  loading, 
  error, 
  onClose, 
  onDeactivate, 
  onEdit 
}) => {
  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-96">
          <div className="text-center">Loading user details...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-96">
          <div className="text-red-600 text-center">{error}</div>
          <button
            onClick={onClose}
            className="mt-4 w-full px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-[600px] max-h-[80vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">
          {user.firstName} {user.lastName}
        </h2>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="space-y-2">
            <h3 className="font-medium text-gray-700">Contact Information</h3>
            <p><span className="font-medium">Work Email:</span> {user.email}</p>
            {user.personalEmail && (
              <p><span className="font-medium">Personal Email:</span> {user.personalEmail}</p>
            )}
            <p><span className="font-medium">Phone:</span> {user.phoneNumber}</p>
          </div>
          
          <div className="space-y-2">
            <h3 className="font-medium text-gray-700">Employment Details</h3>
            <p><span className="font-medium">Job Title:</span> {user.jobTitle}</p>
            <p><span className="font-medium">Worker Type:</span> {user.workerType}</p>
            <p><span className="font-medium">Start Date:</span> {new Date(user.dateOfJoin).toLocaleDateString()}</p>
            <p><span className="font-medium">Status:</span> 
              <span className={`ml-2 px-2 py-1 text-sm rounded-full ${
                user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {user.status}
              </span>
            </p>
          </div>
        </div>

        <div className="space-y-2 mb-6">
          <h3 className="font-medium text-gray-700">Location Details</h3>
          <p><span className="font-medium">Work Location:</span> {user.companyLocationCategory}</p>
          <p><span className="font-medium">State:</span> {user.stateCode}</p>
          {user.address && (
            <div>
              <p><span className="font-medium">Address:</span></p>
              <p className="ml-4">
                {user.address.street}<br />
                {user.address.city}, {user.address.state} {user.address.zipCode}
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={() => onEdit(user)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Edit
          </button>
          <button
            onClick={() => onDeactivate(user)}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Deactivate
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const UserDetailsModal: React.FC<{ 
  user: DetailedUserInfo | null;
  loading: boolean;
  error: string | null;
  onClose: () => void;
}> = ({ user, loading, error, onClose }) => {
  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-4 w-96 border border-gray-100">
          <div className="flex items-center justify-center space-x-2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-teal-500"></div>
            <span className="text-gray-500 text-sm">Loading user details...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-4 w-96 border border-gray-100">
          <div className="text-red-500 text-sm mb-3">{error}</div>
          <button 
            onClick={onClose} 
            className="w-full px-3 py-1.5 bg-gray-50 text-gray-600 rounded-md hover:bg-gray-100 text-sm transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-[700px] max-h-[85vh] overflow-hidden shadow-sm">
        {/* Enhanced Header with gradient and border */}
        <div className="relative">
          {/* Top border line with gradient */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600"></div>
          
          {/* Header content with enhanced gradient background */}
          <div className="bg-gradient-to-r from-teal-600 to-teal-700 px-6 py-4 border-b border-teal-700">
            <div className="flex justify-between items-center">
              <div className="text-white">
                <h1 className="text-lg font-medium tracking-wide">{`${user.firstName} ${user.lastName}`}</h1>
                <p className="text-teal-50 text-sm mt-0.5 opacity-90">{user.jobTitle}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                user.status === 'Active' 
                  ? 'bg-green-50 text-green-700' 
                  : 'bg-red-50 text-red-700'
              }`}>
                {user.status}
              </span>
            </div>
          </div>
        </div>

        <div className="p-4 overflow-y-auto">
          {/* Contact Information */}
          <div className="bg-gray-50 rounded-md p-3 mb-4 border border-gray-100">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Contact Information</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-500">Work Email</label>
                <p className="text-sm text-gray-700">{user.email}</p>
              </div>
              {user.personalEmail && (
                <div>
                  <label className="text-xs text-gray-500">Personal Email</label>
                  <p className="text-sm text-gray-700">{user.personalEmail}</p>
                </div>
              )}
              <div>
                <label className="text-xs text-gray-500">Phone Number</label>
                <p className="text-sm text-gray-700">{user.phoneNumber}</p>
              </div>
            </div>
          </div>

          {/* Employment Details */}
          <div className="bg-gray-50 rounded-md p-3 mb-4 border border-gray-100">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Employment Details</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-500">Worker Type</label>
                <p className="text-sm text-gray-700">{user.workerType}</p>
              </div>
              <div>
                <label className="text-xs text-gray-500">Start Date</label>
                <p className="text-sm text-gray-700">{new Date(user.dateOfJoin).toLocaleDateString()}</p>
              </div>
              <div>
                <label className="text-xs text-gray-500">Compensation</label>
                <p className="text-sm text-gray-700">{user.compensation || 'Not specified'}</p>
              </div>
            </div>
          </div>

          {/* Location Details */}
          <div className="bg-gray-50 rounded-md p-3 border border-gray-100">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Location Details</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-500">Work Location</label>
                <p className="text-sm text-gray-700">{user.companyLocationCategory}</p>
              </div>
              <div>
                <label className="text-xs text-gray-500">State</label>
                <p className="text-sm text-gray-700">{user.stateCode}</p>
              </div>
              {user.address && (
                <div className="col-span-2">
                  <label className="text-xs text-gray-500">Address</label>
                  <p className="text-sm text-gray-700">
                    {user.address.street}, {user.address.city}, {user.address.state} {user.address.zipCode}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 px-4 py-3 bg-gray-50">
          <div className="flex justify-end space-x-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 bg-white text-gray-600 rounded-md hover:bg-gray-50 text-sm transition-colors border border-gray-200"
            >
              Close
            </button>
            <button
              className="px-3 py-1.5 bg-teal-600 text-white rounded-md hover:bg-teal-700 text-sm transition-colors"
              onClick={() => {/* Add edit functionality */}}
            >
              Edit Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const HiringPage: React.FC = () => {
  useSmartNavigation();
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
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [userDetails, setUserDetails] = useState<DetailedUserInfo | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [detailsError, setDetailsError] = useState<string | null>(null);

  const fetchUserDetails = async (userId: string) => {
    setLoadingDetails(true);
    setDetailsError(null);
    
    try {
      const selectedCompanyStr = localStorage.getItem('selectedCompany');
      if (!selectedCompanyStr) {
        throw new Error('No company selected');
      }

      const selectedCompany = JSON.parse(selectedCompanyStr);
      
      const response = await api.post('/reports', {
        method: 'getUser',
        userId: userId,
        companyId: selectedCompany.companyID
      });

      if (response.data.error) {
        throw new Error(response.data.error.message || 'Failed to fetch user details');
      }

      setUserDetails(response.data);
    } catch (err: any) {
      const errorMessage = err.response?.data?.error?.message || err.message || 'Failed to fetch user details';
      setDetailsError(errorMessage);
      console.error('Error fetching user details:', err);
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleUserClick = (user: TeamMember) => {
    setSelectedUserId(user.userID);
    fetchUserDetails(user.userID);
  };

  const handleCloseModal = () => {
    setSelectedUserId(null);
    setUserDetails(null);
    setDetailsError(null);
  };

  const handleDeactivateUser = async (user: TeamMember) => {
    try {
      await api.post('/users/deactivate', {
        email: user.email
      });
      // Refresh team members list
      fetchTeamMembers();
      setSelectedUserId(null);
      setSuccess(`Successfully deactivated ${user.user}`);
    } catch (error) {
      setError('Failed to deactivate user');
    }
  };

  const handleEditUser = (user: TeamMember) => {
    navigate('/employer/hiring/edit-employee', { state: { user } });
  };

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
              className="group relative inline-flex items-center justify-center px-6 py-3 overflow-hidden font-bold text-white rounded-lg shadow-2xl bg-gradient-to-br from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 transition-all duration-300 ease-out hover:scale-105"
            >
              <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
              <span className="relative flex items-center">
                <svg 
                  className="w-5 h-5 mr-2" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  ></path>
                </svg>
                Add Employee
              </span>
            </button>
            <button
              onClick={handleAddIndependentContractor}
              className="group relative inline-flex items-center justify-center px-6 py-3 overflow-hidden font-bold text-white rounded-lg shadow-2xl bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 transition-all duration-300 ease-out hover:scale-105"
            >
              <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
              <span className="relative flex items-center">
                <svg 
                  className="w-5 h-5 mr-2" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  ></path>
                </svg>
                Add Independent Contractor
              </span>
            </button>
            <button
              onClick={handleAddBusinessContractor}
              className="group relative inline-flex items-center justify-center px-6 py-3 overflow-hidden font-bold text-white rounded-lg shadow-2xl bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 transition-all duration-300 ease-out hover:scale-105"
            >
              <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
              <span className="relative flex items-center">
                <svg 
                  className="w-5 h-5 mr-2" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  ></path>
                </svg>
                Add Business Contractor
              </span>
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
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleUserClick(member)}
                        className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
                      >
                        {member.user}
                      </button>
                    </td>
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

        {selectedUserId && (
          <UserDetailsModal
            user={userDetails}
            loading={loadingDetails}
            error={detailsError}
            onClose={handleCloseModal}
          />
        )}
      </div>
    </div>
  );
};

export default HiringPage;

