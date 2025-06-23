// import {io} from 'socket.io-client';

// const SOCKET_SERVER_URL = 'https://2a82-103-250-149-229.ngrok-free.app';

// const socket = io(SOCKET_SERVER_URL);

// export const connectSocket = () => {
// socket.on('connect', () => {
//   console.log('Connected to socket');
// });
// };

// export const connected = () => {
//   socket.on('connect', () => {
//     console.log('socket Still connect');
//   });
// };

// export const disconnectSocket = () => {
//   socket.on('disconnect', () => {
//     console.log('Disconnected from socket');
//   });
// };

// export default socket;

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

export default socket;
