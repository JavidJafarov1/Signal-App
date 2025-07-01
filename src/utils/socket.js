import { io } from 'socket.io-client';

let socket;

export const initiateSocket = userId => {
  socket = io('https://2957-103-250-149-229.ngrok-free.app', {
    transports: ['websocket'],
  });

  socket.on('connect', () => {
    console.log('✅ Socket connected');
    authenticate(userId);
  });

  socket.on('disconnect', () => {
    console.log('🔌 Socket disconnected');
  });
};

export const authenticate = userId => {
  if (socket) {
    socket.emit('authenticate', userId, res => {
      console.log(res.success ? `🔐 Authenticated as ${userId}` : '❌ Auth failed');
    });
  }
};

export const sendMessage = (payload, callback) => {
  if (socket?.connected) {
    console.log('Emitting payload:', payload);
    socket.emit('sendMessage', payload, response => {
      callback?.(response);
    });
  } else {
    console.warn('Socket is not connected');
    callback?.({ success: false, message: 'Socket not connected' });
  }
};

export const markAsRead = messageId => {
  if (socket?.connected) {
    socket.emit('markAsRead', { messageId });
  }
};

export const deleteMessage = messageId => {
  if (socket?.connected) {
    socket.emit('deleteMessage', { messageId });
  }
};

export const editMessage = ({ messageId, content }) => {
  if (socket?.connected) {
    socket.emit('editMessage', { messageId, content });
  }
};

export const subscribeToPrivateMessages = callback => {
  if (socket) {
    socket.on('message', callback);
    return socket;
  }
};

export const subscribeToReadStatus = callback => {
  if (socket) {
    socket.on('messageRead', callback);
    return socket;
  }
};

export const subscribeToGroupMessages = callback => {
  if (socket) {
    socket.on('groupMessage', callback);
    return socket;
  }
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};