import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import { FiUserPlus } from 'react-icons/fi';
import api from '../services/apiConfig';
import { 
  useCopilotReadable, 
  useCopilotAction, 
  useCopilotAdditionalInstructions 
} from '@copilotkit/react-core';
import { useNavigationStore } from '../store/navigationStore';
import { adminService } from '../services/adminService';
import axios from 'axios';
import { getAccessToken } from '../utils/auth';
import { useSmartNavigation } from '../hooks/useSmartNavigation';
import { PromptManager } from '../services/promptManager';
// import { utf8ToBase64, base64ToUtf8 } from '../utils/base64';

interface User {
  userID: string;
  user: string;
  firstName?: string;
  lastName?: string;
  email: string;
  dateOfJoin: string;
  jobTitle: string;
  kycStatus: string | null;
  phoneNumber: string;
  workerType: {
    workerType: string;
  };
  status?: string;
  role?: string;
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

// Define the type for the params in the addUser handler
interface AddUserParams {
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dateOfJoin: string;
  workerType: string;
  jobTitle: string;
  companyLocationCategory?: string;
  code: string;
}

// Define the type for the newUser object
interface NewUserPayload {
  companyId: string;
  userReferenceId: string;
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
  companyLocationId: string;
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
  const [selectedCompany, setSelectedCompany] = useState<any>(null);

  // Add effect to load selected company
  useEffect(() => {
    const selectedCompanyStr = localStorage.getItem('selectedCompany');
    if (selectedCompanyStr) {
      setSelectedCompany(JSON.parse(selectedCompanyStr));
    }
  }, []);

