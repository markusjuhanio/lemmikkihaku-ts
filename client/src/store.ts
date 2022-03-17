import { loginModalReducer } from './reducers/loginModalReducer';
import { AnyAction, configureStore, ThunkAction } from '@reduxjs/toolkit';
import thunk from 'redux-thunk';
import { userReducer } from './reducers/userReducer';
import { darkModeReducer } from './reducers/darkModeReducer';
import { sessionExpiredReducer } from './reducers/sessionExpiredReducer';
import { searchPropsReducer } from './reducers/searchPropsReducer';
import { listingsReducer } from './reducers/listingsReducer';
import { newListingReducer } from './reducers/newListingReducer';
import { toastReducer } from './reducers/toastReducer';
import { moreFiltersReducer } from './reducers/moreFiltersReducer';
import { lastSavedSearchReducer } from './reducers/lastSavedSearch';
import { ownListingsReducer } from './reducers/ownListingsReducer';
import { favoriteListingsReducer } from './reducers/favoriteListingsReducer';
import { savedSearchesReducer } from './reducers/savedSearchesReducer';
import { conversationsReducer } from './reducers/conversationsReducer';
import { notificationsReducer } from './reducers/notificationsReducer';
import { selectedConversationReducer } from './reducers/selectedConversation';
import { personalizedAdsEnabledReducer } from './reducers/personalizedAdsEnabledReducer';
import { cookieDialogReducer } from './reducers/cookieDialogReducer';

export const store = configureStore({
  reducer: {
    user: userReducer,
    loginModal: loginModalReducer,
    darkMode: darkModeReducer,
    sessionExpired: sessionExpiredReducer,
    searchProps: searchPropsReducer,
    listings: listingsReducer,
    newListing: newListingReducer,
    toast: toastReducer,
    moreFilters: moreFiltersReducer,
    lastSavedSearch: lastSavedSearchReducer,
    ownListings: ownListingsReducer,
    favoriteListings: favoriteListingsReducer,
    savedSearches: savedSearchesReducer,
    conversations: conversationsReducer,
    notifications: notificationsReducer,
    selectedConversation: selectedConversationReducer,
    personalizedAdsEnabled: personalizedAdsEnabledReducer,
    cookieDialog: cookieDialogReducer
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