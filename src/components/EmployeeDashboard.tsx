import React from 'react';
import TaskCard from './TaskCard';
import PayrollDetails from './PayrollDetails';
import { Task, PayrollInfo } from '../types';

interface EmployeeDashboardProps {
  username: string;
}

const EmployeeDashboard: React.FC<EmployeeDashboardProps> = ({ username }) => {
  const tasks: Task[] = [
    {
      id: '1',
      title: 'Link direct deposit account',
      description: 'Connect your direct deposit account',
      icon: 'document'
    },
    {
      id: '2',
      title: 'Complete Federal W-4',
      description: 'Complete your federal tax holding forms',
      icon: 'document'
    },
    {
      id: '3',
      title: 'Complete state W-4',
      description: 'Complete your state tax holding forms',
      icon: 'document'
    }
  ];

  const payrollInfo: { next: PayrollInfo; last: PayrollInfo } = {
    next: {
      title: 'Next payroll',
    },
    last: {
      title: 'Last payroll',
    }
  };

  return (
    <div className="flex-1 p-8">
      <h1 className="text-2xl font-medium mb-8">{username}</h1>
      
      <h2 className="text-xl font-medium mb-4">Tasks</h2>
      <div className="border-t border-gray-200 mb-6"></div>
      
      <div className="space-y-4">
        {tasks.map(task => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
      
      <PayrollDetails 
        nextPayroll={payrollInfo.next}
        lastPayroll={payrollInfo.last}
      />
    </div>
  );
};

export default EmployeeDashboard;