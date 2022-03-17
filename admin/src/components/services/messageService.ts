import axios, { AxiosResponse } from 'axios';
import { apiBaseUrl } from '../../constants';
import { Message } from '../../types';

const getMessages = async (): Promise<AxiosResponse<Message[]>> => {
  const response: AxiosResponse<Message[]> = await axios.get(`${apiBaseUrl}/messages`);
  return response;
};

const getMessage = async (id: string): Promise<AxiosResponse<Message>> => {
  const response: AxiosResponse<Message> = await axios.get(`${apiBaseUrl}/messages/${id}`);
  return response;
};

export default { getMessages, getMessage };