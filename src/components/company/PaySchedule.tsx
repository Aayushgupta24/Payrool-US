import React from 'react';

interface PayScheduleRecord {
  workerType: string;
  status: string;
  compensationFrequency: string;
  paymentMode: string;
  startDate: string;
  endDate?: string;
}

const PaySchedule: React.FC = () => {
  const scheduleData: PayScheduleRecord[] = [
    {
      workerType: 'W2',
      status: 'Active',
      compensationFrequency: 'BiWeekly',
      paymentMode: 'Automatic',
      startDate: '07/19/2024',
    },
    {
      workerType: '1099-NEC',
      status: 'Active',
      compensationFrequency: 'BiWeekly',
      paymentMode: 'Automatic',
      startDate: '07/19/2024',
    },
  ];

  return (
    <div className="p-6">
      <div className="bg-white rounded-lg">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 px-4">Worker Type</th>
              <th className="text-left py-3 px-4">Status</th>
              <th className="text-left py-3 px-4">Compensation Frequency</th>
              <th className="text-left py-3 px-4">Payment Mode</th>
              <th className="text-left py-3 px-4">Start Date</th>
              <th className="text-left py-3 px-4">End Date</th>
            </tr>
          </thead>
          <tbody>
            {scheduleData.map((record, index) => (
              <tr key={index} className="border-b">
                <td className="py-4 px-4">{record.workerType}</td>
                <td className="py-4 px-4">
                  <span className={`px-2 py-1 rounded-full text-sm ${
                    record.status === 'Active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {record.status}
                  </span>
                </td>
                <td className="py-4 px-4">{record.compensationFrequency}</td>
                <td className="py-4 px-4">{record.paymentMode}</td>
                <td className="py-4 px-4">{record.startDate}</td>
                <td className="py-4 px-4">{record.endDate || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex items-center justify-between p-4 border-t">
          <div className="text-sm text-gray-600">1-2 of 2</div>
          <div className="flex space-x-2">
            <button className="p-1 rounded hover:bg-gray-100">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button className="p-1 rounded hover:bg-gray-100">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaySchedule;