import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import { FiUserPlus } from 'react-icons/fi';
import api from '../services/apiConfig'; // Import the configured api instance

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

const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const selectedCompanyStr = localStorage.getItem('selectedCompany');
        if (!selectedCompanyStr) {
          throw new Error('No company selected');
        }

        const selectedCompany = JSON.parse(selectedCompanyStr);
        
        // Use the configured api instance instead of fetch
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

    fetchUsers();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold">Users</h1>
          <button className="flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700">
            <FiUserPlus size={20} />
            Add new user
          </button>
        </div>

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
