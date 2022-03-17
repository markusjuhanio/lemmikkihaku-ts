import { createAction } from '@reduxjs/toolkit';
import { AnyAction } from 'redux';

const storedState = localStorage.getItem('personalizedAdsEnabled');
const initialState: boolean | null = storedState ? storedState === 'true' ? true : false : null;

export const setPersonalizedAdsEnabled = createAction<boolean>('setPersonalizedAdsEnabled');

export const personalizedAdsEnabledReducer = (state = initialState, action: AnyAction): boolean | null => {
  switch (action.type) {
  case 'setPersonalizedAdsEnabled':
    return action.payload as boolean;
  default:
    return state;
  }
};