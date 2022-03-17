import { createAction } from '@reduxjs/toolkit';
import { AnyAction } from 'redux';
import { Severity } from '../types';

interface Toast {
  open: boolean,
  message: string,
  severity: Severity,
  timeout: number,
  action?: () => void,
  actionName?: string
}

const initialState: Toast = {
  open: false,
  message: '',
  severity: Severity.Success,
  timeout: 1
};

export const showToast = createAction<Toast>('showToast');

export const toastReducer = (state = initialState, action: AnyAction): Toast => {
  switch (action.type) {
  case 'showToast':
    return action.payload as Toast;
  default:
    return state;
  }
};