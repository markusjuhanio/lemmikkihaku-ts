import axios, { AxiosResponse } from 'axios';
import { apiBaseUrl } from '../constants';
import { MessageEntry, PublicConversation, PublicMessage } from '../types';

const sendMessage = async (data: MessageEntry): Promise<AxiosResponse<PublicMessage>> => {
  const response = await axios.post(`${apiBaseUrl}/conversations`, data);
  return response;
};

const getConversations = async (): Promise<AxiosResponse<PublicConversation[]>> => {
  const response = await axios.get(`${apiBaseUrl}/conversations`);
  return response;
};

const softDeleteMessage = async (data: { messageId: string, conversationId: string }): Promise<AxiosResponse<void>> => {
  const response = await axios.post(`${apiBaseUrl}/conversations/deleteMessage`, data);
  return response;
};

const softDeleteConversation = async (data: { conversationId: string }): Promise<AxiosResponse<void>> => {
  const response = await axios.post(`${apiBaseUrl}/conversations/deleteConversation`, data);
  return response;
};

export default { sendMessage, getConversations, softDeleteMessage, softDeleteConversation };