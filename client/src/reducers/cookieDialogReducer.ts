import { createAction } from '@reduxjs/toolkit';
import { AnyAction } from 'redux';

const initialState = false;

export const setCookieDialog = createAction<boolean>('setCookieDialog');

export const cookieDialogReducer = (state = initialState, action: AnyAction): boolean => {
  switch (action.type) {
  case 'setCookieDialog':
    return action.payload as boolean;
  default:
    return state;
  }
};