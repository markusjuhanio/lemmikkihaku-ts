import { ActionCreator, Action, createAction } from '@reduxjs/toolkit';
import { AnyAction } from 'redux';
import { AuthorizedUser, OwnUser, RetryableAxiosRequestConfig } from '../types';
import axios, { AxiosError } from 'axios';
import { apiBaseUrl } from '../constants';
import { AppDispatch } from '../store';
import { setSessionExpired } from './sessionExpiredReducer';
import { handleUserSocketLogin, handleUserSocketLogout, setSocket } from '../socket';

const initialState: AuthorizedUser = {
  user: null,
  accessToken: '',
  refreshToken: ''
};

export const updateUser = createAction<OwnUser>('updateUser');

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
  const cookieDialogShowed = localStorage.getItem('cookieDialogShowed');
  const storedAdsState = localStorage.getItem('personalizedAdsEnabled');

  if (savedRequestInterceptor) {
    const savedRequestInterceptorId = JSON.parse(savedRequestInterceptor) as string;
    if (savedRequestInterceptorId) {
      axios.interceptors.request.eject(parseInt(savedRequestInterceptorId));
    }
  }

  if (savedResponseInterceptor) {
    const savedResponseInterceptorId = JSON.parse(savedResponseInterceptor) as string;
    if (savedResponseInterceptorId) {
      axios.interceptors.response.eject(parseInt(savedResponseInterceptorId));
    }
  }
  
  localStorage.clear();

  if (savedDarkMode) {
    localStorage.setItem('darkMode', savedDarkMode);
  }

  if (cookieDialogShowed) {
    localStorage.setItem('cookieDialogShowed', cookieDialogShowed);
  }

  if (storedAdsState) {
    localStorage.setItem('personalizedAdsEnabled', storedAdsState);
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
        console.log('Access token expired, retrying request...');
        return axios.post(apiBaseUrl + '/auth/refreshToken',
          {
            'refreshToken': savedRefreshToken
          })
          .then(res => {
            if (res.status === 200) {
              console.log('Setting new access token...');
              const newAccessToken = res.data as string;
              localStorage.setItem('accessToken', newAccessToken);
              axios.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
              setSocket(newAccessToken);
              return axios(originalRequest);
            }
          });
      } else {
        if (error.response.status === 419) {
          console.log('Session expired');
          dispatch(logout());
          setTimeout(() => {
            dispatch(setSessionExpired({ expired: true }));
          }, 50);
        }
      }
    }
    return Promise.reject(error);
  });

  localStorage.setItem('responseInterceptor', JSON.stringify(responseInterceptor));
  localStorage.setItem('requestInterceptor', JSON.stringify(requestInterceptor));
};

export const userReducer = (state = initialState, action: AnyAction): AuthorizedUser => {
  switch (action.type) {
  case 'login':
    handleUserSocketLogin(action.payload);
    return action.payload as AuthorizedUser;
  case 'autoLogin':
    handleUserSocketLogin(action.payload);
    return action.payload as AuthorizedUser;
  case 'updateUser':
    state.user = action.payload as OwnUser;
    localStorage.setItem('user', JSON.stringify(state.user));
    return state;
  case 'logout':
    state.user && (handleUserSocketLogout(state.user));
    return initialState;
  default:
    return state;
  }
};