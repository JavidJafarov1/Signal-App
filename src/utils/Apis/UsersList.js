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
    console.error(
      'Error fetching artists-------:',
      error?.response?.data || error,
    );
    throw error;
  }
};

export const GetConversationList = async token => {
  try {
    const url = `${BASE_URL}/api/chat`;

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response?.data;
  } catch (error) {
    console.error(
      'Error fetching artists======:',
      error?.response?.data || error,
    );
    throw error;
  }
};

export const ChatHistory = async ({
  type = 'private',
  userId,
  groupId,
  token,
}) => {
  try {
    let url = `${BASE_URL}/api/chat/messages?type=${type}`;
    if (type === 'private' && userId) {
      url += `&userId=${userId}`;
    } else if (type === 'group' && groupId) {
      url += `&groupId=${groupId}`;
    }
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response?.data;
  } catch (error) {
    console.error('Error fetching messages:', error?.response?.data || error);
    throw error;
  }
};

export const NewGroup = async (name, memberIds, token) => {
  try {
    const url = `${BASE_URL}/api/groups/create-group`;
    const body = {
      name,
      members: memberIds,
    };

    const response = await axios.post(url, body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response?.data;
  } catch (error) {
    console.error('Error creating group:', error?.response?.data || error);
    throw error;
  }
};

export const GetAllGroup = async token => {
  try {
    const url = `${BASE_URL}/api/groups/my-groups`;

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response?.data;
  } catch (error) {
    console.error('Error fetching groups:', error?.response?.data || error);
    throw error;
  }
};

export const AddMember = async (groupId, memberIds, token) => {
  try {
    const url = `${BASE_URL}/api/groups/add-members/${groupId}`;
    const body = {
      members: memberIds,
    };
    const response = await axios.put(url, body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error adding member:', error?.response?.data || error);
    throw error;
  }
};

export const RemoveMember = async (id, token) => {
  try {
    const url = `${BASE_URL}/api/groups/remove-member/${id}`;
    const body = {
      userId: userId,
    };
    const response = await axios.put(url, body, {
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

export const leaveGroup = async (id, token) => {
  try {
    const url = `${BASE_URL}/api/groups/leave-group/${id}`;
    const response = await axios.put(
      url,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response.data;
  } catch (error) {
    console.error(
      'Error uploading profile photo:',
      error?.response?.data || error,
    );
    throw error;
  }
};
