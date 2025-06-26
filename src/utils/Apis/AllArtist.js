import axios from 'axios';
import {BASE_URL} from '../api';

export const AllArtist = async token => {
  try {
    const url = `${BASE_URL}/api/artists`;

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

export const LikeArt = async (id, token) => {
  try {
    const url = `${BASE_URL}/api/artist/like/${id}`;

    const response = await axios.post(
      url,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response?.data;
  } catch (error) {
    console.error('Error fetching artists:', error?.response?.data || error);
    throw error;
  }
};

export const GetAllLikeArt = async (id, token) => {
  try {
    const url = `${BASE_URL}/api/artists/liked`;

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

export const Profile = async token => {
  try {
    const url = `${BASE_URL}/api/profile`;

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

export const UploadProfilePhoto = async (id, token, formData) => {
  try {

    const url = `${BASE_URL}/api/users/${id}`;
    const response = await axios.put(url, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error(
      'Error uploading profile photo:',
      error?.response?.data || error,
    );
    throw error;
  }
};
