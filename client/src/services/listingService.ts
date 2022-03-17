import axios, { AxiosResponse } from 'axios';
import { apiBaseUrl } from '../constants';
import { ListingEntry, PaginatedPublicListings, PublicListing, SearchProps } from '../types';

const getListings = async (): Promise<AxiosResponse<PublicListing[]>> => {
  const response = await axios.get(`${apiBaseUrl}/listings/activated`);
  return response;
};

const getListing = async (id: string): Promise<AxiosResponse<PublicListing>> => {
  const response = await axios.get(`${apiBaseUrl}/listings/activated/${id}`);
  return response;
};

const createListing = async (newListing: ListingEntry): Promise<AxiosResponse<PublicListing>> => {
  const response = await axios.post(`${apiBaseUrl}/listings`, newListing);
  return response;
};

const updateListing = async (id: string, newListing: ListingEntry): Promise<AxiosResponse<PublicListing>> => {
  const response = await axios.put(`${apiBaseUrl}/listings/${id}`, newListing);
  return response;
};

const searchListings = async (props: SearchProps): Promise<AxiosResponse<PaginatedPublicListings>> => {
  const response = await axios.post(`${apiBaseUrl}/listings/search`, props);
  return response;
};

const softDeleteListing = async (id: string): Promise<AxiosResponse<PublicListing>> => {
  const response = await axios.delete(`${apiBaseUrl}/listings/soft/${id}`);
  return response;
};

const renewListing = async (id: string): Promise<AxiosResponse<PublicListing>> => {
  const response = await axios.put(`${apiBaseUrl}/listings/renew/${id}`);
  return response;
};

export default { getListings, renewListing, getListing, softDeleteListing, searchListings, createListing, updateListing };