import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import userRouter from './routes/users';
import authRouter from './routes/auth';
import listingRouter from './routes/listings';
import savedSearchRouter from './routes/savedSearches';
import contactRouter from './routes/contact';
import emailVerifyRequestRouter from './routes/emailVerifyRequests';
import passwordRequestRouter from './routes/passwordRequests';
import conversationRouter from './routes/conversations';
import notificationRouter from './routes/notifications';
import { expressLogger } from './logger';
import { errorHandler, unknownEndpoint } from './middleware';
import useMongo from './mongo';
import { ALLOWED_ORIGINS, MONGODB_URI, USE_PINO_LOGGER } from './config';
import { ttl_listings } from './ttl';

const app = express();

if (USE_PINO_LOGGER) {
  app.use(expressLogger);
}

useMongo(MONGODB_URI);

app.use(express.json({ limit: '30MB' }));
app.use(cors({ origin: ALLOWED_ORIGINS, optionsSuccessStatus: 200 }));

app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/listings', listingRouter);
app.use('/api/searches', savedSearchRouter);
app.use('/api/contact', contactRouter);
app.use('/api/emailVerifyRequests', emailVerifyRequestRouter);
app.use('/api/passwordRequests', passwordRequestRouter);
app.use('/api/conversations', conversationRouter);
app.use('/api/notifications', notificationRouter);

app.use(unknownEndpoint);
app.use(errorHandler);

ttl_listings();

export default app;