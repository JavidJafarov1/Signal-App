import {io} from 'socket.io-client';

let socket;

export const initiateSocket = userId => {
  socket = io('https://2cd7-103-250-149-229.ngrok-free.app', {
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
      console.log(
        res.success ? `🔐 Authenticated as ${userId}` : '❌ Auth failed',
      );
    });
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
  console.log('mediaType', mediaType, messageType);

  const finalContent = hasMedia ? '[Media]' : content.trim();

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
      console.log('res', res);
    },
  );
};

// export const sendMessage = (payload, callback) => {
//   if (!socket?.connected) {
//     return callback?.({success: false, message: 'Socket not connected'});
//   }

//   const media = payload.media || {};
//   const isMedia = Boolean(media.uri);
//   const mediaType = media.type || '';

//   const type = isMedia
//     ? mediaType.startsWith('image/')
//       ? 'image'
//       : 'file'
//     : 'text';

//   const messagePayload = {
//     ...payload,
//     type,
//     content: isMedia ? '[Media]' : (payload.content || '').trim(),
//     media: isMedia
//       ? {
//           uri: media.uri,
//           type: mediaType,
//           name: media.name || `media.${mediaType.split('/')[1] || 'jpg'}`,
//         }
//       : undefined,
//   };

//   socket.emit('sendMessage', messagePayload, response => {
//     callback?.(response);
//   });
// };

export const markAsRead = messageId => {
  if (socket?.connected) {
    socket.emit('markAsRead', {messageId});
  }
};

export const deleteMessage = messageId => {
  if (socket?.connected) {
    socket.emit('deleteMessage', {messageId});
  }
};

export const editMessage = ({messageId, content}) => {
  if (socket?.connected) {
    socket.emit('editMessage', {messageId, content});
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
