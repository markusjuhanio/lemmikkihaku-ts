import { Server, Socket } from 'socket.io';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { ACCESS_TOKEN_SECRET } from './config';
import { Role, SocketAction, SocketRoom, TypingUser, UserStatus } from './types';
import { v4 as uuidv4 } from 'uuid';

interface ExtendedSocket extends Socket {
  userId: string,
  role: Role
}

let io: Server;
const authorizedUsers = new Map<string, string>(); // userId, socketId

export const useSocket = (server: Server) => {
  io = server;
  let usersTyping: TypingUser[] = [];
  let stopTypingIntervalId: NodeJS.Timeout;

  io.on('connection', function (socket: Socket) {
    const extendedSocket = socket as ExtendedSocket;

    // Connect with token
    if (extendedSocket.handshake.query.token) {
      try {
        const token: string = extendedSocket.handshake.query.token.toString();
        const payload = jwt.verify(token, ACCESS_TOKEN_SECRET) as JwtPayload;
        if (payload) {
          extendedSocket.userId = payload.user._id;
          extendedSocket.role = payload.user.role as Role;

          authorizedUsers.set(extendedSocket.userId, extendedSocket.id);

          if (extendedSocket.role === Role.Admin) {
            extendedSocket.join(SocketRoom.ADMINS);
          } else {
            extendedSocket.join(SocketRoom.USERS);
          }

          const userStatus: UserStatus = { userId: extendedSocket.userId, online: true };
          io.in(SocketRoom.USERS).emit(SocketAction.USER_STATUS, userStatus);
        }
      } catch (error) {
        ///
      }
    } else {
      //Connect without token
      extendedSocket.userId = uuidv4();
      extendedSocket.role = Role.User;
      extendedSocket.join(SocketRoom.USERS);
    }

    io.to(SocketRoom.ADMINS).emit(SocketAction.ONLINE_USERS, getOnlineUsersCount());

    // When disconnected, emit status to all clients
    // and set isTyping to false if any to prevent isTyping hanging
    extendedSocket.on('disconnect', function () {
      io.in(SocketRoom.USERS).emit(SocketAction.USER_STATUS, { userId: extendedSocket.userId, online: false });
      usersTyping = usersTyping.map(user => user.from === extendedSocket.userId ? { ...user, isTyping: false } : user);
      usersTyping.forEach(user => {
        sendPrivateMessage(user.to, SocketAction.STOP_TYPING_MESSAGE, usersTyping);
      });
      if (authorizedUsers.get(extendedSocket.userId)) {
        authorizedUsers.delete(extendedSocket.userId);
      }
      extendedSocket.leave(SocketRoom.USERS);
      if (extendedSocket.role === Role.Admin) {
        extendedSocket.leave(SocketRoom.ADMINS);
      }
      io.to(SocketRoom.ADMINS).emit(SocketAction.ONLINE_USERS, getOnlineUsersCount());
    });

    // When log out
    extendedSocket.on(SocketAction.LOG_OUT, function (data: UserStatus) {
      io.in(SocketRoom.USERS).emit(SocketAction.USER_STATUS, data);
      authorizedUsers.delete(data.userId);
      extendedSocket.leave(SocketRoom.USERS);
      if (extendedSocket.role === Role.Admin) {
        extendedSocket.leave(SocketRoom.ADMINS);
      }
      io.to(SocketRoom.ADMINS).emit(SocketAction.ONLINE_USERS, getOnlineUsersCount());
    });

    // When request all users online
    extendedSocket.on(SocketAction.ONLINE_USERS, function () {
      io.to(SocketRoom.ADMINS).emit(SocketAction.ONLINE_USERS, getOnlineUsersCount());
    });

    // When user starts typing
    extendedSocket.on(SocketAction.START_TYPING_MESSAGE, function (data: TypingUser) {

      const alreadyAdded = usersTyping.find(user => user.from === data.from && user.to === data.to);
      if (!alreadyAdded) {
        usersTyping.push(data);
      } else {
        usersTyping = usersTyping.map(user => user.from === data.from && user.to === data.to ? data : user);
      }

      sendPrivateMessage(data.to, SocketAction.START_TYPING_MESSAGE, usersTyping.filter(user => user.to === data.to));
    });

    // When user stops typing
    extendedSocket.on(SocketAction.STOP_TYPING_MESSAGE, function (data: TypingUser) {
      if (stopTypingIntervalId) {
        clearInterval(stopTypingIntervalId);
      }
      usersTyping = usersTyping.map((user => user.from === data.from && user.to === data.to ? data : user));
      sendPrivateMessage(data.to, SocketAction.STOP_TYPING_MESSAGE, usersTyping.filter(user => user.to === data.to));

      //Clear typingUser list for unnecessary items, assuming status false has already been sent
      stopTypingIntervalId = setInterval(() => {
        usersTyping = usersTyping.filter(user => user.isTyping !== false);
        clearInterval(stopTypingIntervalId);
      }, 5000);
    });

    // When requesting user online status
    extendedSocket.on(SocketAction.IS_USER_ONLINE, function (data: { userId: string }) {
      let isOnline = false;
      if (authorizedUsers.get(data.userId)) {
        isOnline = true;
      }
      const userStatus: UserStatus = { userId: data.userId, online: isOnline };
      io.to(SocketRoom.USERS).emit(SocketAction.USER_STATUS, userStatus);
    });

  });
};

export const getOnlineUsersCount = (): number => {
  const sockets = io.sockets.adapter.rooms.get(SocketRoom.USERS);
  const count = sockets ? Array.from(sockets).length : 0;
  return count;
};

// Send private message to specific client in authorizedUsers map
export const sendPrivateMessage = (to: string, action: SocketAction, data: any): void => {
  const socketId: string | undefined = authorizedUsers.get(to);
  if (socketId) {
    io.to(socketId).emit(action, data);
  }
};

// Send message to all clients in USERS room
export const sendPublicMessage = (action: SocketAction, data: any): void => {
  io.to(SocketRoom.USERS).emit(action, data);
};

// Send message to all admins in ADMINS room
export const sendToAdmins = (action: SocketAction, data: any): void => {
  io.to(SocketRoom.ADMINS).emit(action, data);
};