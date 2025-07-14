import {io} from 'socket.io-client';
import {BASE_URL} from './api';
import axios from 'axios';

let socket;

export const initiateSocket = userId => {
  socket = io(BASE_URL, {transports: ['websocket']});

  socket.on('connect', () => {
    console.log('✅ Socket connected');
    authenticate(userId);
  });

  socket.on('disconnect', () => {
    console.log('🔌 Socket disconnected');
  });
};

export const subscribeToChatList = callback => {
  if (!socket) return;

  socket.on('chatList', callback);
};

const authenticate = userId => {
  socket?.emit('authenticate', userId, res => {
    console.log(
      res.success ? `🔐 Authenticated as ${userId}` : '❌ Auth failed',
    );
  });
};

export const uploadFile = async (file, token) => {
  try {
    const body = new FormData();

    body.append('file', {
      uri: file.uri,
      name: file.name || 'upload.jpg',
      type: file.type || 'image/jpeg',
    });

    const response = await axios.post(`${BASE_URL}/api/upload`, body, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });

    return response?.data;
  } catch (error) {
    console.error('Upload failed:', error);
    throw error;
  }
};

export const sendMessage = (payload, callback) => {
  if (!socket?.connected) {
    return callback?.({success: false, message: 'Socket not connected'});
  }

  const {
    media = {},
    content = '',
    chatType,
    receiverId,
    groupId,
    fileUrl = '',
  } = payload;
  const hasMedia = Boolean(media.uri);
  const mediaType = media?.type || '';

  const messageType = hasMedia
    ? mediaType.startsWith('image/')
      ? 'image'
      : 'file'
    : 'text';

  const finalContent = content.trim();

  socket.emit(
    'sendMessage',
    {
      chatType,
      receiverId,
      groupId,
      messageType,
      content: finalContent,
      fileUrl,
      fileName: media?.name || '',
      fileType: media?.type || '',
    },
    res => {
      callback?.(res);
    },
  );
};

export const markAsRead = messageId => {
  socket?.emit('markAsRead', {messageId});
};

export const deleteMessage = messageId => {
  socket?.emit('deleteMessage', {messageId});
};

export const subscribeToDeletedMessages = callback => {
  socket?.on('messageDeleted', callback);
  return {
    off: () => socket?.off('messageDeleted', callback),
  };
};

export const subscribeToPrivateMessages = callback => {
  socket?.on('message', callback);
};

export const subscribeToGroupMessages = callback => {
  socket?.on('groupMessage', callback);
};

export const subscribeToReadStatus = callback => {
  const onPrivate = data => {
    if (__DEV__) console.log('🟢 Received messageRead:', data);
    callback(data);
  };

  const onGroup = data => {
    if (__DEV__) console.log('🟢 Received groupMessageRead:', data);
    callback(data);
  };

  if (!socket) return {off: () => {}};

  socket.on('messageRead', onPrivate);
  socket.on('groupMessageRead', onGroup);

  return {
    off: () => {
      socket.off('messageRead', onPrivate);
      socket.off('groupMessageRead', onGroup);
    },
  };
};

export const disconnectSocket = () => {
  socket?.disconnect();
  socket = null;
};
