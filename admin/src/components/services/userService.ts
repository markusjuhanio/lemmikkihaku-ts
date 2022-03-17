import axios, { AxiosResponse } from 'axios';
import { apiBaseUrl } from '../../constants';
import { AdminViewUser, AuthorizedUser, LoginData, OwnUser } from '../../types';

const login = async (nickname: string, password: string): Promise<AxiosResponse<AuthorizedUser>> => {
  const data: LoginData = { nickname: nickname, password: password };
  const response: AxiosResponse<AuthorizedUser> = await axios.post(`${apiBaseUrl}/auth/login`, data);
  return response;
};

const getUsers = async (): Promise<AxiosResponse<AdminViewUser[]>> => {
  const response: AxiosResponse<AdminViewUser[]> = await axios.get(`${apiBaseUrl}/users`);
  return response;
};

const activateUser = async (id: string): Promise<AxiosResponse<AdminViewUser>> => {
  const response: AxiosResponse<AdminViewUser> = await axios.put(`${apiBaseUrl}/users/activate/${id}`);
  return response;
};

const deactivateUser = async (id: string): Promise<AxiosResponse<AdminViewUser>> => {
  const response: AxiosResponse<AdminViewUser> = await axios.put(`${apiBaseUrl}/users/deactivate/${id}`);
  return response;
};

const hardDeleteUser = async (id: string): Promise<AxiosResponse<OwnUser>> => {
  const response: AxiosResponse<OwnUser> = await axios.delete(`${apiBaseUrl}/users/${id}`);
  return response;
};

export default { login, getUsers, activateUser, deactivateUser, hardDeleteUser };