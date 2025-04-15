import React from 'react';
import { useSmartNavigation } from '../hooks/useSmartNavigation';

interface Paystub {
  id: string;
  payPeriod: string;
  grossPay: number;
  netPay: number;
  payDate: string;
}

const PaystubsPage: React.FC = () => {
  useSmartNavigation();
  // Mock data - replace with actual API call
  const paystubs: Paystub[] = [
    {
      id: '1',
      payPeriod: 'Jan 1-15, 2024',
      grossPay: 3000,
      netPay: 2400,
      payDate: '2024-01-20'
    }
  ];

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Paystubs</h1>
      <div className="bg-white rounded-lg shadow">
        <div className="grid grid-cols-4 p-4 font-medium text-gray-700 border-b">
          <div>Pay Period</div>
          <div>Gross Pay</div>
          <div>Net Pay</div>
          <div>Pay Date</div>
        </div>
        {paystubs.map(paystub => (
          <div key={paystub.id} className="grid grid-cols-4 p-4 border-b hover:bg-gray-50">
            <div>{paystub.payPeriod}</div>
            <div>${paystub.grossPay.toFixed(2)}</div>
            <div>${paystub.netPay.toFixed(2)}</div>
            <div>{paystub.payDate}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaystubsPage;
