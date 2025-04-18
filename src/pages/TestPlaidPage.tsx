import React, { useState } from 'react';
import { PlaidLinkButton } from '../components/PlaidLink';
import { plaidService } from '../services/plaidService';

const TestPlaidPage: React.FC = () => {
  const [payrollData, setPayrollData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handlePlaidSuccess = async (accessToken: string) => {
    try {
      console.log('Plaid success with access token:', accessToken);
      
      // Get payroll data using the access token
      const data = await plaidService.getPayrollData(accessToken);
      setPayrollData(data);
      console.log('Payroll data received:', data);
    } catch (err: any) {
      console.error('Error handling Plaid success:', err);
      setError(err.message || 'Failed to get payroll data');
    }
  };

  const handlePlaidExit = () => {
    console.log('Plaid connection cancelled or exited');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Test Plaid Integration</h1>
      
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="text-center py-6">
          <h2 className="text-xl font-semibold mb-4">Connect Your Payroll Provider</h2>
          <p className="text-gray-500 mb-6">
            This is a test page for the Plaid integration. Click the button below to connect your payroll provider.
          </p>
          
          <PlaidLinkButton 
            onSuccess={handlePlaidSuccess} 
            onExit={handlePlaidExit} 
          />
          
          {error && (
            <div className="mt-4 p-3 bg-red-100 text-red-700 rounded">
              Error: {error}
            </div>
          )}
        </div>
        
        {payrollData && (
          <div className="mt-6 border-t pt-6">
            <h3 className="text-lg font-medium mb-4">Payroll Data Retrieved:</h3>
            <pre className="bg-gray-100 p-4 rounded overflow-auto">
              {JSON.stringify(payrollData, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestPlaidPage;
