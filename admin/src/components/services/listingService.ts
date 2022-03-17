import axios, { AxiosResponse } from 'axios';
import { apiBaseUrl } from '../../constants';
import { AdminViewListing } from '../../types';

const getListings = async (): Promise<AxiosResponse<AdminViewListing[]>> => {
  const response = await axios.get(`${apiBaseUrl}/listings`);
  return response;
};

const getListing = async (id: string): Promise<AxiosResponse<AdminViewListing>> => {
  const response = await axios.get(`${apiBaseUrl}/listings/${id}`);
  return response;
};

const activateListing = async (id: string): Promise<AxiosResponse<AdminViewListing>> => {
  const response = await axios.put(`${apiBaseUrl}/listings/activate/${id}`);
  return response;
};

const rejectListing = async (id: string): Promise<AxiosResponse<AdminViewListing>> => {
  const response = await axios.put(`${apiBaseUrl}/listings/reject/${id}`);
  return response;
};

const restoreListing = async (id: string): Promise<AxiosResponse<AdminViewListing>> => {
  const response = await axios.put(`${apiBaseUrl}/listings/restore/${id}`);
  return response;
};

const softDeleteListing = async (id: string): Promise<AxiosResponse<AdminViewListing>> => {
  const response = await axios.delete(`${apiBaseUrl}/listings/soft/${id}`);
  return response;
};

const hardDeleteListing = async (id: string): Promise<AxiosResponse<AdminViewListing>> => {
  const response = await axios.delete(`${apiBaseUrl}/listings/hard/${id}`);
  return response;
};

export default { getListings, getListing, activateListing, rejectListing, restoreListing, softDeleteListing, hardDeleteListing };