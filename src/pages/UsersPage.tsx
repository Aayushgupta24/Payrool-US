import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import { FiUserPlus, FiSearch, FiEdit2, FiTrash2, FiSettings } from 'react-icons/fi';
import api from '../services/apiConfig';
import { useCopilotReadable, useCopilotAction } from '@copilotkit/react-core';
import { useNavigationStore } from '../store/navigationStore';
import { adminService } from '../services/adminService';
import axios from 'axios';
import { getAccessToken } from '../utils/auth';
import { useSmartNavigation } from '../hooks/useSmartNavigation';

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
  // Additional fields for the new UI
  group: string;
  permissions: string[];
  lastActivity: string;
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

      const data = response.data;
      console.log('API Response:', data);

      if (data && typeof data === 'object') {
        let usersData: User[] = [];
        
        if (Array.isArray(data)) {
          usersData = data;
        } else if (Array.isArray(data.users)) {
          usersData = data.users;
        } else if (data.data && Array.isArray(data.data.users)) {
          usersData = data.data.users;
        } else if (data.data && Array.isArray(data.data)) {
          usersData = data.data;
        }

        if (usersData.length === 0) {
          console.log('No users found in response');
        } else {
          console.log('Found users:', usersData);
        }

        setUsers(usersData);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.error?.message || err.message || 'Failed to fetch users';
      console.error('Error fetching users:', err);
      setError(errorMessage);
      setUsers([]);
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

  // Mock data for user groups and permissions
  const userGroups = ["User's Group", "Top Manager", "Admin", "Director of Supermarket", "Marketer"];
  const permissionGroups = ["Permission's Group", "Read mode", "Edit mode", "Admin mode"];
  
  // State for filters
  const [selectedUserGroup, setSelectedUserGroup] = useState("User's Group");
  const [selectedPermissionGroup, setSelectedPermissionGroup] = useState("Permission's Group");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // Mock data for the table
  const mockUsers = [
    {
      userID: "1",
      user: "Esther Howard",
      email: "esther@example.com",
      group: "Top Manager",
      permissions: ["Read mode", "Edit mode"],
      lastActivity: "01/15/21",
      dateOfJoin: "2021-01-01",
      jobTitle: "Senior Manager",
      kycStatus: null,
      phoneNumber: "123-456-7890",
      workerType: { workerType: "W2" }
    },
    {
      userID: "2",
      user: "Jane Cooper",
      email: "jane@example.com",
      group: "Admin",
      permissions: ["Read mode", "Edit mode", "Admin mode"],
      lastActivity: "10/28/21",
      dateOfJoin: "2021-01-15",
      jobTitle: "Administrator",
      kycStatus: null,
      phoneNumber: "123-456-7890",
      workerType: { workerType: "W2" }
    },
    {
      userID: "3",
      user: "Cameron Williamson",
      email: "cameron@example.com",
      group: "Director of Supermarket",
      permissions: ["Read mode", "Edit mode"],
      lastActivity: "5/19/21",
      dateOfJoin: "2021-02-01",
      jobTitle: "Director",
      kycStatus: null,
      phoneNumber: "123-456-7890",
      workerType: { workerType: "W2" }
    },
    {
      userID: "4",
      user: "Brooklyn Simmons",
      email: "brooklyn@example.com",
      group: "Top Manager",
      permissions: ["Read mode", "Edit mode"],
      lastActivity: "10/28/21",
      dateOfJoin: "2021-02-15",
      jobTitle: "Manager",
      kycStatus: null,
      phoneNumber: "123-456-7890",
      workerType: { workerType: "W2" }
    },
    {
      userID: "5",
      user: "Leslie Alexander",
      email: "leslie@example.com",
      group: "Marketer",
      permissions: ["Read mode", "Edit mode"],
      lastActivity: "12/10/21",
      dateOfJoin: "2021-03-01",
      jobTitle: "Marketing Specialist",
      kycStatus: null,
      phoneNumber: "123-456-7890",
      workerType: { workerType: "W2" }
    },
    {
      userID: "6",
      user: "Guy Hawkins",
      email: "guy@example.com",
      group: "Director of Supermarket",
      permissions: ["Read mode", "Edit mode"],
      lastActivity: "10/28/21",
      dateOfJoin: "2021-03-15",
      jobTitle: "Director",
      kycStatus: null,
      phoneNumber: "123-456-7890",
      workerType: { workerType: "W2" }
    },
    {
      userID: "7",
      user: "Jenny Wilson",
      email: "jenny@example.com",
      group: "Marketer",
      permissions: ["Read mode", "Edit mode"],
      lastActivity: "12/10/21",
      dateOfJoin: "2021-04-01",
      jobTitle: "Marketing Specialist",
      kycStatus: null,
      phoneNumber: "123-456-7890",
      workerType: { workerType: "W2" }
    },
    {
      userID: "8",
      user: "Robert Fox",
      email: "robert@example.com",
      group: "Director of Supermarket",
      permissions: ["Read mode", "Edit mode"],
      lastActivity: "10/28/21",
      dateOfJoin: "2021-04-15",
      jobTitle: "Director",
      kycStatus: null,
      phoneNumber: "123-456-7890",
      workerType: { workerType: "W2" }
    },
    {
      userID: "9",
      user: "Jacob Jones",
      email: "jacob@example.com",
      group: "Marketer",
      permissions: ["Read mode", "Edit mode"],
      lastActivity: "12/10/21",
      dateOfJoin: "2021-05-01",
      jobTitle: "Marketing Specialist",
      kycStatus: null,
      phoneNumber: "123-456-7890",
      workerType: { workerType: "W2" }
    },
    {
      userID: "10",
      user: "Owen Richards",
      email: "owen@example.com",
      group: "Admin",
      permissions: ["Read mode", "Edit mode", "Admin mode"],
      lastActivity: "10/28/21",
      dateOfJoin: "2021-05-15",
      jobTitle: "Administrator",
      kycStatus: null,
      phoneNumber: "123-456-7890",
      workerType: { workerType: "W2" }
    },
    {
      userID: "11",
      user: "Zak Morris",
      email: "zak@example.com",
      group: "Marketer",
      permissions: ["Read mode", "Edit mode"],
      lastActivity: "12/10/21",
      dateOfJoin: "2021-06-01",
      jobTitle: "Marketing Specialist",
      kycStatus: null,
      phoneNumber: "123-456-7890",
      workerType: { workerType: "W2" }
    }
  ];
  
  // Use mock data if no real data is available
  useEffect(() => {
    if (users.length === 0 && !loading) {
      setUsers(mockUsers);
    }
  }, [users, loading]);
  
  // Handle search
  const handleSearch = (term: string) => {
    setSearchQuery(term);
    // In a real app, you would filter the users based on the search term
  };
  
  // Pagination logic
  const totalPages = Math.ceil(users.length / rowsPerPage);
  const paginatedUsers = users.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );
  
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
                  className="border rounded-lg px-4 py-2 pl-10 w-64"
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
                Add new user
              </button>
            </div>
          </div>
          
          <div className="flex mb-6 space-x-4">
            <select
              value={selectedUserGroup}
              onChange={(e) => setSelectedUserGroup(e.target.value)}
              className="border rounded-lg px-4 py-2 bg-white"
            >
              {userGroups.map((group) => (
                <option key={group} value={group}>{group}</option>
              ))}
            </select>
            
            <select
              value={selectedPermissionGroup}
              onChange={(e) => setSelectedPermissionGroup(e.target.value)}
              className="border rounded-lg px-4 py-2 bg-white"
            >
              {permissionGroups.map((permission) => (
                <option key={permission} value={permission}>{permission}</option>
              ))}
            </select>
          </div>

          {/* Add User Modal */}
          {showAddModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-[600px]">
                <h2 className="text-xl font-semibold mb-4">Add New User</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        First Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Middle Name
                      </label>
                      <input
                        type="text"
                        name="middleName"
                        value={formData.middleName}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date of Join <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        name="dateOfJoin"
                        value={formData.dateOfJoin}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Job Title <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="jobTitle"
                        value={formData.jobTitle}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-4 mt-6">
                    <button
                      type="button"
                      onClick={() => setShowAddModal(false)}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Add User
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {loading ? (
            <div className="text-center py-4">Loading users...</div>
          ) : error ? (
            <div className="text-center py-4 text-red-600">{error}</div>
          ) : (
            <>
              <div className="bg-white rounded-lg shadow overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User Name <span className="ml-1">↓</span>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User's Group <span className="ml-1">↓</span>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Permissions <span className="ml-1">↓</span>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Latest activity <span className="ml-1">↓</span>
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {paginatedUsers.length > 0 ? (
                      paginatedUsers.map((user) => (
                        <tr key={user.userID} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            {user.user}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {user.group || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {user.permissions ? user.permissions.join(', ') : 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {user.lastActivity || formatDate(user.dateOfJoin)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button className="text-blue-600 hover:text-blue-900 mr-3">
                              <FiEdit2 className="inline" /> Edit
                            </button>
                            <button className="text-red-600 hover:text-red-900">
                              <FiTrash2 className="inline" /> Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="text-center py-4 text-gray-500">
                          No users found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination */}
              <div className="flex items-center justify-between mt-4 px-2">
                <div>
                  Showing <span className="font-medium">1-{Math.min(rowsPerPage, users.length)}</span> of <span className="font-medium">{users.length}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-2 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
                  >
                    &lt;
                  </button>
                  
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum = i + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`px-3 py-1 rounded ${
                          currentPage === pageNum
                            ? 'bg-blue-600 text-white'
                            : 'border hover:bg-gray-100'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  
                  {totalPages > 5 && (
                    <>
                      <span>...</span>
                      <button
                        onClick={() => setCurrentPage(totalPages)}
                        className="px-3 py-1 border rounded hover:bg-gray-100"
                      >
                        {totalPages}
                      </button>
                    </>
                  )}
                  
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="px-2 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
                  >
                    &gt;
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UsersPage;
