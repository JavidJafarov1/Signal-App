import {io} from 'socket.io-client';

const SOCKET_SERVER_URL = 'https://2a82-103-250-149-229.ngrok-free.app';

const socket = io(SOCKET_SERVER_URL, {
  autoConnect: false, // Prevent auto-connect; we'll connect manually
});

socket.on('connect_error', error => {
  console.error('Socket connection error:', error.message);
});

export const connectSocket = () => {
  if (!socket.connected) {
    socket.connect(); // Actively connect to the socket
    socket.on('connect', () => {
      console.log('Connected to socket');
    });
  } else {
    console.log('Socket already connected');
  }
};

export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect(); // Actively disconnect the socket
    socket.on('disconnect', () => {
      console.log('Disconnected from socket');
    });
  } else {
    console.log('Socket already disconnected');
  }
};

export const authenticate = (userId, callback) => {
  if (!socket.connected) {
    socket.connect(); // Attempt to connect if not connected
    socket.on('connect', () => {
      console.log('Connected to socket');
      socket.emit('authenticate', userId, response => {
        if (response && response.success) {
          console.log('🔐 Authentication successful');
          callback(response);
        } else {
          console.error('Authentication failed:', response?.error);
          callback(response);
        }
      });
    });
  } else {
    socket.emit('authenticate', userId, response => {
      if (response && response.success) {
        console.log('🔐 Authentication successful');
        callback(response);
      } else {
        console.error('Authentication failed:', response?.error);
        callback(response);
      }
    });
  }
};

export const sendMessage = message => {
  if (!socket.connected) {
    socket.connect(); // Attempt to connect if not connected
    socket.on('connect', () => {
      console.log('Connected to socket');
      socket.emit('message', message, response => {
        // Optional: Handle server acknowledgment
        if (response && response.status === 'ok') {
          console.log('Message sent successfully:', message);
        } else {
          console.error('Failed to send message:', response?.error);
        }
      });
    });
  } else {
    socket.emit('message', message, response => {
      // Optional: Handle server acknowledgment
      if (response && response.status === 'ok') {
        console.log('Message sent successfully:', message);
      } else {
        console.error('Failed to send message:', response?.error);
      }
    });
  }
};

export const onMessage = callback => {
  socket.on('message', msg => {
    console.log('Received message:', msg);
    callback(msg);
  });
};

export default socket;
