import React, { useState } from 'react';
import AddTeamMemberModal from '../components/AddTeamMemberModal';

interface TeamMember {
  name: string;
  workerType: string;
  phone: string;
  startDate: string;
  status: string;
}

const HiringPage: React.FC = () => {
  const [showAddTeamMemberModal, setShowAddTeamMemberModal] = useState(false);

  const teamMembers: TeamMember[] = [
    {
      name: "Kamal Patel",
      workerType: "1099-NEC",
      phone: "(222) 222-2222",
      startDate: "08/01/2024",
      status: "In progress"
    },
    {
      name: "Russell Washington",
      workerType: "W2",
      phone: "(845) 837-7575",
      startDate: "04/08/2024",
      status: "In progress"
    },
    {
      name: "Zona Johnson",
      workerType: "W2",
      phone: "(555) 467-7890",
      startDate: "01/15/2024",
      status: "In progress"
    },
    {
      name: "Louis Piper",
      workerType: "1099-NEC",
      phone: "(333) 287-3983",
      startDate: "12/12/2023",
      status: "In progress"
    },
    {
      name: "Elijah Miller",
      workerType: "W2",
      phone: "(322) 202-1202",
      startDate: "02/02/2020",
      status: "In progress"
    },
    {
      name: "Peter John",
      workerType: "W2",
      phone: "(787) 788-7877",
      startDate: "01/01/2024",
      status: "In progress"
    }
  ];

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Hiring and Onboarding</h1>
        <button 
          onClick={() => setShowAddTeamMemberModal(true)}
          className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 flex items-center"
        >
          Add team member
        </button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-4 px-6">Name</th>
              <th className="text-left py-4 px-6">Worker type</th>
              <th className="text-left py-4 px-6">Phone</th>
              <th className="text-left py-4 px-6">Start date</th>
              <th className="text-left py-4 px-6">Status</th>
            </tr>
          </thead>
          <tbody>
            {teamMembers.map((member, index) => (
              <tr key={index} className="border-b hover:bg-gray-50">
                <td className="py-4 px-6">{member.name}</td>
                <td className="py-4 px-6">{member.workerType}</td>
                <td className="py-4 px-6">{member.phone}</td>
                <td className="py-4 px-6">{member.startDate}</td>
                <td className="py-4 px-6">
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                    {member.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="p-4 border-t flex justify-between items-center text-sm text-gray-500">
          <div>1-6 of 6</div>
          <div className="flex space-x-2">
            <button className="p-1 rounded hover:bg-gray-100" disabled>
              &lt;
            </button>
            <button className="p-1 rounded hover:bg-gray-100" disabled>
              &gt;
            </button>
          </div>
        </div>
      </div>

      <AddTeamMemberModal 
        isOpen={showAddTeamMemberModal}
        onClose={() => setShowAddTeamMemberModal(false)}
      />
    </div>
  );
};

export default HiringPage;

