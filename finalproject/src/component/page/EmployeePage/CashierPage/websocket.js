import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const socket = new SockJS('http://localhost:3001/ws');
const stompClient = new Client({
  webSocketFactory: () => socket,
  reconnectDelay: 5000,
});

export default stompClient;