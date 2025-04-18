import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import { FiUserPlus, FiEdit2, FiTrash2, FiSearch } from 'react-icons/fi';
import api from '../services/apiConfig';
import { useCopilotReadable, useCopilotAction } from '@copilotkit/react-core';
import { useNavigationStore } from '../store/navigationStore';
import { adminService } from '../services/adminService';
import axios from 'axios';
import { getAccessToken } from '../utils/auth';
import { useSmartNavigation } from '../hooks/useSmartNavigation';
import { motion, AnimatePresence } from 'framer-motion';

interface User {
  userID: string;
  user: string;
  email: string;
  dateOfJoin: string;
  jobTitle: string;
  kycStatus: string | null;
  phoneNumber: string;
  workerType: {
    workerType: string;
  };
}

interface AddUserFormData {
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dateOfJoin: string;
  workerType: string;
  jobTitle: string;
  companyLocationCategory: string;
  code: string;
}

const UsersPage: React.FC = () => {
  useSmartNavigation(); // Add this hook to enable smart navigation
  const { intent, setIntent } = useNavigationStore();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState<AddUserFormData>({
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    dateOfJoin: '',
    workerType: 'W2',
    jobTitle: '',
    companyLocationCategory: 'Remote',
    code: 'FL'
  });
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<User>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);

  const handleEditClick = (user: User) => {
    setSelectedUser(user);
    setEditFormData({
      user: user.user,
      email: user.email,
      jobTitle: user.jobTitle,
      phoneNumber: user.phoneNumber,
      workerType: user.workerType
    });
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!selectedUser) return;

      const response = await api.post('https://sandbox.rollfi.xyz/adminPortal', {
        method: 'updateUser',
        user: {
          userID: selectedUser.userID,
          ...editFormData
        }
      });

      if (!response.data || response.data.error) {
        throw new Error(response.data?.error?.message || 'Failed to update user');
      }

      await fetchUsers();
      setShowEditModal(false);
      setSelectedUser(null);
    } catch (error: any) {
      console.error('Error updating user:', error);
      alert(error.message);
    }
  };

  const handleDeleteClick = async (user: User) => {
    if (!window.confirm(`Are you sure you want to delete ${user.user}?`)) return;

    try {
      const response = await api.post('https://sandbox.rollfi.xyz/adminPortal', {
        method: 'deactivateUser',
        user: {
          userId: user.userID,
          exitDate: new Date().toISOString().split('T')[0],
          personalEmail: user.email,
          finalPayCheckType: "They have already been paid",
          additionalNotes: "User deleted via admin portal"
        }
      });

      if (!response.data || response.data.error) {
        throw new Error(response.data?.error?.message || 'Failed to delete user');
      }

      await fetchUsers();
    } catch (error: any) {
      console.error('Error deleting user:', error);
      alert(error.message);
    }
  };

  const handleSearch = (term: string) => {
    setSearchQuery(term);
    
    if (!term.trim()) {
      setFilteredUsers(users);
      return;
    }

    const searchTerm = term.toLowerCase();
    const filtered = users.filter(user => 
      user.user?.toLowerCase().includes(searchTerm) ||
      user.email?.toLowerCase().includes(searchTerm) ||
      user.jobTitle?.toLowerCase().includes(searchTerm) ||
      user.phoneNumber?.toLowerCase().includes(searchTerm) ||
      user.workerType?.workerType?.toLowerCase().includes(searchTerm)
    );
    
    setFilteredUsers(filtered);
  };

  useEffect(() => {
    if (intent?.page === 'users') {
      if (intent.action === 'openAddModal') {
        setShowAddModal(true);
      } else if (intent.action === 'prefillForm' && intent.payload) {
        setFormData(intent.payload);
        setShowAddModal(true);
      } else if (intent.action === 'search' && intent.payload?.searchTerm) {
        handleSearch(intent.payload.searchTerm);
      }
      setIntent(null);
    }
  }, [intent, setIntent]);

  useCopilotReadable({
    name: "users",
    description: "List of all users in the current company",
    value: users
  });

  useCopilotReadable({
    name: "userStats",
    description: "Statistics about users including total count and role distribution",
    value: {
      totalUsers: users.length,
      activeUsers: users.filter(u => u.status === 'active').length,
      roleDistribution: users.reduce((acc, user) => {
        acc[user.role] = (acc[user.role] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    }
  });

  // Add User Action with immediate update
  useCopilotAction({
    name: "addUser",
    description: "Add a new user to the system",
    parameters: [
      { name: "firstName", type: "string", description: "User's first name" },
      { name: "middleName", type: "string", description: "User's middle name (optional)" },
      { name: "lastName", type: "string", description: "User's last name" },
      { name: "email", type: "string", description: "User's email address" },
      { name: "phoneNumber", type: "string", description: "User's phone number" },
      { name: "dateOfJoin", type: "string", description: "User's join date (YYYY-MM-DD)" },
      { name: "workerType", type: "string", description: "User's worker type (W2 or 1099)" },
      { name: "jobTitle", type: "string", description: "User's job title" }
    ],
    handler: async (params: {
      firstName: string;
      middleName: string;
      lastName: string;
      email: string;
      phoneNumber: string;
      dateOfJoin: string;
      workerType: string;
      jobTitle: string;
      companyLocationCategory: string;
      code: string;
    }) => {
      try {
        const selectedCompanyStr = localStorage.getItem('selectedCompany');
        if (!selectedCompanyStr) throw new Error('No company selected');
        const selectedCompany = JSON.parse(selectedCompanyStr);

        const formattedPhone = params.phoneNumber.replace(/\D/g, '');
        const formattedDate = new Date(params.dateOfJoin).toISOString().split('T')[0];

        const newUser = {
          companyId: selectedCompany.companyID,
          userReferenceId: "",
          firstName: params.firstName.trim(),
          middleName: params.middleName?.trim() || "",
          lastName: params.lastName.trim(),
          email: params.email.trim().toLowerCase(),
          phoneNumber: formattedPhone,
          dateOfJoin: formattedDate,
          workerType: params.workerType || "W2",
          jobTitle: params.jobTitle.trim(),
          companyLocationCategory: params.companyLocationCategory || "Remote",
          code: params.code || "FL",
          companyLocationId: ""
        };

        // Using api instance with built-in authorization
        const response = await api.post(
          'https://sandbox.rollfi.xyz/adminPortal',
          {
            method: "addUser",
            user: newUser
          }
        );

        if (!response.data || response.data.error) {
          throw new Error(response.data?.error?.message || 'Failed to add user');
        }

        await fetchUsers();
        return `Successfully added user ${newUser.firstName} ${newUser.lastName}`;
      } catch (error: any) {
        console.error('Error in addUser action:', error);
        const errorMessage = error.response?.data?.message || error.message || 'An unknown error occurred';
        throw new Error(`Failed to add user: ${errorMessage}`);
      }
    }
  });

  // Add a Copilot readable for the form data
  useCopilotReadable({
    name: "addUserForm",
    description: "Current state of the add user form",
    value: formData
  });
  useCopilotAction({
    name: 'switchDashboard',
    description: 'Switch to the dashboard view.',
    parameters: [],
    handler: async () => {
      window.location.href = '/employer/dashboard';
    },
  });
  // Delete User Action
  useCopilotAction({
    name: "deactivateUser",
    description: "Deactivate a user by email",
    parameters: [
      { name: "email", type: "string", description: "Email of the user to deactivate" },
      { name: "exitDate", type: "string", description: "User's exit date (YYYY-MM-DD)" },
      { name: "personalEmail", type: "string", description: "User's personal email" },
      { name: "finalPayCheckType", type: "string", description: "Final payment status" },
      { name: "additionalNotes", type: "string", description: "Additional notes for deactivation", optional: true }
    ],
    handler: async (params) => {
      try {
        const user = users.find(u => u.email === params.email);
        if (!user) return "User not found";

        // Using api instance with built-in authorization
        const response = await api.post('https://sandbox.rollfi.xyz/adminPortal', {
          method: 'deactivateUser',
          user: {
            userId: user.userID,
            exitDate: params.exitDate || new Date().toISOString().split('T')[0],
            personalEmail: params.personalEmail || params.email,
            finalPayCheckType: params.finalPayCheckType || "They have already been paid",
            additionalNotes: params.additionalNotes || "User deactivated via system"
          }
        });

        if (!response.data || response.data.error) {
          throw new Error(response.data?.error?.message || 'Failed to deactivate user');
        }

        await fetchUsers();
        return `Successfully deactivated user ${params.email}`;
      } catch (error: any) {
        console.error('Error in deactivateUser action:', error);
        const errorMessage = error.response?.data?.message || error.message || 'An unknown error occurred';
        throw new Error(`Failed to deactivate user: ${errorMessage}`);
      }
    }
  });

  // Search Users Action
  useCopilotAction({
    name: "searchUsers",
    description: "Search users by name or email",
    parameters: [
      { name: "searchTerm", type: "string", description: "Name or email to search for" }
    ],
    run: async (params) => {
      const searchResults = users.filter(user => 
        user.email.toLowerCase().includes(params.searchTerm.toLowerCase()) ||
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(params.searchTerm.toLowerCase())
      );
      
      if (searchResults.length === 0) {
        return "No users found matching your search criteria";
      }

      return `Found ${searchResults.length} users:\n${searchResults.map(user => 
        `- ${user.firstName} ${user.lastName} (${user.email})`
      ).join('\n')}`;
    }
  });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const selectedCompanyStr = localStorage.getItem('selectedCompany');
      if (!selectedCompanyStr) {
        throw new Error('No company selected');
      }

      const selectedCompany = JSON.parse(selectedCompanyStr);
      console.log('Fetching users for company:', selectedCompany);
      
      const response = await api.post('/reports', {
        method: 'getUsersByCompanyName',
        companyName: selectedCompany.company
      });

      if (response.data) {
        setUsers(response.data);
        setFilteredUsers(response.data); // Initialize filtered users
        setSearchQuery(''); // Reset search query
      }
    } catch (error: any) {
      console.error('Error fetching users:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Refresh users periodically (every 30 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      fetchUsers();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const selectedCompanyStr = localStorage.getItem('selectedCompany');
      if (!selectedCompanyStr) throw new Error('No company selected');
      
      const selectedCompany = JSON.parse(selectedCompanyStr);
      
      const response = await api.post('https://sandbox.rollfi.xyz/adminPortal', {
        method: 'addUser',
        user: {
          companyId: selectedCompany.companyID,
          userReferenceId: '',
          ...formData,
          companyLocationId: ''
        }
      });

      if (response.data) {
        await fetchUsers(); // Wait for the users to be fetched
        setShowAddModal(false);
        // Reset form
        setFormData({
          firstName: '',
          middleName: '',
          lastName: '',
          email: '',
          phoneNumber: '',
          dateOfJoin: '',
          workerType: 'W2',
          jobTitle: '',
          companyLocationCategory: 'Remote',
          code: 'FL'
        });
      }
    } catch (error) {
      console.error('Error adding user:', error);
      setError('Failed to add user');
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Users</h1>
            <div className="flex items-center">
              <div className="relative mr-4">
                <input
                  type="text"
                  placeholder="Search for anything..."
                  className="border rounded-lg px-4 py-2 pl-10 w-64 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                />
                <FiSearch className="absolute left-3 top-3 text-gray-400" />
              </div>
              <button 
                onClick={() => setShowAddModal(true)}
                className="bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700 transition-colors"
              >
                <FiUserPlus className="inline-block mr-2" />
                Add User
              </button>
            </div>
          </div>

          {/* Users Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr className="border-b">
                  <th className="text-left p-4 font-medium text-gray-600">Name</th>
                  <th className="text-left p-4 font-medium text-gray-600">Email</th>
                  <th className="text-left p-4 font-medium text-gray-600">Job Title</th>
                  <th className="text-left p-4 font-medium text-gray-600">Worker Type</th>
                  <th className="text-left p-4 font-medium text-gray-600">Join Date</th>
                  <th className="text-left p-4 font-medium text-gray-600">KYC Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="text-center py-4">Loading...</td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={7} className="text-center py-4 text-red-500">{error}</td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-4">
                      {searchQuery ? "No users found matching your search" : "No users found"}
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.userID} className="border-b hover:bg-gray-50">
                      <td className="p-4">{user.user}</td>
                      <td className="p-4 text-gray-600">{user.email}</td>
                      <td className="p-4 text-gray-600">{user.jobTitle}</td>
                      <td className="p-4 text-gray-600">{user.workerType?.workerType || 'N/A'}</td>
                      <td className="p-4 text-gray-600">{formatDate(user.dateOfJoin)}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          user.kycStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          user.kycStatus === 'new' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {user.kycStatus || 'Not Started'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button 
                          onClick={() => handleEditClick(user)}
                          className="text-blue-600 hover:text-blue-900 mr-3 flex items-center"
                        >
                          <FiEdit2 className="mr-1" /> Edit
                        </button>
                        <button 
                          onClick={() => handleDeleteClick(user)}
                          className="text-red-600 hover:text-red-900 flex items-center"
                        >
                          <FiTrash2 className="mr-1" /> Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersPage;
