import express from 'express';
import { Configuration, PlaidApi, PlaidEnvironments, Products, CountryCode } from 'plaid';

const router = express.Router();

// Use hardcoded values for development - these are dummy values, replace with real ones from Plaid Dashboard
const PLAID_CLIENT_ID = process.env.VITE_PLAID_CLIENT_ID || 'your_client_id';
const PLAID_SECRET = process.env.VITE_PLAID_SECRET || 'your_secret';
const PLAID_ENV = process.env.VITE_PLAID_ENV || 'sandbox';
const PLAID_WEBHOOK_URL = process.env.VITE_PLAID_WEBHOOK_URL || 'http://localhost:3000/employer/payroll/webhook';

console.log('Plaid configuration:', {
  env: PLAID_ENV,
  clientIdSet: !!PLAID_CLIENT_ID,
  secretSet: !!PLAID_SECRET,
  webhookSet: !!PLAID_WEBHOOK_URL
});

const configuration = new Configuration({
  basePath: PlaidEnvironments[PLAID_ENV as keyof typeof PlaidEnvironments],
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': PLAID_CLIENT_ID,
      'PLAID-SECRET': PLAID_SECRET,
    },
  },
});

const plaidClient = new PlaidApi(configuration);

router.post('/create-link-token', async (req, res) => {
  try {
    // Check if we're using placeholder credentials
    if (PLAID_CLIENT_ID === 'your_client_id' || PLAID_SECRET === 'your_secret') {
      console.log('Using placeholder Plaid credentials. Returning mock link token.');
      // For demo purposes, return a mock link token
      return res.json({ link_token: 'mock_link_token_for_demo_server' });
    }
    
    console.log('Creating link token with config:', {
      clientId: PLAID_CLIENT_ID.substring(0, 5) + '...',
      secretSet: !!PLAID_SECRET,
      env: PLAID_ENV,
      webhook: PLAID_WEBHOOK_URL
    });
    
    const response = await plaidClient.linkTokenCreate({
      user: { client_user_id: 'user-' + Date.now() },
      client_name: 'RollFi Payroll',
      products: ['payroll_income' as Products],
      country_codes: ['US' as CountryCode],
      language: 'en',
      webhook: PLAID_WEBHOOK_URL,
    });

    console.log('Link token created successfully:', response.data.link_token.substring(0, 10) + '...');
    res.json({ link_token: response.data.link_token });
  } catch (error: any) {
    console.error('Error creating link token:', error.response?.data || error);
    res.status(500).json({ 
      error: 'Failed to create link token',
      details: error.response?.data || error.message
    });
  }
});

router.post('/exchange-token', async (req, res) => {
  try {
    console.log('Exchanging public token...');
    const { public_token } = req.body;

    if (!public_token) {
      return res.status(400).json({ error: 'Missing public_token in request body' });
    }

    // Check if we're using placeholder credentials or mock token
    if (PLAID_CLIENT_ID === 'your_client_id' || PLAID_SECRET === 'your_secret' || 
        public_token === 'mock_link_token_for_demo' || public_token === 'mock_link_token_for_demo_server') {
      console.log('Using placeholder Plaid credentials or mock token. Returning mock access token.');
      return res.json({ access_token: 'mock_access_token_for_demo_server' });
    }

    const response = await plaidClient.itemPublicTokenExchange({
      public_token: public_token
    });

    console.log('Token exchanged successfully');
    res.json({ access_token: response.data.access_token });
  } catch (error: any) {
    console.error('Error exchanging public token:', error.response?.data || error);
    res.status(500).json({ 
      error: 'Failed to exchange token',
      details: error.response?.data || error.message
    });
  }
});

router.post('/webhook', async (req, res) => {
  try {
    console.log('Received webhook from Plaid:', req.body);
    
    // Process the webhook based on its type
    const { webhook_type, webhook_code } = req.body;
    
    // Handle different webhook types
    switch (webhook_type) {
      case 'INCOME':
        console.log('Income webhook received:', webhook_code);
        // Process income-related webhook
        break;
      case 'ITEM':
        console.log('Item webhook received:', webhook_code);
        // Process item-related webhook
        break;
      default:
        console.log('Unhandled webhook type:', webhook_type);
    }
    
    // Acknowledge receipt of webhook
    res.status(200).json({ received: true });
  } catch (error: any) {
    console.error('Error processing webhook:', error);
    res.status(500).json({ error: 'Failed to process webhook' });
  }
});

router.post('/payroll-data', async (req, res) => {
  try {
    console.log('Fetching payroll data...');
    const { access_token } = req.body;

    if (!access_token) {
      return res.status(400).json({ error: 'Missing access_token in request body' });
    }

    // Check if we're using placeholder credentials or mock token
    if (PLAID_CLIENT_ID === 'your_client_id' || PLAID_SECRET === 'your_secret' || 
        access_token === 'mock_access_token_for_demo' || access_token === 'mock_access_token_for_demo_server') {
      console.log('Using placeholder Plaid credentials or mock token. Returning mock payroll data.');
      
      // Return enhanced mock data for demo purposes
      return res.json({
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
    }

    // Here you would typically make a call to Plaid's API to fetch payroll data
    // For example: const payrollData = await plaidClient.somePayrollEndpoint({ access_token });
    
    // For now, we'll return mock data
    const mockPayrollData = {
      employer: {
        name: 'Acme Inc.',
        address: {
          city: 'San Francisco',
          state: 'CA',
          street: '123 Main St',
          zip: '94105'
        }
      },
      employee: {
        name: 'John Doe',
        address: {
          city: 'San Francisco',
          state: 'CA',
          street: '456 Market St',
          zip: '94105'
        },
        ssn: 'XXX-XX-1234'
      },
      income: {
        rate: 75000,
        pay_annual: 75000,
        pay_period: 'yearly'
      }
    };

    console.log('Payroll data fetched successfully');
    res.json(mockPayrollData);
  } catch (error: any) {
    console.error('Error fetching payroll data:', error.response?.data || error);
    res.status(500).json({ 
      error: 'Failed to fetch payroll data',
      details: error.response?.data || error.message
    });
  }
});

export default router;
