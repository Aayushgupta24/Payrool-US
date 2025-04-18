import { useState, useCallback, useEffect } from 'react';
import { usePlaidLink, PlaidLinkOptions } from 'react-plaid-link';
import { plaidService } from '../services/plaidService';

interface PlaidLinkButtonProps {
  onSuccess: (token: string) => void;
  onExit?: () => void;
}

export const PlaidLinkButton: React.FC<PlaidLinkButtonProps> = ({ onSuccess, onExit }) => {
  const [linkToken, setLinkToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMockMode, setIsMockMode] = useState(false);

  useEffect(() => {
    const initializePlaid = async () => {
      try {
        setIsLoading(true);
        
        // Check if we're using placeholder credentials
        const clientId = import.meta.env.VITE_PLAID_CLIENT_ID;
        const secret = import.meta.env.VITE_PLAID_SECRET;
        
        if (clientId === 'your_client_id' || secret === 'your_secret') {
          console.log('Using placeholder Plaid credentials. Using mock mode for demo purposes.');
          // For demo purposes, set mock mode and use a mock token
          setIsMockMode(true);
          setLinkToken('mock_link_token_for_demo');
          setError(null);
          setIsLoading(false);
          return;
        }
        
        // If we have real credentials, proceed with the actual API call
        const token = await plaidService.createLinkToken();
        setLinkToken(token);
        setError(null);
      } catch (err) {
        console.error('Error initializing Plaid:', err);
        setError('Failed to initialize Plaid connection. Please check your Plaid API credentials.');
      } finally {
        setIsLoading(false);
      }
    };

    initializePlaid();
  }, []);

  // Handle mock mode success directly
  const handleMockSuccess = () => {
    if (isMockMode) {
      // For mock mode, we'll use a mock access token
      onSuccess('mock_access_token_for_demo');
    }
  };

  const config: PlaidLinkOptions = {
    token: linkToken ?? '',
    onSuccess: async (public_token: string) => {
      try {
        if (isMockMode) {
          handleMockSuccess();
          return;
        }
        
        const accessToken = await plaidService.exchangePublicToken(public_token);
        onSuccess(accessToken);
      } catch (err) {
        console.error('Error in Plaid flow:', err);
        setError('Failed to complete Plaid connection');
      }
    },
    onExit: () => {
      console.log('Plaid connection cancelled');
      onExit?.();
      
      // In mock mode, we can still proceed with mock data if needed
      if (isMockMode) {
        handleMockSuccess();
      }
    },
    onLoad: () => setIsLoading(false),
    onEvent: (eventName, metadata) => {
      console.log('Plaid Event:', eventName, metadata);
    },
  };

  // In mock mode, we'll handle the flow ourselves
  const handleButtonClick = () => {
    if (isMockMode) {
      handleMockSuccess();
    } else {
      open();
    }
  };

  const { open, ready } = usePlaidLink(config);


  if (error) {
    return (
      <div className="text-center">
        <div className="text-red-600 mb-4">Error: {error}</div>
        <button
          onClick={() => window.location.reload()}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleButtonClick}
      disabled={(!ready || !linkToken || isLoading) && !isMockMode}
      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
    >
      {isLoading ? 'Loading...' : 'Connect Payroll Provider'}
    </button>
  );
};


