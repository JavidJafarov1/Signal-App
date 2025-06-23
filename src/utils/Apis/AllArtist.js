import axios from 'axios';
import { BASE_URL } from '../api';

export const AllArtist = async (token) => {
  try {
    const url = `${BASE_URL}/api/artists`;

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // console.log('API Raw Response:', response?.data);
    return response?.data;
  } catch (error) {
    console.error('Error fetching artists:', error?.response?.data || error);
    throw error;
  }
};


export const Profile = async (token) => {
  try {
    const url = `${BASE_URL}/api/profile`;

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('API Raw Response:', response?.data);
    return response?.data;
  } catch (error) {
    console.error('Error fetching artists:', error?.response?.data || error);
    throw error;
  }
};
