import { createAction } from '@reduxjs/toolkit';
import { AnyAction } from 'redux';
import { Notification } from '../types';

const initialState: Notification[] = [];

export const setNotifications = createAction<Notification[]>('setNotifications');
export const updateNotification = createAction<Notification>('updateNotification');
export const deleteNotification = createAction<string>('deleteNotification');
export const addNotification = createAction<Notification>('addNotification');

export const notificationsReducer = (state = initialState, action: AnyAction): Notification[] => {
  switch (action.type) {
  case 'setNotifications':
    return action.payload as Notification[];
  case 'addNotification':
    return [action.payload, ...state] as Notification[];
  case 'updateNotification':
    return state.map(notification => notification.id === action.payload.id ? action.payload as Notification : notification);
  case 'deleteNotification':
    return state.filter(notification => notification.id !== action.payload as string);
  default:
    return state;
  }
};