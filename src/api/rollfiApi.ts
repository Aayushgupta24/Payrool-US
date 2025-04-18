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

  const { data } = await axios.get(
    `${ROLLFI_BASE_URL}/reports`,
    {
      data: payload,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
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
    users
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
  return addUsers(companyId, [user]);
};

// Get user details
export const getUserDetails = async (userId: string, companyId: string) => {
  const token = await getAccessToken();

  const response = await axios({
    method: 'get',
    url: 'https://sandbox.rollfi.xyz/reports',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    data: {
      method: 'getUser',
      userId,
      companyId
    }
  });

  return response.data;
};

// Add this new function to fetch active users
export const getActiveUsers = async (companyId: string, workerType: 'W2' | '1099' = 'W2') => {
  const token = await getAccessToken();

  const payload = {
    method: 'getActiveUsers',
    companyId,
    workerType
  };

  const { data } = await axios({
    method: 'get',
    url: `${ROLLFI_BASE_URL}/reports`,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    data: payload
  });

  return data;
};
