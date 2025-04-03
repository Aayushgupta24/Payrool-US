import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Employee {
  id: string;
  name: string;
  details: {
    tasks: Array<{
      id: string;
      title: string;
      status: string;
      dueDate: string;
    }>;
    payroll: {
      nextPayDate: string;
      nextPayAmount: string;
      lastPayDate: string;
      lastPayAmount: string;
    };
  };
}

const mockEmployees: Employee[] = [
  {
    id: '1',
    name: 'John Doe',
    details: {
      tasks: [
        {
          id: 't1',
          title: 'Complete W-4 Form',
          status: 'pending',
          dueDate: '2024-03-15'
        },
        {
          id: 't2',
          title: 'Submit timesheet',
          status: 'pending',
          dueDate: '2024-03-10'
        }
      ],
      payroll: {
        nextPayDate: 'March 15, 2024',
        nextPayAmount: '$3,500.00',
        lastPayDate: 'February 29, 2024',
        lastPayAmount: '$3,500.00'
      }
    }
  }
  // Add more employees as needed
];

const EmployeeDashboard: React.FC = () => {
  const [selectedEmployee, setSelectedEmployee] = useState('1');
  const employee = mockEmployees.find(emp => emp.id === selectedEmployee);

  return (
    <div className="flex-1 p-8 bg-gray-50">
      {!employee ? (
        <div className="text-center text-gray-500">
          No employee found
        </div>
      ) : (
        <div>
          <h1 className="text-2xl font-medium mb-8">{employee.name}</h1>
          
          {/* Tasks Section */}
          <div className="mb-8">
            <h2 className="text-xl font-medium mb-4">Tasks</h2>
            <div className="border-t border-gray-200 mb-6"></div>
            <div className="space-y-4">
              {employee.details.tasks.map(task => (
                <div key={task.id} className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">{task.title}</h3>
                    <span className="text-sm text-gray-500">Due: {task.dueDate}</span>
                  </div>
                  <span className="inline-block mt-2 px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
                    {task.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Payroll Section */}
          <div>
            <h2 className="text-xl font-medium mb-4">Payroll</h2>
            <div className="border-t border-gray-200 mb-6"></div>
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Next payroll</h3>
                <p className="text-2xl font-semibold">{employee.details.payroll.nextPayAmount}</p>
                <p className="text-sm text-gray-500 mt-1">{employee.details.payroll.nextPayDate}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Last payroll</h3>
                <p className="text-2xl font-semibold">{employee.details.payroll.lastPayAmount}</p>
                <p className="text-sm text-gray-500 mt-1">{employee.details.payroll.lastPayDate}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeDashboard;