  // Handle search function
  const handleSearch = (searchTerm: string) => {
    console.log('Searching for:', searchTerm);
    // Implement search functionality here
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

  // Implement Copilot additional instructions for step-by-step user details collection
  useCopilotAdditionalInstructions({
    instructions: `
    When collecting user details for adding a new user:
    1. Ask for and collect one field at a time in this specific order: first name, last name, email, phone number, job title, worker type, date of join, and state code.
    2. Validate each field before proceeding to the next one:
       - First name should not be empty, should not contain numbers, and should be maximum 50 characters
       - Last name should not be empty and should not contain numbers
       - Email should be in a valid format
       - Phone number should be properly formatted (10 digits)
       - Date of join should be a valid date
       - State code must be a valid two-letter US state code
    3. After collecting all required fields, summarize the information and ask for confirmation before submitting.
    4. If there are any errors during submission, clearly explain the issue and which field needs correction.
    `,
    available: "enabled"
  });

  // Make data available to Copilot
  const userStats = {
    totalUsers: users.length,
    activeUsers: users.filter(u => u.status === 'active').length,
    roleDistribution: users.reduce((acc, user) => {
      if (user.role) {
        acc[user.role] = (acc[user.role] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>)
  };

  // Improved validation helper function
  function validateUserInput(input: any): string[] {
    const errors: string[] = [];
    
    // First Name validation
    if (!input.firstName?.trim()) {
      errors.push('First name is required');
    } else {
      if (input.firstName.length > 50) {
        errors.push('First name must be maximum 50 characters');
      }
      if (/\d/.test(input.firstName)) {
        errors.push('First name should not contain numbers');
      }
      // More permissive regex that allows for more special characters and international names
      if (!/^[\p{L}\s'-\.]+$/u.test(input.firstName)) {
        errors.push('First name contains invalid characters');
      }
    }

    // Other validations...
    if (!input.lastName?.trim()) errors.push('Last name is required');
    if (/\d/.test(input.lastName)) errors.push('Last name should not contain numbers');
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(input.email)) {
      errors.push('Invalid email format');
    }
    if (!/^\d{10}$/.test(input.phoneNumber.replace(/\D/g, ''))) {
      errors.push('Phone number must be 10 digits');
    }
    if (!input.dateOfJoin || isNaN(new Date(input.dateOfJoin).getTime())) {
      errors.push('Invalid date format');
    }
    if (!['W2', '1099'].includes(input.workerType)) {
      errors.push('Worker type must be either W2 or 1099');
    }
    if (!input.jobTitle?.trim()) errors.push('Job title is required');
    if (!/^[A-Z]{2}$/.test(input.code.toUpperCase())) {
      errors.push('Invalid state code format');
    }

    return errors;
  }

  // Add User Action with improved validation and feedback
  useCopilotAction({
    name: "addUser",
    description: "Add a new user to the system",
    parameters: [
      { name: "firstName", type: "string", description: "User's first name (max 50 characters, letters only)" },
      { name: "middleName", type: "string", description: "User's middle name (optional)" },
      { name: "lastName", type: "string", description: "User's last name" },
      { name: "email", type: "string", description: "User's email address" },
      { name: "phoneNumber", type: "string", description: "User's phone number" },
      { name: "dateOfJoin", type: "string", description: "User's join date (YYYY-MM-DD)" },
      { name: "workerType", type: "string", description: "User's worker type (W2 or 1099)" },
      { name: "jobTitle", type: "string", description: "User's job title" },
      { 
        name: "code", 
        type: "string", 
        description: "Two-letter state code (Required)",
        required: true 
      }
    ],
    handler: async (params) => {
      try {
        // Decode the first name if it's base64 encoded
        let firstName = params.firstName;
        
        // Validation checks
        if (!firstName || firstName.trim().length === 0) {
          throw new Error('First name is required');
        }
        
        if (firstName.trim().length > 50) {
          throw new Error('First name must be maximum 50 characters');
        }
        
        if (/\d/.test(firstName)) {
          throw new Error('First name should not contain numbers');
        }

        const selectedCompanyStr = localStorage.getItem('selectedCompany');
        if (!selectedCompanyStr) throw new Error('No company selected');
        const selectedCompany = JSON.parse(selectedCompanyStr);

        const formattedPhone = params.phoneNumber.replace(/\D/g, '');
        const formattedDate = new Date(params.dateOfJoin).toISOString().split('T')[0];

        // Create the new user object with validated data
        const newUser = {
          companyId: selectedCompany.companyID,
          userReferenceId: "",
          firstName: firstName.trim(),
          middleName: params.middleName?.trim() || "",
          lastName: params.lastName.trim(),
          email: params.email.trim().toLowerCase(),
          phoneNumber: formattedPhone,
          dateOfJoin: formattedDate,
          workerType: params.workerType || "W2",
          jobTitle: params.jobTitle.trim(),
          companyLocationCategory: "Remote",
          stateCode: params.code.toUpperCase(), // Add stateCode field
          code: params.code.toUpperCase(),      // Keep code field
          companyLocationId: ""
        };

        // Log the state code specifically
        console.log('State Code:', params.code);
        console.log('Formatted State Code:', params.code.toUpperCase());

        const requestPayload = {
          method: "addUser",
          user: {
            ...newUser,
            stateCode: params.code.toUpperCase(), // Add at root level too
          }
        };

        // Log the full payload
        console.log('Full Request Payload:', JSON.stringify(requestPayload, null, 2));

        const response = await api.post(
          'https://sandbox.rollfi.xyz/adminPortal',
          requestPayload
        );

        // Log the full response for debugging
        console.log('Full Response:', JSON.stringify(response.data, null, 2));

        return response.data;
      } catch (error) {
        console.error('Error in addUser handler:', error);
        throw error;
      }
    }
  });

  // Make user data readable by Copilot
  useCopilotReadable({
    name: "usersList",
    description: "List of all users with their details",
    value: users.map(user => ({
      userId: user.userID,
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      jobTitle: user.jobTitle,
      status: user.status,
      workerType: user.workerType.workerType
    }))
  });

  // Add Copilot instructions for updating users
  useCopilotAdditionalInstructions({
    instructions: `
    When updating user details:
    1. First ask for the user ID to update
    2. Verify the user exists and show current details
    3. Ask which fields need to be updated
    4. Validate each field:
       - Names should not contain numbers
       - Phone number should be 10 digits
       - Date format should be YYYY-MM-DD
       - Worker type must be W2 or 1099
       - Location must be Remote or On-site
       - State code must be valid two-letter US state code
    5. Confirm all changes before submitting
    6. Show success message or error details
    `,
    available: "enabled"
  });

  // Update User Action
  useCopilotAction({
    name: "updateUser",
    description: "Update existing user details",
    parameters: [
      { name: "userId", type: "string", description: "User ID to update", required: true },
      { name: "firstName", type: "string", description: "Updated first name" },
      { name: "lastName", type: "string", description: "Updated last name" },
      { name: "phoneNumber", type: "string", description: "Updated phone number" },
      { name: "dateOfJoin", type: "string", description: "Date of joining (YYYY-MM-DD)" },
      { name: "workerType", type: "string", description: "Worker type (W2 or 1099)" },
      { name: "jobTitle", type: "string", description: "Job title" },
      { name: "companyLocationCategory", type: "string", description: "Location category (Remote or On-site)" },
      { name: "code", type: "string", description: "State code (e.g., FL)" }
    ],
    handler: async (params) => {
      try {
        // Validate inputs
        if (!params.userId) throw new Error("User ID is required");
        
        // Format phone number if provided
        const formattedPhone = params.phoneNumber ? 
          params.phoneNumber.replace(/\D/g, '') : undefined;

        // Create update object matching exact API format
        const userUpdate = {
          userId: params.userId,
          firstName: params.firstName,
          lastName: params.lastName,
          phoneNumber: formattedPhone,
          dateOfJoin: params.dateOfJoin,
          workerType: params.workerType,
          jobTitle: params.jobTitle,
          companyLocationCategory: params.companyLocationCategory,
          code: params.code?.toUpperCase(),
          companyLocationId: ""
        };

        // Log the update payload
        console.log('Update payload:', JSON.stringify({
          method: "updateUser",
          user: userUpdate
        }, null, 2));

        const response = await api.put(
          'https://sandbox.rollfi.xyz/adminPortal',
          {
            method: "updateUser",
            user: userUpdate
          }
        );

        // Log the response for debugging
        console.log('Update response:', JSON.stringify(response.data, null, 2));

        if (response.data.success) {
          await fetchUsers();
          return `Successfully updated user details for ID: ${params.userId}`;
        } else {
          throw new Error(response.data.message || 'Failed to update user');
        }
      } catch (error) {
        console.error('Error in updateUser handler:', error);
        throw new Error(`Failed to update user: ${error.message}`);
      }
    }
  });

  // No need for useCopilotReadable here as it's causing TypeScript errors
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
    handler: async (params: { searchTerm: string }) => {
      const searchResults = users.filter(user => 
        user.email.toLowerCase().includes(params.searchTerm.toLowerCase()) ||
        `${user.firstName || ''} ${user.lastName || ''}`.toLowerCase().includes(params.searchTerm.toLowerCase())
      );
      
      if (searchResults.length === 0) {
        return "No users found matching your search criteria";
      }

      return `Found ${searchResults.length} users:\n${searchResults.map(user => 
        `- ${user.firstName || user.user} ${user.lastName || ''} (${user.email})`
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
      let firstName = formData.firstName;
      
      // Validation checks
      if (!firstName || firstName.trim().length === 0) {
        setError('First name is required');
        return;
      }
      
      if (firstName.trim().length > 50) {
        setError('First name must be maximum 50 characters');
        return;
      }
      
      if (/\d/.test(firstName)) {
        setError('First name should not contain numbers');
        return;
      }

      const selectedCompanyStr = localStorage.getItem('selectedCompany');
      if (!selectedCompanyStr) throw new Error('No company selected');
      const selectedCompany = JSON.parse(selectedCompanyStr);

      // Create user object with validated data
      const newUser = {
        companyId: selectedCompany.companyID,
        userReferenceId: '',
        firstName: firstName.trim(),
        middleName: formData.middleName?.trim() || '',
        lastName: formData.lastName.trim(),
        email: formData.email.trim().toLowerCase(),
        phoneNumber: formData.phoneNumber.replace(/\D/g, ''),
        dateOfJoin: formData.dateOfJoin,
        workerType: formData.workerType,
        jobTitle: formData.jobTitle.trim(),
        companyLocationCategory: formData.companyLocationCategory,
        code: formData.code.toUpperCase(),
        companyLocationId: ''
      };

      const response = await api.post('https://sandbox.rollfi.xyz/adminPortal', {
        method: 'addUser',
        user: newUser  // Use newUser directly instead of encodedUser
      });

      if (response.data) {
        await fetchUsers();
        setShowAddModal(false);
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

  // Add this to inject page-specific context, with null checks
  const pageContext = {
    prompt: PromptManager.generatePrompt({
      currentPage: '/users',
      availableActions: [
        'Add new user',
        'Search users',
        'Update user information',
        'Deactivate user'
      ],
      userData: {
        role: 'admin',
        permissions: ['manage_users', 'view_users']
      },
      companyData: selectedCompany ? {
        name: selectedCompany.company,
        type: selectedCompany.type,
        employeeCount: users.length
      } : undefined
    })
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold">Users</h1>
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700"
          >
            <FiUserPlus size={20} />
            Add new user
          </button>
        </div>

        {/* Add User Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-[600px]">
              <h2 className="text-xl font-semibold mb-4">Add New User</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">First Name</label>
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
                    <label className="block text-sm font-medium text-gray-700">Middle Name</label>
                    <input
                      type="text"
                      name="middleName"
                      value={formData.middleName}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Last Name</label>
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
                    <label className="block text-sm font-medium text-gray-700">Email</label>
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
                    <label className="block text-sm font-medium text-gray-700">Phone Number</label>
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
                    <label className="block text-sm font-medium text-gray-700">Date of Join</label>
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
                    <label className="block text-sm font-medium text-gray-700">Job Title</label>
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
                    className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700"
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
          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4 font-medium text-gray-600">Name</th>
                  <th className="text-left p-4 font-medium text-gray-600">Email</th>
                  <th className="text-left p-4 font-medium text-gray-600">Job Title</th>
                  <th className="text-left p-4 font-medium text-gray-600">Worker Type</th>
                  <th className="text-left p-4 font-medium text-gray-600">Join Date</th>
                  <th className="text-left p-4 font-medium text-gray-600">KYC Status</th>
                </tr>
              </thead>
              <tbody>
                {users.length > 0 ? (
                  users.map((user) => (
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
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center py-4 text-gray-500">
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersPage;
