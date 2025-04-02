import React, { useState } from 'react';
import AddTeamMemberModal from '../components/AddTeamMemberModal';

interface TeamMember {
  name: string;
  jobTitle: string;
  startDate: string;
  workLocation: string;
}

const TeamPage: React.FC = () => {
  const [showAddTeamMemberModal, setShowAddTeamMemberModal] = useState(false);
  const [activeTab, setActiveTab] = useState('Contractors');

  const contractors: TeamMember[] = [
    {
      name: "Noya Jack",
      jobTitle: "HR",
      startDate: "02/02/2020",
      workLocation: "New York, NY"
    },
    {
      name: "xyz inc",
      jobTitle: "QA",
      startDate: "03/03/2022",
      workLocation: "New York, NY"
    }
  ];

  const employees: TeamMember[] = [
    {
      name: "Francis Thomas",
      jobTitle: "Developer",
      startDate: "05/02/2020",
      workLocation: "New York"
    },
    {
      name: "Tex James",
      jobTitle: "HR",
      startDate: "03/03/2020",
      workLocation: "New York"
    }
  ];

  const tabs = ['Employees', 'Contractors', 'Inactive employees', 'Inactive contractors'];

  const getTeamMembers = () => {
    switch (activeTab) {
      case 'Contractors':
        return contractors;
      case 'Employees':
        return employees;
      case 'Inactive employees':
      case 'Inactive contractors':
        return [];
      default:
        return [];
    }
  };

  const renderContent = () => {
    const members = getTeamMembers();
    
    if ((activeTab === 'Inactive employees' || activeTab === 'Inactive contractors') && members.length === 0) {
      return (
        <div className="text-center py-12 text-gray-500">
          No {activeTab.toLowerCase()}
        </div>
      );
    }

    return (
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left py-4 px-6">Name</th>
            <th className="text-left py-4 px-6">Job title</th>
            <th className="text-left py-4 px-6">Start date</th>
            <th className="text-left py-4 px-6">Work location</th>
          </tr>
        </thead>
        <tbody>
          {members.map((member, index) => (
            <tr key={index} className="border-b hover:bg-gray-50">
              <td className="py-4 px-6">{member.name}</td>
              <td className="py-4 px-6">{member.jobTitle}</td>
              <td className="py-4 px-6">{member.startDate}</td>
              <td className="py-4 px-6">{member.workLocation}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-4">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded ${
                activeTab === tab
                  ? 'bg-teal-600 text-white'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <button
          onClick={() => setShowAddTeamMemberModal(true)}
          className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 flex items-center"
        >
          Add team member
        </button>
      </div>

      <div className="bg-white rounded-lg shadow">
        {renderContent()}
        {getTeamMembers().length > 0 && (
          <div className="p-4 border-t flex justify-between items-center text-sm text-gray-500">
            <div>1-{getTeamMembers().length} of {getTeamMembers().length}</div>
            <div className="flex space-x-2">
              <button className="p-1 rounded hover:bg-gray-100" disabled>
                &lt;
              </button>
              <button className="p-1 rounded hover:bg-gray-100" disabled>
                &gt;
              </button>
            </div>
          </div>
        )}
      </div>

      <AddTeamMemberModal 
        isOpen={showAddTeamMemberModal}
        onClose={() => setShowAddTeamMemberModal(false)}
      />
    </div>
  );
};

export default TeamPage;


