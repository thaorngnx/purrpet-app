import { io } from 'socket.io-client';

const URL = process.env.SOCKET_URL as string;

export const socket = (token: string) => {
  return io(URL, { path: '/socket', query: { token } });
};
