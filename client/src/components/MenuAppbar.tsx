import React, { lazy, Suspense, useEffect, useRef, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import AccountCircle from '@mui/icons-material/AccountCircle';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import { Paper, Tab, Tabs, useTheme, Theme, Badge } from '@mui/material';
import Logo from './Logo';
import { useHistory, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector, useIsLoggedIn } from '../hooks';
import UserAvatar from './UserAvatar';
import { OwnUser, Notification } from '../types';
import { setDefaultSearchProps } from '../reducers/searchPropsReducer';
import { MoreHoriz, Notifications } from '@mui/icons-material';
import { setMoreFilters } from '../reducers/moreFiltersReducer';
import { setDefaultLastSavedSearch } from '../reducers/lastSavedSearch';

const UserMenu = lazy(() => import('./menus/UserMenu'));
const MoreMenu = lazy(() => import('./menus/MoreMenu'));
const NotificationsMenu = lazy(() => import('./menus/NotificationsMenu'));

const MenuAppbar = () => {
  const [selectedTab, setSelectedTab] = useState<string | boolean>('/');
  const history = useHistory();
  const dispatch = useAppDispatch();
  const location = useLocation();
  const user: OwnUser | null = useAppSelector(state => state.user.user);
  const notifications: Notification[] = useAppSelector(state => state.notifications);
  const isLoggedIn: boolean = useIsLoggedIn();
  const theme: Theme = useTheme();
  const userMenuRef = useRef(null);
  const [userMenuOpen, setUserMenuOpen] = useState<boolean>(false);
  const moreMenuRef = useRef(null);
  const [moreMenuOpen, setMoreMenuOpen] = useState<boolean>(false);
  const notificationsMenuRef = useRef(null);
  const [notificationsMenuOpen, setNotificationsMenuOpen] = useState<boolean>(false);

  const tabValues = ['/', '/ilmoita'];

  useEffect(() => {
    if (location) {
      setSelectedTab(tabValues.includes(location.pathname) ? location.pathname : false);
    }
  }, [location]);

  const handleTabChange = (_event: unknown, value: string): void => {
    dispatch(setDefaultSearchProps());
    dispatch(setDefaultLastSavedSearch());
    dispatch(setMoreFilters({ visible: false }));
    setSelectedTab(value);
    history.push(value);
  };

  return (
    <Paper>
      <AppBar position="static" sx={{
        color: 'text.primary',
        borderRadius: theme.shape.borderRadius,
        background: 'transparent',
        border: 'none',
        boxShadow: 'none',
        minHeight: 60,
        mb: 2,
      }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>

          <Logo src='/logo/res/mipmap-xxxhdpi/lemmikkihaku_logo.png' width={50} height={40} />

          <Box>
            <Tabs value={selectedTab} onChange={handleTabChange}>
              <Tab
                sx={{ minWidth: { xs: 60, sm: 100 }, maxWidth: { xs: 90, sm: 130 } }}
                icon={<SearchIcon />}
                label='Hae'
                value={tabValues[0]}
              />
              <Tab
                sx={{ minWidth: { xs: 60, sm: 100 }, maxWidth: { xs: 90, sm: 130 } }}
                icon={<EditIcon />}
                label='Ilmoita'
                value={tabValues[1]}
              />
            </Tabs>
          </Box>

          <Box>
            <Box sx={{ display: { xs: 'none', sm: 'inline-block' } }}>
              <IconButton color='secondary' ref={moreMenuRef} onClick={() => setMoreMenuOpen(true)}>
                <MoreHoriz />
              </IconButton>
            </Box>
            {isLoggedIn &&
              (<IconButton ref={notificationsMenuRef} onClick={() => setNotificationsMenuOpen(true)}>
                <Badge badgeContent={notifications.filter(notif => notif.checked === false).length} color='primary'>
                  <Notifications color='secondary' />
                </Badge>
              </IconButton>
              )}
            <IconButton ref={userMenuRef} onClick={() => setUserMenuOpen(true)}>
              {user && isLoggedIn
                ? <UserAvatar statusVisible={true} name={user.nickname} color={user.avatarColor} size={34} id={user.id} />
                : <AccountCircle color='secondary' />
              }
            </IconButton>
          </Box>
        </Toolbar>

        <Suspense fallback={null}>
          <UserMenu anchor={userMenuRef} user={user} handleClose={() => setUserMenuOpen(false)} open={userMenuOpen} />
          <MoreMenu anchor={moreMenuRef} handleClose={() => setMoreMenuOpen(false)} open={moreMenuOpen} />
          <NotificationsMenu notifications={notifications} anchor={notificationsMenuRef} handleClose={() => setNotificationsMenuOpen(false)} open={notificationsMenuOpen} />
        </Suspense>
      </AppBar>
    </Paper>
  );
};

export default MenuAppbar;
