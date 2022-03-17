import axios, { AxiosResponse } from 'axios';
import { apiBaseUrl } from '../constants';
import { Notification } from '../types';

const getOwnNotifications = async (): Promise<AxiosResponse<Notification[]>> => {
  const response = await axios.get(`${apiBaseUrl}/notifications`);
  return response;
};

const checkNotification = async (id: string): Promise<AxiosResponse<Notification>> => {
  const response = await axios.put(`${apiBaseUrl}/notifications/${id}`);
  return response;
};

const deleteNotification = async (id: string): Promise<AxiosResponse<Notification>> => {
  const response = await axios.delete(`${apiBaseUrl}/notifications/${id}`);
  return response;
};

export default { getOwnNotifications, checkNotification, deleteNotification };