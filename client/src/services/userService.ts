import axios, { AxiosResponse } from 'axios';
import { apiBaseUrl } from '../constants';
import { AuthorizedUser, LoginData, OwnListing, OwnUser, PublicListing, RegisterData, UserSaveableSettings } from '../types';

const login = async (data: LoginData): Promise<AxiosResponse<AuthorizedUser>> => {
  const response: AxiosResponse<AuthorizedUser> = await axios.post(`${apiBaseUrl}/auth/login`, data);
  return response;
};

const register = async (data: RegisterData): Promise<AxiosResponse<OwnUser>> => {
  const response: AxiosResponse<OwnUser> = await axios.post(`${apiBaseUrl}/auth/register`, data);
  return response;
};

const addFavoriteListing = async (id: string, listingId: string): Promise<AxiosResponse<OwnUser>> => {
  const response = await axios.put(`${apiBaseUrl}/users/addFavoriteListing/${id}`, { listingId: listingId });
  return response;
};

const getFavoriteListings = async (id: string): Promise<AxiosResponse<PublicListing[]>> => {
  const response = await axios.get(`${apiBaseUrl}/users/favoriteListings/${id}`);
  return response;
};

const getOwnListings = async (id: string): Promise<AxiosResponse<OwnListing[]>> => {
  const response = await axios.get(`${apiBaseUrl}/users/listings/${id}`);
  return response;
};

const saveSettings = async (id: string, data: UserSaveableSettings): Promise<AxiosResponse<OwnUser>> => {
  const response = await axios.put(`${apiBaseUrl}/users/settings/${id}`, data);
  return response;
};

const deleteUser = async (id: string): Promise<AxiosResponse<void>> => {
  const response = await axios.delete(`${apiBaseUrl}/users/${id}`);
  return response;
};

export default { login, deleteUser, register, saveSettings, addFavoriteListing, getFavoriteListings, getOwnListings };