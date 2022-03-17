import { createAction } from '@reduxjs/toolkit';
import { AnyAction } from 'redux';
import { Message } from '../types';

const initialState: Message[] = [];

export const setMessages = createAction<Message[]>('setMessages');

export const messagesReducer = (state = initialState, action: AnyAction): Message[] => {
  switch (action.type) {
  case 'setMessages':
    return action.payload as Message[];
  default:
    return state;
  }
};