import { createAction } from '@reduxjs/toolkit';
import { AnyAction } from 'redux';
import { UserSearch } from '../types';

const initialState: UserSearch[] = [];

export const setSavedSearches = createAction<UserSearch[]>('setSavedSearches');
export const deleteSavedSearch = createAction<string>('deleteSavedSearch');

export const savedSearchesReducer = (state = initialState, action: AnyAction): UserSearch[] => {
  switch (action.type) {
  case 'setSavedSearches':
    return action.payload as UserSearch[];
  case 'deleteSavedSearch':
    return state.filter((search: UserSearch) => search.id !== action.payload as string);
  default:
    return state;
  }
};