import { ActionCreator, Action } from '@reduxjs/toolkit';
import { AnyAction } from 'redux';
import { isDarkModeSelected } from '../utils';

interface DarkModeState {
    enabled: boolean
}

const initialState: DarkModeState = {
  enabled: isDarkModeSelected()
};

export const setDarkMode: ActionCreator<Action> = (enabled: boolean) => {
  return {
    type: 'setDarkMode',
    payload: enabled
  };
};

export const darkModeReducer = (state = initialState, action: AnyAction): DarkModeState => {
  switch (action.type) {
  case 'setDarkMode':
    localStorage.setItem('darkMode', JSON.stringify(action.payload.enabled));
    return action.payload as DarkModeState;
  default:
    return state;
  }
};