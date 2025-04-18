import React from 'react';
import { usePlaidLink } from 'react-plaid-link';
import { plaidService } from '../services/plaidService';

interface PlaidLinkButtonProps {
  onSuccess?: (publicToken: string) => void;
  onExit?: () => void;
  className?: string;
  children?: React.ReactNode;
}

export const PlaidLinkButton: React.FC<PlaidLinkButtonProps> = ({
  onSuccess,
  onExit,
  className,
  children
}) => {
  const [linkToken, setLinkToken] = React.useState<string | null>(null);

  React.useEffect(() => {
    const createLinkToken = async () => {
      try {
        const token = await plaidService.createLinkToken();
        setLinkToken(token);
      } catch (error) {
        console.error('Error creating link token:', error);
      }
    };
    createLinkToken();
  }, []);

  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess: (public_token) => {
      onSuccess?.(public_token);
    },
    onExit: () => {
      onExit?.();
    },
  });

  return (
    <button
      onClick={() => open()}
      disabled={!ready}
      className={`px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors ${className}`}
    >
      {children || 'Connect Bank Account'}
    </button>
  );
};