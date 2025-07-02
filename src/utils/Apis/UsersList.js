import axios from 'axios';
import {BASE_URL} from '../api';
import {Platform} from 'react-native';

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

export const NewGroup = async (name, memberIds, imageUri, token) => {
  try {
    const url = `${BASE_URL}/api/groups/create-group`;
    const formData = new FormData();

    console.log('url', url);

    formData.append('name', name);
    formData.append('members', JSON.stringify(memberIds));

    if (imageUri) {
      const fileName = imageUri.split('/').pop() || 'group-icon.jpg';
      let fileExt = fileName.split('.').pop()?.toLowerCase();

      if (fileExt === 'jpg') fileExt = 'jpeg';
      if (!['jpeg', 'png', 'webp'].includes(fileExt)) {
        fileExt = 'jpeg';
      }

      formData.append('groupIcone', {
        uri: imageUri,
        type: `image/${fileExt}`,
        name: fileName,
      });
    }

    // Debug formData content
    formData._parts.forEach(p =>
      console.log('Form field:', p[0], 'Value:', p[1]),
    );

    const response = await axios.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
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

export const RemoveMember = async (groupId, userId, token) => {
  try {
    const url = `${BASE_URL}/api/groups/remove-member/${groupId}`;
    const body = {userId: userId};

    const response = await axios.put(url, body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error removing member:', error?.response?.data || error);
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

export const UpdateGroupDetails = async (groupId, name, iconFile, token) => {
  try {
    const url = `${BASE_URL}/api/groups/update-group/${groupId}`;
    const formData = new FormData();

    if (name) {
      formData.append('name', name);
    }

    if (iconFile?.uri) {
      formData.append('groupIcone', {
        uri:
          Platform.OS === 'ios'
            ? iconFile.uri.replace('file://', '')
            : iconFile.uri,
        name: iconFile.name || 'icon.png',
        type: iconFile.type || 'image/png',
      });
    }

    const response = await axios.put(url, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    console.error(
      'Error updating group:',
      error?.response?.data || error.message,
    );
    throw error;
  }
};
