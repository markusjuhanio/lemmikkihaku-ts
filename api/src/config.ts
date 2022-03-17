import 'dotenv/config';

export const USE_PINO_LOGGER = process.env.NODE_ENV !== 'test';

export const APP_URL: string = process.env.APP_URL || 'http://localhost:3000';
export const PORT: string = process.env.PORT || '';

export const MONGODB_URI: string | undefined = process.env.NODE_ENV === 'production'
  ? process.env.MONGODB_URI
  : process.env.NODE_ENV === 'test'
    ? process.env.MONGODB_URI_TEST
    : process.env.MONGODB_URI_DEV;

export const ACCESS_TOKEN_SECRET: string = process.env.ACCESS_TOKEN_SECRET || '';
export const REFRESH_TOKEN_SECRET: string = process.env.REFRESH_TOKEN_SECRET || '';
export const MESSAGES_SECRET: string = process.env.MESSAGES_SECRET || '';

export const ACCESS_TOKEN_EXPIRE_TIME = 7; // as days
export const REFRESH_TOKEN_EXPIRE_TIME = 28; // as days
export const LISTING_LIFETIME = 60; // as days

export const MAX_SAVED_MESSAGES_IN_CONVERSATION = process.env.NODE_ENV === 'production' ? 50 : 5;
export const MAX_SAVED_NOTIFICATIONS = 50;

export const MAILER_ADDRESS: string = process.env.MAILER_ADDRESS || '';
export const MAILER_PASSWORD: string = process.env.MAILER_PASSWORD || '';
export const MAILER_NAME: string = process.env.MAILER_NAME || '';
export const MAILER_SMTP: string = process.env.MAILER_SMTP || '';

export const IMAGES_BUCKET: string = process.env.NODE_ENV === 'production' ? 'lemmikkihaku-images' : 'lemmikkihaku-images-dev';
export const CHAT_IMAGES_BUCKET: string = process.env.NODE_ENV === 'production' ? 'lemmikkihaku-chat-images' : 'lemmikkihaku-chat-images-dev';

export const ALLOWED_ORIGINS: string[] = [
  'http://192.168.1.66:3000',
  'http://192.168.1.40:3000',
  'http://localhost:3000',
  'http://localhost:3002',
  'https://admin.lemmikkihaku.fi',
  'https://lemmikkihaku.fi',
  'https://www.lemmikkihaku.fi',
  'https://lemmikkihaku-v2.herokuapp.com',
  'https://lemmikkihaku-admin.herokuapp.com',
  'https://lemmikkihaku-admin-staging.herokuapp.com',
  'https://lemmikkihaku-v2-staging.herokuapp.com',
];

export const AVATAR_COLORS: string[] = [
  '#f44336',
  '#e91e63',
  '#9c27b0',
  '#673ab7',
  '#3f51b5',
  '#2196f3',
  '#03a9f4',
  '#00bcd4',
  '#009688',
  '#4caf50',
  '#8bc34a',
  '#cddc39',
  '#ffeb3b',
  '#ffc107',
  '#ff9800',
  '#ff5722',
  '#795548',
  '#607d8b',
];