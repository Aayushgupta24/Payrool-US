import React, { useState } from 'react';
import { useCopilot } from '../hooks/useCopilot';

const UserCount: React.FC = () => {
  const { askCopilot, isLoading } = useCopilot();
  const [count, setCount] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleGetCount = async () => {
    try {
      setError('');
      const response = await askCopilot('How many employees do we have?');
      setCount(response.response);
    } catch (err) {
      setError('Failed to fetch user count. Please ensure you are logged in and have selected a company.');
    }
  };

  return (
    <div className="p-4">
      <button 
        onClick={handleGetCount}
        disabled={isLoading}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        {isLoading ? 'Loading...' : 'Get User Count'}
      </button>
      
      {count && <div className="mt-4">{count}</div>}
      {error && <div className="mt-4 text-red-500">{error}</div>}
    </div>
  );
};

export default UserCount;