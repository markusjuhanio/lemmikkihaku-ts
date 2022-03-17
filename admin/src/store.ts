import { AnyAction, configureStore, ThunkAction } from '@reduxjs/toolkit';
import { authReducer } from './reducers/authReducer';
import thunk from 'redux-thunk';
import { darkModeReducer } from './reducers/darkModeReducer';
import { listingsReducer } from './reducers/listingsReducer';
import { usersReducer } from './reducers/usersReducer';
import { messagesReducer } from './reducers/messagesReducer';
import { listingPreviewReducer } from './reducers/selectedListingReducer';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    darkMode: darkModeReducer,
    listings: listingsReducer,
    users: usersReducer,
    messages: messagesReducer,
    listingToPreview: listingPreviewReducer
  },
  middleware: [
    thunk
  ],
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  AnyAction
>;