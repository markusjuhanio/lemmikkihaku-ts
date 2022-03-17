import { createAction } from '@reduxjs/toolkit';
import { AnyAction } from 'redux';
import { PublicConversation, PublicMessage } from '../types';

localStorage.removeItem('selectedConversation');

const initialState: PublicConversation[] = [];

export const setConversations = createAction<PublicConversation[]>('setConversations');
export const updateConversation = createAction<PublicConversation>('updateConversation');
export const deleteConversation = createAction<string>('deleteConversation');
export const addMessage = createAction<PublicMessage>('addMessage');
export const addConversation = createAction<PublicConversation>('addConversation');
export const deleteMessage = createAction<{ messageId: string, conversationId: string }>('deleteMessage');

export const conversationsReducer = (state = initialState, action: AnyAction): PublicConversation[] => {
  switch (action.type) {
  case 'setConversations':
    return action.payload as PublicConversation[];
  case 'addConversation': 
    return [action.payload, ...state] as PublicConversation[];
  case 'addMessage': {
    const message = action.payload as PublicMessage;
    const conversation = state.find(c => c.id === message.conversationId);
    if (conversation) {
      conversation.messages.push(message);
      return state.map((c: PublicConversation) => c.id === conversation.id ? conversation : c);
    }
    return state;
  }
  case 'deleteMessage': {
    const message = action.payload as { messageId: string, conversationId: string };
    const conversation = state.find(c => c.id === message.conversationId);
    if (conversation) {
      conversation.messages = conversation.messages.filter(c => c.id !== message.messageId);
      return state.map((c: PublicConversation) => c.id === conversation.id ? conversation : c);
    }
    return state;
  }
  case 'updateConversation':
    return state.map((conversation: PublicConversation) => conversation.id === action.payload.id ? action.payload as PublicConversation : conversation);
  case 'deleteConversation':
    return state.filter((conversation: PublicConversation) => conversation.id !== action.payload as string);
  default:
    return state;
  }
};