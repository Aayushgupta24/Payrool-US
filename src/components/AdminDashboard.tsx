import React from 'react';
import StatsCard from './StatsCard';
import { StatsCard as StatsCardType } from '../types';

interface AdminDashboardProps {
  username: string;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ username }) => {
  const stats: StatsCardType[] = [
    { title: 'Company Selection', value: '' },
    { title: 'Number of Companies', value: 18 },
    { title: 'Number of Active People', value: 25 }
  ];

  return (
    <div className="flex-1 p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-medium">Welcome {username}</h1>
        <button className="bg-white border border-teal-600 text-teal-600 px-4 py-2 rounded hover:bg-teal-50">
          Add New Company
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-gray-500 text-sm font-medium mb-2">{stats[0].title}</h3>
          <div className="relative">
            <select className="w-full border border-gray-300 p-2 rounded appearance-none pr-8">
              <option>Select</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path>
              </svg>
            </div>
          </div>
        </div>
        {stats.slice(1).map((stat, index) => (
          <StatsCard key={index} stats={stat} />
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;