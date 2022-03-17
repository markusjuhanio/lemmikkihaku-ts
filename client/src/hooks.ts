import { useEffect, useState } from 'react';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { setDarkMode } from './reducers/darkModeReducer';
import { autoLogin, logout } from './reducers/userReducer';
import type { RootState, AppDispatch } from './store';
import { AuthorizedUser, OwnUser, PublicConversation, SocketAction, TypingUser, UserStatus, Notification, PublicMessage, NotificationType, PublicListing } from './types';
import { getStoredSelectedConversationId, isDarkModeSelected, isEmptyString, setMetaColor } from './utils';
import { socket } from './socket';
import { addConversation, addMessage, setConversations } from './reducers/conversationsReducer';
import { setSessionExpired } from './reducers/sessionExpiredReducer';
import axios from 'axios';
import { apiBaseUrl } from './constants';
import notificationService from './services/notificationService';
import { addNotification, setNotifications } from './reducers/notificationsReducer';
import conversationService from './services/conversationService';
import { addListing, deleteListing, updateListing } from './reducers/listingsReducer';
import { useMediaQuery } from '@mui/material';

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
    clear,
    setValue
  };
};

export const useDocumentTitle = (title: string) => {
  useEffect(() => {
    document.title = `${title} | Lemmikkihaku`;
  });
};

export const useIsLoggedIn = (): boolean => {
  const user: AuthorizedUser = useAppSelector(state => state.user);
  if (user.user && !isEmptyString(user.accessToken) && !isEmptyString(user.refreshToken)) {
    return true;
  }
  return false;
};

export const useAutoLogin = (): void => {
  const dispatch = useDispatch();

  useEffect(() => {

    async function checkSession(): Promise<void> {
      console.log('Checking token...');
      try {
        await axios.get(apiBaseUrl + '/auth/checkToken');
        console.log('Token ok.');
      } catch (error) {
        console.log('Session expired.');
        dispatch(logout());
        dispatch(setSessionExpired({ expired: true }));
      }
    }

    const storedUser: string | null = localStorage.getItem('user');
    const accessToken: string | null = localStorage.getItem('accessToken');
    const refreshToken: string | null = localStorage.getItem('refreshToken');

    if (storedUser && accessToken && refreshToken) {
      const user = JSON.parse(storedUser) as OwnUser;

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
    }
  }, []);
};

export const usePrefersDarkMode = (): void => {
  const dispatch = useAppDispatch();
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  if (isDarkModeSelected() === null) {
    if (prefersDarkMode) {
      dispatch(setDarkMode({ enabled: true }));
      setMetaColor(true);
    }
  }
};

export const useDarkModeHandler = () => {
  const enabled = useAppSelector(state => state.darkMode.enabled);
  const dispatch = useAppDispatch();

  const handleChange = () => {
    dispatch(setDarkMode({ enabled: !enabled }));
    setMetaColor(!enabled);
  };

  return {
    enabled,
    handleChange
  };
};

export const useDetectAdblock = () => {
  const [detected, setDetected] = useState<boolean>(false);

  useEffect(() => {
    async function detect(): Promise<void> {
      const googleAdUrl = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
      try {
        await fetch(new Request(googleAdUrl));
      } catch (e) {
        setDetected(true);
      }
    }
    void detect();
  }, []);

  return {
    detected
  };
};

export const useIsUserOnline = (userId: string): boolean | null => {
  const [online, setOnline] = useState<boolean | null>(null);
  useEffect(() => {
    socket.emit(SocketAction.IS_USER_ONLINE, { userId: userId });
    socket.on(SocketAction.USER_STATUS, (data: UserStatus) => {
      if (data.userId === userId) {
        setOnline(data.online);
      }
    });
  }, [socket]);
  return online;
};

export const useUsersTypingToMe = (): TypingUser[] => {
  const [users, setUsers] = useState<TypingUser[]>([]);
  useEffect(() => {
    socket.on(SocketAction.START_TYPING_MESSAGE, (data: TypingUser[]) => {
      setUsers(data);
    });
    socket.on(SocketAction.STOP_TYPING_MESSAGE, (data: TypingUser[]) => {
      setUsers(data);
    });
    return () => {
      socket.off(SocketAction.START_TYPING_MESSAGE);
      socket.off(SocketAction.STOP_TYPING_MESSAGE);
    };
  }, []);
  return users;
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

export const useListenForConversations = (): void => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    socket.on(SocketAction.NEW_CONVERSATION, (data: PublicConversation) => {
      dispatch(addConversation(data));
    });
    return () => {
      socket.off(SocketAction.NEW_CONVERSATION);
    };
  }, [socket]);
};

export const useListenForMessages = (): void => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    socket.on(SocketAction.NEW_MESSAGE, (data: PublicMessage) => {
      dispatch(addMessage(data));
    });
    return () => {
      socket.off(SocketAction.NEW_MESSAGE);
    };
  }, [socket]);
};

export const useListenForListings = (): void => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    socket.on(SocketAction.LISTING_ACTIVATED, (data: PublicListing) => {
      dispatch(addListing(data));
    });

    socket.on(SocketAction.LISTING_REJECTED, (data: PublicListing) => {
      dispatch(updateListing(data));
    });

    socket.on(SocketAction.LISTING_RESTORED, (data: PublicListing) => {
      dispatch(addListing(data));
    });

    socket.on(SocketAction.LISTING_RENEWED, (data: PublicListing) => {
      dispatch(updateListing(data));
    });

    socket.on(SocketAction.LISTING_DELETED, (data: PublicListing) => {
      dispatch(deleteListing(data.id));
    });
  }, []);
};

export const useListenForNotifications = (): void => {
  const dispatch = useAppDispatch();

  async function remove(id: string) {
    await notificationService.deleteNotification(id);
  }

  useEffect(() => {
    socket.on(SocketAction.NOTIFICATION, (data: Notification) => {
      const type = data.type;
      if (type === NotificationType.NEW_MESSAGE) {
        const storedConversation = getStoredSelectedConversationId();
        if (storedConversation) {
          const resource = data.resource as PublicMessage;
          if (storedConversation === resource.conversationId) {
            void remove(data.id);
            return;
          }
        }
      }
      dispatch(addNotification(data));
    });
    return () => {
      socket.off(SocketAction.NOTIFICATION);
    };
  }, [socket]);
};

export const useLoadNotifications = (): void => {
  const isLoggedIn = useIsLoggedIn();
  const dispatch = useAppDispatch();
  useEffect(() => {
    async function get() {
      const response = await notificationService.getOwnNotifications();
      const notifications: Notification[] = response.data;
      dispatch(setNotifications(notifications));
    }
    if (isLoggedIn) {
      void get();
    }
  }, [isLoggedIn]);
};

export const useLoadConversations = (): void => {
  const isLoggedIn = useIsLoggedIn();
  const dispatch = useAppDispatch();
  useEffect(() => {
    async function get() {
      const response = await conversationService.getConversations();
      const conversations: PublicConversation[] = response.data;
      dispatch(setConversations(conversations));
    }
    if (isLoggedIn) {
      void get();
    }
  }, [isLoggedIn]);
};

export const useScrollTop = (): void => {
  useEffect(() => {
    window.scroll({ top: 0 });
  }, []);
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

export const useLoader = (isLoading?: boolean) => {
  const [loading, setLoading] = useState<boolean>(isLoading ? isLoading : false);

  const start = () => {
    setLoading(true);
  };

  const stop = () => {
    setLoading(false);
  };

  return {
    start,
    stop,
    loading
  };
};