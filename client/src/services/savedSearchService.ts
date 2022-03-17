import axios, { AxiosResponse } from 'axios';
import { apiBaseUrl } from '../constants';
import { SearchProps, UserSearch } from '../types';

const createSearch = async (data: SearchProps): Promise<AxiosResponse<UserSearch>> => {
  const response = await axios.post(`${apiBaseUrl}/searches`, data);
  return response;
};

const getOwnSearches = async (): Promise<AxiosResponse<UserSearch[]>> => {
  const response = await axios.get(`${apiBaseUrl}/searches`);
  return response;
};

const deleteOwnSearch = async (id: string): Promise<AxiosResponse<UserSearch>> => {
  const response = await axios.delete(`${apiBaseUrl}/searches/${id}`);
  return response;
};

export default { createSearch, getOwnSearches, deleteOwnSearch };