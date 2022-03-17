import { createAction } from '@reduxjs/toolkit';
import { AnyAction } from 'redux';

interface LoginModalState {
  opened: boolean,
  tab: number
}

const initialState: LoginModalState = {
  opened: false,
  tab: 0
};

export const setLoginModal = createAction<LoginModalState>('setLoginModal');

export const loginModalReducer = (state = initialState, action: AnyAction): LoginModalState => {
  switch (action.type) {
  case 'setLoginModal':
    return action.payload as LoginModalState;
  default:
    return state;
  }
};