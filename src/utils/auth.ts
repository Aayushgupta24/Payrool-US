import axios from 'axios';

const ROLLFI_BASE_URL = import.meta.env.VITE_API_URL;
const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
const CLIENT_SECRET = import.meta.env.VITE_CLIENT_SECRET;

export const getAccessToken = async () => {
  const auth = btoa(`${CLIENT_ID}:${CLIENT_SECRET}`);

  const response = await axios.post(
    `${ROLLFI_BASE_URL}/oauth/token`,
    'grant_type=client_credentials',
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${auth}`,
      },
    }
  );

  return response.data.access_token;
};
