import React, { MutableRefObject } from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Fade, ListItemIcon, ListItemText, MenuList } from '@mui/material';
import { useAppDispatch } from '../../hooks';
import { logout } from '../../reducers/authReducer';
import { Logout } from '@mui/icons-material';

interface UserMenuProps {
  anchor: MutableRefObject<null>,
  open: boolean,
  handleClose: () => void
}

const UserMenu = (props: UserMenuProps) => {
  const { anchor, open, handleClose } = props;
  const dispatch = useAppDispatch();

  const handleLogout = (): void => {
    dispatch(logout());
  };

  return (
    <Menu
      open={open}
      anchorEl={anchor.current}
      onClose={handleClose}
      TransitionComponent={Fade}
    >
      <MenuList>
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          <ListItemText>Kirjaudu ulos</ListItemText>
        </MenuItem>
      </MenuList>
    </Menu>
  );
};

export default UserMenu;
