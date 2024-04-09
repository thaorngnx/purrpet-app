import { io } from 'socket.io-client';

const URL = process.env.SOCKET_URL as string;

// const URL =
//   'https://a39b-2402-800-63b6-bd81-548d-b74c-2b21-56dc.ngrok-free.app';

export const socket = (token: string) => {
  return io(URL, { path: '/socket', query: { token } });
};
