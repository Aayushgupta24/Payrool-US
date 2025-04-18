import express from 'express';
import dotenv from 'dotenv';
import plaidRoutes from './routes/plaid';
import cors from 'cors';
import path from 'path';

// Load environment variables from the local .env file
dotenv.config();

// Log environment variables for debugging (excluding secrets)
console.log('Environment loaded:', {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  PLAID_ENV: process.env.VITE_PLAID_ENV,
  // Don't log secrets
  PLAID_CLIENT_ID_SET: !!process.env.VITE_PLAID_CLIENT_ID,
  PLAID_SECRET_SET: !!process.env.VITE_PLAID_SECRET,
  WEBHOOK_URL_SET: !!process.env.VITE_PLAID_WEBHOOK_URL
});

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Update the route to use employer/payroll prefix
app.use('/employer/payroll', plaidRoutes);

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).send({ error: 'Something broke!', details: err.message });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
