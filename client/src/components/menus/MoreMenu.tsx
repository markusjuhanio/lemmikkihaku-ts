import React, { MutableRefObject } from 'react';
import { MenuList, Fade, ListItemText, MenuItem, Menu } from '@mui/material';
import { useHistory } from 'react-router-dom';

interface UserMenuProps {
  open: boolean,
  handleClose: () => void,
  anchor: MutableRefObject<null>,
}

const MoreMenu = (props: UserMenuProps) => {
  const { open, handleClose, anchor } = props;
  
  const history = useHistory();

  const navigateTo = (path: string) => {
    history.push(path);
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
        <MenuItem onClick={() => navigateTo('/tietoa')}>
          <ListItemText>Tietoa palvelusta</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => navigateTo('/kayttoehdot')}>
          <ListItemText>Käyttöehdot</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => navigateTo('/rekisteriseloste')}>
          <ListItemText>Rekisteri- ja tietosuojaseloste</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => navigateTo('/ota-yhteytta')}>
          <ListItemText>Ota yhteyttä</ListItemText>
        </MenuItem>
      </MenuList>
    </Menu>
  );
};

export default MoreMenu;
