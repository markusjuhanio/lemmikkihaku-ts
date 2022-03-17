import http from 'http';
import app from './app';
import { ALLOWED_ORIGINS, PORT } from './config';
import { logger } from './logger';
import { Server } from 'socket.io';
import { useSocket } from './socket';

const server = http.createServer(app);
export const io = new Server(server, { cors: { origin: ALLOWED_ORIGINS } });
useSocket(io);

server.listen(PORT, () => {
  logger.info((`Server running on port ${PORT}`));
});