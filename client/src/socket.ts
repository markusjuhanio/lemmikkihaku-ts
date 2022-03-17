import { Socket } from 'socket.io-client';
import io from 'socket.io-client';
import { apiBaseUrl } from './constants';
import { AuthorizedUser, OwnUser, SocketAction, UserStatus } from './types';

export let socket: Socket = io(apiBaseUrl.split('/api')[0], { transports: ['websocket'] });

export const handleUserSocketLogin = (user: AuthorizedUser): void => {
  setSocket(user.accessToken);
};

export const handleUserSocketLogout = (user: OwnUser): void => {
  if (user) {
    const userStatus: UserStatus = { userId: user.id, online: false };
    socket.emit(SocketAction.LOG_OUT, userStatus);
    socket.disconnect();
  }
  socket = io(apiBaseUrl.split('/api')[0], { transports: ['websocket'] });
};

export const setSocket = (accessToken: string): void => {
  socket.disconnect();
  socket = io(apiBaseUrl.split('/api')[0], { query: { token: accessToken }, transports: ['websocket'] });
};