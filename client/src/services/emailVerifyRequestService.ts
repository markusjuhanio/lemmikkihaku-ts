import axios, { AxiosResponse } from 'axios';
import { apiBaseUrl } from '../constants';
import { EmailChangeRequest, EmailVerifyRequest } from '../types';

const activateUser = async (guid: string): Promise<AxiosResponse<EmailVerifyRequest>> => {
  const response = await axios.put(`${apiBaseUrl}/emailVerifyRequests/activateUser/${guid}`);
  return response;
};

const verifyNewEmail = async (guid: string): Promise<AxiosResponse<EmailVerifyRequest>> => {
  const response = await axios.put(`${apiBaseUrl}/emailVerifyRequests/verifyNewEmail/${guid}`);
  return response;
};

const createRequest = async (data: EmailChangeRequest): Promise<AxiosResponse<EmailVerifyRequest>> => {
  const response = await axios.post(`${apiBaseUrl}/emailVerifyRequests/`, data);
  return response;
};

const getEmailVerifyRequest = async (guid: string): Promise<AxiosResponse<EmailVerifyRequest>> => {
  const response = await axios.get(`${apiBaseUrl}/emailVerifyRequests/${guid}`);
  return response;
};

export default { activateUser, createRequest, verifyNewEmail, getEmailVerifyRequest };