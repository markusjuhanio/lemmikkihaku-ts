import React, { lazy, Suspense, useEffect, useRef, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import { Tab, Tabs, Tooltip } from '@mui/material';
import Logo from './Logo';
import { useHistory, useLocation } from 'react-router-dom';
import { useAppSelector, useDarkModeHandler } from '../hooks';
import UserAvatar from './UserAvatar';
import { AuthorizedUser } from '../types';
import { Brightness4, Face, ListAlt } from '@mui/icons-material';

const UserMenu = lazy(() => import('./menus/UserMenu'));

const MenuAppbar = () => {
  const [selectedTab, setSelectedTab] = useState<string | boolean>(false);
  const history = useHistory();
  const location = useLocation();
  const auth: AuthorizedUser = useAppSelector(state => state.auth);

  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  const darkMode = useDarkModeHandler();

  const tabValues = ['/users', '/listings'];

  const handleTabChange = (_event: unknown, value: string): void => {
    setSelectedTab(value);
    history.push(value);
  };

  const closeUserMenu = (): void => {
    setUserMenuOpen(false);
  };

  useEffect(() => {
    if (location) {
      setSelectedTab(tabValues.includes(location.pathname) ? location.pathname : false);
    }
  }, [location]);

  return (
    <AppBar sx={{
      bgcolor: 'background.paper',
      color: 'text.primary',
      borderRadius: '15px',
      minHeight: 60,
      mb: 2,
    }} position="static">
      <Toolbar sx={{ justifyContent: 'space-between' }}>

        <Box>
          <Logo src='/logo/res/mipmap-xxxhdpi/lemmikkihaku_logo.png' width={45} height={35} />
        </Box>

        <Box>
          <Tabs value={selectedTab} onChange={handleTabChange}>
            <Tab sx={{ minHeight: 65, minWidth: { xs: '70px', sm: '100px' } }} icon={<Tooltip title='Käyttäjät'><Face fontSize='large' /></Tooltip>} value={tabValues[0]} />
            <Tab sx={{ minHeight: 60, minWidth: { xs: '70px', sm: '100px' } }} icon={<Tooltip title='Ilmoitukset'><ListAlt fontSize='large' /></Tooltip>} value={tabValues[1]} />
          </Tabs>
        </Box>

        <Box>
          <IconButton onClick={darkMode.handleChange} color='secondary'>
            <Brightness4 fontSize={'large'} />
          </IconButton>
          <IconButton ref={userMenuRef} onClick={() => setUserMenuOpen(true)}>
            <UserAvatar name={auth.user?.nickname} color={auth.user?.avatarColor} size={34} />
          </IconButton>
        </Box>

      </Toolbar>
      {auth && auth.user && (
        <Suspense fallback={null}>
          <UserMenu anchor={userMenuRef} handleClose={closeUserMenu} open={userMenuOpen} />
        </Suspense>
      )}
    </AppBar>
  );
};

export default MenuAppbar;
