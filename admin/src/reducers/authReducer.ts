import { ActionCreator, Action } from '@reduxjs/toolkit';
import { AnyAction } from 'redux';
import { AuthorizedUser, RetryableAxiosRequestConfig, Role } from '../types';
import axios, { AxiosError } from 'axios';
import { apiBaseUrl } from '../constants';
import { AppDispatch } from '../store';
import { handleUserSocketLogin } from '../socket';

const initialState: AuthorizedUser = {
  user: null,
  accessToken: '',
  refreshToken: ''
};

export const login = (user: AuthorizedUser): (dispatch: AppDispatch) => void => {
  return (dispatch: AppDispatch) => {

    localStorage.setItem('user', JSON.stringify(user.user));
    localStorage.setItem('accessToken', user.accessToken);
    localStorage.setItem('refreshToken', user.refreshToken);

    handleAxiosInterceptors(dispatch);
    dispatch({
      type: 'login',
      payload: user
    });
  };
};

export const autoLogin = (user: AuthorizedUser): (dispatch: AppDispatch) => void => {
  return (dispatch: AppDispatch) => {
    handleAxiosInterceptors(dispatch);
    dispatch({
      type: 'login',
      payload: user
    });
  };
};

export const logout: ActionCreator<Action> = () => {
  const savedRequestInterceptor = localStorage.getItem('requestInterceptor');
  const savedResponseInterceptor = localStorage.getItem('savedResponseInterceptor');
  const savedDarkMode = localStorage.getItem('darkMode');

  if (savedRequestInterceptor) {
    axios.interceptors.request.eject(JSON.parse(savedRequestInterceptor));
  }

  if (savedResponseInterceptor) {
    axios.interceptors.response.eject(JSON.parse(savedResponseInterceptor));
  }

  localStorage.clear();

  if (savedDarkMode) {
    localStorage.setItem('darkMode', savedDarkMode);
  }

  return {
    type: 'logout',
    payload: initialState
  };
};

const handleAxiosInterceptors = (dispatch: AppDispatch) => {
  const responseInterceptor: number = axios.interceptors.request.use(
    config => {
      const savedAccessToken = localStorage.getItem('accessToken');
      if (savedAccessToken) {
        config.headers['Authorization'] = `Bearer ${savedAccessToken}`;
      }
      return config;
    },
    error => {
      return Promise.reject(error);
    });
  const requestInterceptor: number = axios.interceptors.response.use((response) => {
    return response;
  },
  function (error: AxiosError) {
    const originalRequest: RetryableAxiosRequestConfig = error.config;
    if (error.response?.status) {
      const savedRefreshToken = localStorage.getItem('refreshToken');
      if (error.response.status === 401 && !originalRequest.isRetried && savedRefreshToken) {
        originalRequest.isRetried = true;
        console.log('Access token was expired, retrying request');
        return axios.post(apiBaseUrl + '/auth/refreshToken',
          {
            'refreshToken': savedRefreshToken
          })
          .then(res => {
            if (res.status === 200) {
              console.log('Setting new access token');
              const newAccessToken = res.data as string;
              localStorage.setItem('accessToken', newAccessToken);
              axios.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
              return axios(originalRequest);
            }
          });
      } else {
        if (error.response.status === 419) {
          console.log('Session expired');
          dispatch(logout());
        }
      }
    }

    return Promise.reject(error);
  });

  localStorage.setItem('responseInterceptor', JSON.stringify(responseInterceptor));
  localStorage.setItem('requestInterceptor', JSON.stringify(requestInterceptor));
};

export const authReducer = (state = initialState, action: AnyAction): AuthorizedUser => {
  switch (action.type) {
  case 'login':
    if (action.payload.user.role !== Role.Admin) {
      return initialState;
    }
    handleUserSocketLogin(action.payload);
    return action.payload as AuthorizedUser;
  case 'autoLogin':
    handleUserSocketLogin(action.payload);
    return action.payload as AuthorizedUser;
  case 'logout':
    return initialState;
  default:
    return state;
  }
};