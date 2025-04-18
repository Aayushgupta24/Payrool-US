import axios from 'axios';
import { getAccessToken } from '../utils/auth';
import { User, DeactivateUserPayload } from '../types/user';

const ROLLFI_BASE_URL = import.meta.env.VITE_API_URL;

// Company related endpoints
export const updateCompanyWebsite = async (companyId: string, newWebsite: string) => {
  const token = await getAccessToken();

  const payload = {
    method: 'updateCompany',
    company: {
      companyId,
      businessWebsite: newWebsite,
    },
  };

  const { data } = await axios.put(
    `${ROLLFI_BASE_URL}/companyOnboarding`,
    payload,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return data;
};

// Get users by company name
export const getUsersByCompanyName = async (companyName: string) => {
  const token = await getAccessToken();

  const payload = {
    method: 'getUsersByCompanyName',
    companyName
  };

  // Using POST with the correct URL format as shown in the curl example
  const { data } = await axios.post(
    `${ROLLFI_BASE_URL}/reports`,
    payload,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      }
    }
  );

  return data;
};

// Add multiple users
export const addUsers = async (companyId: string, users: User[]) => {
  const token = await getAccessToken();

  const payload = {
    method: 'addUsers',
    companyId,
    users // Send users without encoding
  };

  const { data } = await axios.post(
    `${ROLLFI_BASE_URL}/adminPortal`,
    payload,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return data;
};

// Deactivate a user
export const deactivateUser = async (user: DeactivateUserPayload) => {
  const token = await getAccessToken();

  const payload = {
    method: 'deactivateUser',
    user
  };

  const { data } = await axios.post(
    `${ROLLFI_BASE_URL}/adminPortal`,
    payload,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return data;
};

// Helper function to add a single user
export const addSingleUser = async (companyId: string, user: User) => {
  try {
    const token = await getAccessToken();
    
    const payload = {
      method: 'addUser',
      user: {
        ...user,
        companyId,
        code: user.code.toUpperCase()
      }
    };
    
    console.log('Sending payload:', payload);
    
    const { data } = await axios.post(
      `${ROLLFI_BASE_URL}/adminPortal`,
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );
    
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};
