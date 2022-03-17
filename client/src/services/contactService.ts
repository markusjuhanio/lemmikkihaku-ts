import axios, { AxiosResponse } from 'axios';
import { apiBaseUrl } from '../constants';
import { Email } from '../types';

const sendEmail = async (data: Email): Promise<AxiosResponse<void>> => {
  const response = await axios.post(`${apiBaseUrl}/contact`, data);
  return response;
};

export default { sendEmail };