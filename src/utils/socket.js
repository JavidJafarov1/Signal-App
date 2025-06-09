import {io} from 'socket.io-client';

const SOCKET_SERVER_URL = 'http://your-server-ip:PORT';

const socket = io(SOCKET_SERVER_URL, {
  transports: ['websocket'],
  jsonp: false,
});

export default socket;
