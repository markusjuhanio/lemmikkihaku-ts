import { createAction } from '@reduxjs/toolkit';
import { AnyAction } from 'redux';
import { AdminViewUser } from '../types';

const initialState: AdminViewUser[] = [];

export const setUsers = createAction<AdminViewUser[]>('setUsers');
export const updateUser = createAction<AdminViewUser>('updateUser');
export const deleteUser = createAction<string>('deleteUser');

export const usersReducer = (state = initialState, action: AnyAction): AdminViewUser[] => {
  switch (action.type) {
  case 'setUsers':
    return action.payload as AdminViewUser[];
  case 'updateUser':
    return state.map(user => user.id === action.payload.id ? action.payload as AdminViewUser : user);
  case 'deleteUser':
    return state.filter(user => user.id !== action.payload);
  default:
    return state;
  }
};