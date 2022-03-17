import { createAction } from '@reduxjs/toolkit';
import { AnyAction } from 'redux';

interface SessionExpiredState {
  expired: boolean
}

const initialState: SessionExpiredState = {
  expired: false,
};

export const setSessionExpired = createAction<SessionExpiredState>('setSessionExpired');

export const sessionExpiredReducer = (state = initialState, action: AnyAction): SessionExpiredState => {
  switch (action.type) {
  case 'setSessionExpired':
    return action.payload as SessionExpiredState;
  default:
    return state;
  }
};