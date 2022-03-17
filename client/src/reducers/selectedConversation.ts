import { createAction } from '@reduxjs/toolkit';
import { AnyAction } from 'redux';
import { PublicConversation } from '../types';

let initialState: PublicConversation | null;

export const setSelectedConversation = createAction<PublicConversation | null>('setSelectedConversation');

export const selectedConversationReducer = (state = initialState, action: AnyAction): PublicConversation | null => {
  switch (action.type) {
  case 'setSelectedConversation': {
    const conversation = action.payload as PublicConversation;
    if (conversation) {
      localStorage.setItem('selectedConversation', conversation.id);
    } else {
      localStorage.removeItem('selectedConversation');
    }
    return conversation;
  }
  default:
    return state ? state : null;
  }
};