import { createAction } from '@reduxjs/toolkit';
import { AnyAction } from 'redux';
import { UserSearch } from '../types';

export const initialState: UserSearch | null = {
  id: null,
  date: null,
  filters: null,
};

export const setLastSavedSearch = createAction<UserSearch>('setLastSavedSearch');
export const setDefaultLastSavedSearch = createAction('setDefaultLastSavedSearch');

export const lastSavedSearchReducer = (state = initialState, action: AnyAction): UserSearch => {
  switch (action.type) {
  case 'setLastSavedSearch':
    return action.payload as UserSearch;
  case 'setDefaultLastSavedSearch':
    return initialState;
  default:
    return state;
  }
};