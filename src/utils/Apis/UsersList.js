import axios from 'axios';
import {BASE_URL} from '../api';

export const AllUsersList = async token => {
  try {
    const url = `${BASE_URL}/api/users`;

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response?.data;
  } catch (error) {
    console.error('Error fetching artists:', error?.response?.data || error);
    throw error;
  }
};

export const ChatHistory = async (id, token) => {
  try {
    const url = `${BASE_URL}/api/chat/messages?type=private&userId=${id}`;

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response?.data;
  } catch (error) {
    console.error('Error fetching artists:', error?.response?.data || error);
    throw error;
  }
};
