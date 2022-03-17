import axios, { AxiosResponse } from 'axios';
import { apiBaseUrl } from '../constants';
import { PasswordRequest, PasswordChangeRequest } from '../types';

const setPassword = async (guid: string, password: string): Promise<AxiosResponse<PasswordRequest>> => {
  const response = await axios.put(`${apiBaseUrl}/passwordRequests/setPassword/${guid}`, { password: password });
  return response;
};

const createRequest = async (data: PasswordChangeRequest): Promise<AxiosResponse<PasswordRequest>> => {
  const response = await axios.post(`${apiBaseUrl}/passwordRequests`, data);
  return response;
};

const getPasswordRequest = async (guid: string): Promise<AxiosResponse<PasswordRequest>> => {
  const response = await axios.get(`${apiBaseUrl}/passwordRequests/${guid}`);
  return response;
};

export default { createRequest, setPassword, getPasswordRequest };