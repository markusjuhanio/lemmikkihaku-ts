import { useEffect, useState } from 'react';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { setDarkMode } from './reducers/darkModeReducer';
import { autoLogin, logout } from './reducers/authReducer';
import type { RootState, AppDispatch } from './store';
import { AdminViewListing, AdminViewUser, AuthorizedUser, OwnUser, Role, SocketAction } from './types';
import { isEmptyString } from './utils';
import listingService from './components/services/listingService';
import { addListing, setListings } from './reducers/listingsReducer';
import userService from './components/services/userService';
import { setUsers } from './reducers/usersReducer';
import axios from 'axios';
import { apiBaseUrl } from './constants';
import { socket } from './socket';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useField = (type: string) => {
  const [value, setValue] = useState('');

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  const clear = () => {
    setValue('');
  };

  return {
    type,
    value,
    onChange,
    clear
  };
};

export const useDocumentTitle = (title: string) => {
  useEffect(() => {
    document.title = `${title} | Lemmikkihaku - Admin`;
  });
};

export const useIsLoggedIn = (): boolean => {
  const auth: AuthorizedUser = useAppSelector(state => state.auth);
  if (auth.user && !isEmptyString(auth.accessToken) && !isEmptyString(auth.refreshToken)) {
    return true;
  }
  return false;
};

export const useAutoLogin = (): void => {
  const dispatch = useDispatch();

  async function checkSession(): Promise<void> {
    console.log('Checking token...');
    try {
      await axios.get(apiBaseUrl + '/auth/checkToken');
      console.log('Token ok.');
    } catch (error) {
      console.log('Session expired.');
      dispatch(logout());
    }
  }


  useEffect(() => {
    const storedUser: string | null = localStorage.getItem('user');
    const accessToken: string | null = localStorage.getItem('accessToken');
    const refreshToken: string | null = localStorage.getItem('refreshToken');

    if (storedUser && accessToken && refreshToken) {
      const user = JSON.parse(storedUser) as OwnUser;

      if (user.role !== Role.Admin) {
        dispatch(logout());
        return;
      }

      if (user && accessToken && refreshToken) {
        const authorizedUser: AuthorizedUser = {
          user: user,
          accessToken: accessToken,
          refreshToken: refreshToken
        };
        dispatch(autoLogin(authorizedUser));
        setTimeout(() => {
          void checkSession();
        }, 500);
      }
    } else {
      dispatch(logout());
    }
  }, []);
};

export const useDarkModeHandler = () => {
  const enabled = useAppSelector(state => state.darkMode.enabled);
  const dispatch = useAppDispatch();

  const handleChange = () => {
    const newMode = !enabled;
    dispatch(setDarkMode({ enabled: newMode }));
  };

  return {
    enabled,
    handleChange
  };
};

export const useLoadListings = (): void => {
  const isLoggedIn = useIsLoggedIn();
  const dispatch = useDispatch();
  useEffect(() => {
    async function listings() {
      const response = await listingService.getListings();
      const listings: AdminViewListing[] = response.data;
      dispatch(setListings(listings));
    }
    if (isLoggedIn) {
      void listings();
    }
  }, [isLoggedIn]);
};

export const useLoadUsers = (): void => {
  const isLoggedIn = useIsLoggedIn();
  const dispatch = useDispatch();
  useEffect(() => {
    async function listings() {
      const response = await userService.getUsers();
      const users: AdminViewUser[] = response.data;
      dispatch(setUsers(users));
    }
    if (isLoggedIn) {
      void listings();
    }
  }, [isLoggedIn]);
};

export const useUsersOnlineCount = (): number | null => {
  const [count, setCount] = useState<number | null>(null);
  useEffect(() => {
    socket.emit(SocketAction.ONLINE_USERS);
    socket.on(SocketAction.ONLINE_USERS, (data: number) => {
      setCount(data);
    });
  }, [socket]);
  return count;
};

export const useListenForListings = (): void => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    socket.on(SocketAction.LISTING_WAITING_ACTIVATION, (data: AdminViewListing) => {
      dispatch(addListing(data));
    });
    return () => {
      socket.off(SocketAction.LISTING_WAITING_ACTIVATION);
    };
  }, [socket]);
};

export const useSocketConnectionStatusListener = (): void => {
  useEffect(() => {
    socket.on(('connect'), () => {
      console.log('Socket connected.');
    });
    socket.on(('disconnect'), () => {
      console.log('Socket disconnected.');
      socket.connect();
    });
  }, []);
};