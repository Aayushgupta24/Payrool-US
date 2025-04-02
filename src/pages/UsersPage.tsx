import React from 'react';
import Sidebar from '../components/Sidebar';
import { FiUserPlus } from 'react-icons/fi';

interface User {
  name: string;
  dateAdded: string;
  role: string;
}

const UsersPage: React.FC = () => {
  const users: User[] = [
    { name: 'Raj R', dateAdded: 'Sep 19, 2024', role: 'Saas Admin' },
    { name: 'Terrance Jones', dateAdded: 'Dec 17, 2024', role: 'Account Manager' },
    { name: 'support+SandboxEzzyPayment@rolffi.xyz', dateAdded: 'Aug 5, 2024', role: 'Saas Admin' },
    { name: 'parth@ezzypayment.com', dateAdded: 'Aug 5, 2024', role: 'Saas Admin' },
    { name: 'Feba George', dateAdded: 'Dec 12, 2024', role: 'Saas Admin' },
    { name: 'Keerthika Yerravelli', dateAdded: 'Dec 12, 2024', role: 'Saas Admin' },
    { name: 'Adam Paul', dateAdded: 'Dec 17, 2024', role: 'Account Manager' },
  ];

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

        <div className="bg-white rounded-lg shadow">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-4 font-medium text-gray-600">Name</th>
                <th className="text-left p-4 font-medium text-gray-600">Date added</th>
                <th className="text-left p-4 font-medium text-gray-600">Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="p-4">{user.name}</td>
                  <td className="p-4 text-gray-600">{user.dateAdded}</td>
                  <td className="p-4 text-gray-600">{user.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UsersPage;