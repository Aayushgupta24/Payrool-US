import React from 'react';
import { PayrollInfo } from '../types';

interface PayrollDetailsProps {
  nextPayroll: PayrollInfo;
  lastPayroll: PayrollInfo;
}

const PayrollDetails: React.FC<PayrollDetailsProps> = ({ nextPayroll, lastPayroll }) => {
  return (
    <div className="mt-8">
      <h2 className="text-xl font-medium mb-4">Payroll details</h2>
      <div className="border-t border-gray-200 mb-6"></div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-gray-700 font-medium mb-2">{nextPayroll.title}</h3>
          {nextPayroll.details && <p className="text-gray-500">{nextPayroll.details}</p>}
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-gray-700 font-medium mb-2">{lastPayroll.title}</h3>
          {lastPayroll.details && <p className="text-gray-500">{lastPayroll.details}</p>}
        </div>
      </div>
    </div>
  );
};

export default PayrollDetails;