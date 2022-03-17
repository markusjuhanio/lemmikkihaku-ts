export const apiBaseUrl = process.env.REACT_APP_API_URI ? process.env.REACT_APP_API_URI : 'http://localhost:3001/api';
export const MAX_LISTINGS_PER_PAGE = process.env.NODE_ENV === 'production' ? 12 : 2;
export const LISTING_LIFETIME = 60; // days
export const MAX_SAVED_MESSAGES_IN_CONVERSATION = process.env.NODE_ENV === 'production' ? 50 : 5;
export const APP_WIDTH = 720;