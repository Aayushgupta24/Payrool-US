import axios from 'axios';

const API_BASE = '/employer/payroll';

export const plaidService = {
  async createLinkToken() {
    // Check if we're using placeholder credentials
    const clientId = import.meta.env.VITE_PLAID_CLIENT_ID;
    const secret = import.meta.env.VITE_PLAID_SECRET;
    
    if (clientId === 'your_client_id' || secret === 'your_secret') {
      console.log('Using placeholder Plaid credentials in plaidService. In a real app, you would need to use valid Plaid API credentials.');
      // For demo purposes, simulate a successful API call
      return new Promise<string>((resolve) => {
        setTimeout(() => {
          resolve('mock_link_token_for_demo');
        }, 500);
      });
    }
    
    try {
      console.log('Requesting link token from:', `${API_BASE}/create-link-token`);
      const response = await axios.post(`${API_BASE}/create-link-token`);
      console.log('Link token response:', response.data);
      if (!response.data.link_token) {
        throw new Error('No link token received from server');
      }
      return response.data.link_token;
    } catch (error: any) {
      console.error('Error creating link token:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        statusText: error.response?.statusText,
        headers: error.response?.headers,
      });
      throw new Error(error.response?.data?.error || 'Failed to create link token');
    }
  },

  async exchangePublicToken(publicToken: string) {
    // Check if we're using placeholder credentials or mock token
    const clientId = import.meta.env.VITE_PLAID_CLIENT_ID;
    const secret = import.meta.env.VITE_PLAID_SECRET;
    
    if (clientId === 'your_client_id' || secret === 'your_secret' || publicToken === 'mock_link_token_for_demo') {
      console.log('Using placeholder Plaid credentials in exchangePublicToken. Returning mock access token.');
      // For demo purposes, simulate a successful API call
      return new Promise<string>((resolve) => {
        setTimeout(() => {
          resolve('mock_access_token_for_demo');
        }, 500);
      });
    }
    
    try {
      const response = await axios.post(`${API_BASE}/exchange-token`, {
        public_token: publicToken
      });
      return response.data.access_token;
    } catch (error: any) {
      console.error('Error exchanging public token:', {
        message: error.message,
        response: error.response?.data,
      });
      throw new Error(error.response?.data?.error || 'Failed to exchange token');
    }
  },

  async getPayrollData(accessToken: string) {
    // Check if we're using placeholder credentials or mock token
    const clientId = import.meta.env.VITE_PLAID_CLIENT_ID;
    const secret = import.meta.env.VITE_PLAID_SECRET;
    
    if (clientId === 'your_client_id' || secret === 'your_secret' || accessToken === 'mock_access_token_for_demo') {
      console.log('Using placeholder Plaid credentials in getPayrollData. Returning mock payroll data.');
      // For demo purposes, return enhanced mock payroll data
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            employer: {
              name: 'Growth Pods Inc.',
              address: {
                city: 'San Francisco',
                state: 'CA',
                street: '123 Innovation St',
                zip: '94105'
              }
            },
            employee: {
              name: 'Demo User',
              address: {
                city: 'San Francisco',
                state: 'CA',
                street: '456 Tech Ave',
                zip: '94105'
              },
              ssn: 'XXX-XX-1234'
            },
            income: {
              rate: 95000,
              pay_annual: 95000,
              pay_period: 'yearly',
              pay_frequency: 'biweekly',
              next_pay_date: '2024-10-15'
            }
          });
        }, 500);
      });
    }
    
    try {
      const response = await axios.post(`${API_BASE}/payroll-data`, {
        access_token: accessToken
      });
      return response.data;
    } catch (error: any) {
      console.error('Error getting payroll data:', error);
      throw new Error(error.response?.data?.error || 'Failed to get payroll data');
    }
  }
};
