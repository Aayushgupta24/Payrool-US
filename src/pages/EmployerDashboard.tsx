import React from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';

interface EmployerDashboardProps {}

const EmployerDashboard: React.FC<EmployerDashboardProps> = () => {
  const navigate = useNavigate();

  const menuItems = [
    { icon: '📊', label: 'Dashboard', path: '/employer/dashboard' },
    { icon: '💰', label: 'Payroll', path: '/employer/payroll' },
    { icon: '👥', label: 'Hiring and Onboarding', path: '/employer/hiring' },
    { icon: '👥', label: 'Team', path: '/employer/team' },
    { icon: '🏢', label: 'Company', path: '/employer/company' },
    { icon: '📄', label: 'Documents', path: '/employer/documents' },
    { icon: '✨', label: 'Benefits', path: '/employer/benefits' },
    { icon: '📊', label: 'Taxes and Compliance', path: '/employer/taxes' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r">
        <div className="p-6">
          <div className="mb-8">
            <img src="/growth-pods-logo.svg" alt="Growth Pods" className="h-8 mb-2" />
            <div className="text-sm text-gray-500">Hire. Pay. Manage.</div>
          </div>
          
          <div className="mb-4">
            <h2 className="text-sm font-medium text-gray-500">GrowthPods Demo</h2>
          </div>

          <nav className="space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-50 hover:text-teal-600"
              >
                <span className="mr-3">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold">Tex James</h1>
            <div className="flex space-x-4">
              <button 
                onClick={() => navigate('/employer/team/add')}
                className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Add team member
              </button>
              <button 
                className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700"
              >
                Pay contractors
              </button>
              <button 
                className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700"
              >
                Pay employees
              </button>
            </div>
          </div>

          {/* Financial Cards */}
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-gray-500 text-sm font-medium mb-2">Bank balance</h3>
              <p className="text-3xl font-bold text-teal-600">$280,000.00</p>
              <p className="text-sm text-gray-500 mt-2">Last updated on 12/18/2024</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-gray-500 text-sm font-medium mb-2">Next payroll</h3>
              <p className="text-3xl font-bold text-teal-600">$4,046.15</p>
              <p className="text-sm text-red-500 mt-2">Overdue by 217 days</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-gray-500 text-sm font-medium mb-2">Last payroll</h3>
              <p className="text-3xl font-bold text-teal-600">$11,102.05</p>
              <p className="text-sm text-gray-500 mt-2">For 12/20/2024</p>
            </div>
          </div>
        </div>

        {/* Tasks Section */}
        <div className="mt-8">
          <h2 className="text-lg font-medium mb-4">Tasks</h2>
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="bg-gray-100 p-2 rounded">📄</div>
                <div>
                  <h3 className="font-medium">Form 8655 Signature Request</h3>
                  <p className="text-sm text-gray-500">Form 8655 allows us to file and pay taxes on your behalf</p>
                </div>
              </div>
              <button className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700">
                Complete Signing
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployerDashboard;


