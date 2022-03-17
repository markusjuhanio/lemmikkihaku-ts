import React, { MutableRefObject } from 'react';
import { ListItemIcon, MenuList, Fade, ListItemText, MenuItem, Menu, Divider, Switch } from '@mui/material';
import { Cookie, Login, Logout } from '@mui/icons-material';
import { LoggedUserView, OwnUser, ProfileHistory } from '../../types';
import { logout } from '../../reducers/userReducer';
import { useAppDispatch, useDarkModeHandler } from '../../hooks';
import Brightness4 from '@mui/icons-material/Brightness4';
import { setLoginModal } from '../../reducers/loginModalReducer';
import { useHistory } from 'react-router-dom';
import { profileViews } from '../../routes';
import { setCookieDialog } from '../../reducers/cookieDialogReducer';

interface UserMenuProps {
  open: boolean,
  handleClose: () => void,
  user: OwnUser | null,
  anchor: MutableRefObject<null>,
}

const UserMenu = (props: UserMenuProps) => {
  const { open, handleClose, user, anchor } = props;
  const dispatch = useAppDispatch();
  const darkMode = useDarkModeHandler();
  const history = useHistory<ProfileHistory>();

  const handleLogout = (): void => {
    handleClose();
    dispatch(logout());
  };

  const handleLogin = () => {
    handleClose();
    dispatch(setLoginModal({ opened: true, tab: 0 }));
  };

  const navigateToOwnPage = (tab: number): void => {
    history.push({
      pathname: '/oma-sivu',
      state: { tab: tab }
    });
    handleClose();
  };

  const showCookieDialog = (): void => {
    dispatch(setCookieDialog(true));
    handleClose();
  };

  return (
    <Menu
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={open}
      anchorEl={anchor.current}
      onClose={handleClose}
      TransitionComponent={Fade}
    >
      <MenuList dense>
        {user && (profileViews.map((view: LoggedUserView, i) => (
          <MenuItem key={i} onClick={() => navigateToOwnPage(i)}>
            <ListItemIcon>
              {view.icon}
            </ListItemIcon>
            <ListItemText>
              {view.title}
            </ListItemText>
          </MenuItem>
        ))
        )}

        {user && (
          <Divider />
        )}
        <MenuItem onClick={darkMode.handleChange}>
          <ListItemIcon>
            <Brightness4 color='secondary' fontSize="small" />
          </ListItemIcon>
          <ListItemText>Tumma teema</ListItemText>
          <Switch checked={darkMode.enabled} sx={{ ml: 2 }} size='small' />
        </MenuItem>
        <Divider />
        <MenuItem onClick={showCookieDialog}>
          <ListItemIcon>
            <Cookie color='secondary' fontSize="small" />
          </ListItemIcon>
          <ListItemText>Evästeasetukset</ListItemText>
        </MenuItem>
        <Divider />
        {user
          ? <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <Logout color='secondary' fontSize="small" />
            </ListItemIcon>
            <ListItemText>Kirjaudu ulos</ListItemText>
          </MenuItem>
          : <MenuItem onClick={handleLogin}>
            <ListItemIcon>
              <Login color='secondary' fontSize="small" />
            </ListItemIcon>
            <ListItemText>Kirjaudu sisään</ListItemText>
          </MenuItem>
        }
      </MenuList>
    </Menu>
  );
};

export default UserMenu;
