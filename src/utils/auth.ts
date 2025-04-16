import axios from 'axios';
import { utf8ToBase64 } from './base64';

const ROLLFI_BASE_URL = import.meta.env.VITE_API_URL;
const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
const CLIENT_SECRET = import.meta.env.VITE_CLIENT_SECRET;

export const getAccessToken = async () => {
  const credentials = `${CLIENT_ID}:${CLIENT_SECRET}`;
  const auth = utf8ToBase64(credentials);

  try {
    const response = await axios.post(
      `${ROLLFI_BASE_URL}/oauth/token`,
      'grant_type=client_credentials',
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${auth}`,
        },
      }
    );

    return response.data.access_token;
  } catch (error) {
    console.error('Error getting access token:', error);
    throw new Error('Failed to authenticate');
  }
};
