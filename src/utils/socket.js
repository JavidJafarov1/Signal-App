import {io} from 'socket.io-client';
import {BASE_URL} from './api';

let socket;

export const initiateSocket = (userId, token) => {
  socket = io(`${BASE_URL}`, {
    transports: ['websocket'],
    auth: {userId, token}, // Pass userId and token in auth object
  });

  socket.on('connect', () => {
    console.log('✅ Socket connected');
    authenticate(userId, token); // Call authenticate with token
  });

  socket.on('connect_error', err => {
    console.error('Socket connection error:', err.message);
  });

  socket.on('disconnect', () => {
    console.log('🔌 Socket disconnected');
  });

  socket.on('error', err => {
    console.error('Socket error:', err);
  });
};

export const authenticate = (userId, token) => {
  console.log(userId, '===-=-=');

  if (socket) {
    socket.emit('authenticate', {userId, token}, res => {
      if (res?.success) {
        console.log(`🔐 Authenticated as ${userId}`);
      } else {
        console.log('❌ Auth failed:', res?.message || 'Unknown error');
      }
    });
  } else {
    console.error('Socket not initialized');
  }
};
export const sendMessage = (payload, callback) => {
  if (socket?.connected) {
    console.log('Emitting sendMessage with payload:', payload);
    socket.emit('sendMessage', payload, response => {
      console.log('sendMessage response:', response);
      callback?.(response);
    });
  } else {
    console.warn('Socket is not connected');
    callback?.({success: false, message: 'Socket not connected'});
  }
};

export const markAsRead = messageId => {
  if (socket?.connected) {
    console.log('Emitting markAsRead for messageId:', messageId);
    socket.emit('markAsRead', {messageId});
  } else {
    console.warn('Socket not connected for markAsRead');
  }
};

export const deleteMessage = messageId => {
  if (socket?.connected) {
    console.log('Emitting deleteMessage for messageId:', messageId);
    socket.emit('deleteMessage', {messageId});
  } else {
    console.warn('Socket not connected for deleteMessage');
  }
};

export const editMessage = ({messageId, content}) => {
  if (socket?.connected) {
    console.log(
      'Emitting editMessage for messageId:',
      messageId,
      'with content:',
      content,
    );
    socket.emit('editMessage', {messageId, content});
  } else {
    console.warn('Socket not connected for editMessage');
  }
};

export const subscribeToPrivateMessages = callback => {
  if (socket) {
    console.log('Subscribing to private messages');
    socket.on('message', data => {
      console.log('Received private message:', data);
      callback(data);
    });
    return socket;
  }
};

export const subscribeToGroupMessages = callback => {
  if (socket) {
    console.log('Subscribing to group messages');
    socket.on('groupMessage', data => {
      console.log('Received group message:', data);
      callback(data);
    });
    return socket;
  }
};

export const subscribeToReadStatus = callback => {
  if (socket) {
    console.log('Subscribing to read status');
    socket.on('messageRead', data => {
      console.log('Received read status:', data);
      callback(data);
    });
    return socket;
  }
};

export const disconnectSocket = () => {
  if (socket) {
    console.log('Disconnecting socket');
    socket.disconnect();
    socket = null;
  }
};
