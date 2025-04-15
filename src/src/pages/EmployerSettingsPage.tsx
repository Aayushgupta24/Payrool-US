import React, { useState } from 'react';

interface User {
  name: string;
  businessPhone: string;
  businessEmail: string;
  dateAdded: string;
  role: string;
}

interface NewUserForm {
  firstName: string;
  middleName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  roles: {
    beneficialOwner: boolean;
    bookkeeper: boolean;
    payrollAdmin: boolean;
  };
}

const EmployerSettingsPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([
    {
      name: 'Tex James',
      businessPhone: '(854) 589-6555',
      businessEmail: 'texjames09@mailsac.com',
      dateAdded: '05/22/2024',
      role: 'Beneficial Owner'
    }
  ]);

  const [activeTab, setActiveTab] = useState('Users');
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserForm, setNewUserForm] = useState<NewUserForm>({
    firstName: '',
    middleName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    roles: {
      beneficialOwner: false,
      bookkeeper: false,
      payrollAdmin: false
    }
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setNewUserForm(prev => ({
        ...prev,
        roles: {
          ...prev.roles,
          [name]: checked
        }
      }));
    } else {
      setNewUserForm(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleAddUser = () => {
    // Handle form submission here
    setShowAddUserModal(false);
    // Reset form
    setNewUserForm({
      firstName: '',
      middleName: '',
      lastName: '',
      phoneNumber: '',
      email: '',
      roles: {
        beneficialOwner: false,
        bookkeeper: false,
        payrollAdmin: false
      }
    });
  };

  const AddUserModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 w-[600px] max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-semibold mb-6">Add New User</h2>
        <form className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">First name</label>
            <input
              type="text"
              name="firstName"
              value={newUserForm.firstName}
              onChange={handleInputChange}
              placeholder="Enter first name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Middle name</label>
            <input
              type="text"
              name="middleName"
              value={newUserForm.middleName}
              onChange={handleInputChange}
              placeholder="Enter middle name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Last name</label>
            <input
              type="text"
              name="lastName"
              value={newUserForm.lastName}
              onChange={handleInputChange}
              placeholder="Enter last name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone number</label>
            <input
              type="tel"
              name="phoneNumber"
              value={newUserForm.phoneNumber}
              onChange={handleInputChange}
              placeholder="Enter phone number"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={newUserForm.email}
              onChange={handleInputChange}
              placeholder="Enter email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">What is their role?</label>
            <p className="text-sm text-gray-500 mb-3">Select all that apply</p>
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="beneficialOwner"
                  checked={newUserForm.roles.beneficialOwner}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-teal-600 border-gray-300 rounded"
                />
                <span className="ml-2">Beneficial owner (owns 25% of Entity)</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="bookkeeper"
                  checked={newUserForm.roles.bookkeeper}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-teal-600 border-gray-300 rounded"
                />
                <span className="ml-2">Bookkeeper</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="payrollAdmin"
                  checked={newUserForm.roles.payrollAdmin}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-teal-600 border-gray-300 rounded"
                />
                <span className="ml-2">Payroll admin</span>
              </label>
            </div>
          </div>

          <button
            type="button"
            onClick={handleAddUser}
            className="w-full bg-teal-600 text-white py-3 rounded-md hover:bg-teal-700 transition-colors"
          >
            Done
          </button>
        </form>
      </div>
    </div>
  );

  return (
    <div className="p-8">
      {/* Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <div className="flex space-x-4">
          <button
            className={`py-4 px-6 font-semibold text-sm ${
              activeTab === 'Users'
                ? 'text-white bg-teal-600 rounded-t-lg'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('Users')}
          >
            Users
          </button>
          <button
            className={`py-4 px-6 font-semibold text-sm ${
              activeTab === 'Payment details'
                ? 'text-white bg-teal-600 rounded-t-lg'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('Payment details')}
          >
            Payment details
          </button>
        </div>
      </div>

      {/* Users Content */}
      {activeTab === 'Users' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-semibold">Users</h1>
            <button
              className="px-4 py-2 text-sm font-medium text-teal-600 border border-teal-600 rounded-md hover:bg-teal-50"
              onClick={() => setShowAddUserModal(true)}
            >
              Add new user
            </button>
          </div>

          <p className="text-gray-600 mb-8">
            You can add beneficial owners, payroll admins, and accountant / bookkeepers here.
          </p>

          {/* Users Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Name</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Business phone number</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Business email</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Date added</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Role</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900"></th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={index} className="border-b border-gray-200">
                    <td className="py-4 px-4">{user.name}</td>
                    <td className="py-4 px-4">{user.businessPhone}</td>
                    <td className="py-4 px-4">{user.businessEmail}</td>
                    <td className="py-4 px-4">{user.dateAdded}</td>
                    <td className="py-4 px-4">{user.role}</td>
                    <td className="py-4 px-4">
                      <button
                        className="text-gray-400 hover:text-gray-600"
                        onClick={() => {/* Handle more options */}}
                      >
                        ⋮
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
            <span>1-1 of 1</span>
            <div className="flex space-x-2">
              <button className="p-1" disabled>←</button>
              <button className="p-1" disabled>→</button>
            </div>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {showAddUserModal && <AddUserModal />}

      {/* Payment details Content */}
      {activeTab === 'Payment details' && (
        <div>
          <h1 className="text-2xl font-semibold">Payment details</h1>
          {/* Add payment details content here */}
        </div>
      )}
    </div>
  );
};

export default EmployerSettingsPage;
