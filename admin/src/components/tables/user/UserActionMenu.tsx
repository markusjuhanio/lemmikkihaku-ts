import React from 'react';
import { Fade, Menu, MenuList, MenuItem, ListItemIcon, ListItemText, Divider } from '@mui/material';
import { Block, CheckCircle, Delete } from '@mui/icons-material';
import { AdminViewUser, OwnUser } from '../../../types';
import { confirm } from '../../../utils';
import { deleteUser, updateUser } from '../../../reducers/usersReducer';
import userService from '../../services/userService';
import { useDispatch } from 'react-redux';

interface ListingActionMenu {
  selectedUser: AdminViewUser,
  actionMenuRef: EventTarget & HTMLButtonElement,
  open: boolean,
  onClose: () => void
}

const ActionMenu = (props: ListingActionMenu) => {
  const { selectedUser, actionMenuRef, open, onClose } = props;
  const dispatch = useDispatch();

  const handleActivation = async (): Promise<void> => {
    onClose();
    if (selectedUser) {
      const confirmed = await confirm(`Vahvista käyttäjän ${selectedUser.nickname} tilan muutos.`);
      if (confirmed) {
        try {
          let updatedUser: AdminViewUser;
          if (selectedUser.activated === 1) {
            const response = await userService.deactivateUser(selectedUser?.id);
            updatedUser = response.data;
          } else {
            const response = await userService.activateUser(selectedUser?.id);
            updatedUser = response.data;
          }
          dispatch(updateUser(updatedUser));
        } catch (error) {
          console.log('Error activating user:', error);
        }
      }
    }
  };

  const handleHardDelete = async (): Promise<void> => {
    onClose();
    if (selectedUser) {
      const confirmed = await confirm(`Vahvista käyttäjän ${selectedUser.nickname} poistaminen.`);
      if (confirmed) {
        try {
          const response = await userService.hardDeleteUser(selectedUser?.id);
          const deletedUser: OwnUser = response.data;
          dispatch(deleteUser(deletedUser.id));
        } catch (error) {
          console.log('Error activating user:', error);
        }
      }
    }
  };

  return (
    <Menu
      open={open}
      onClose={onClose}
      anchorEl={actionMenuRef}
      TransitionComponent={Fade}
    >
      <MenuList>
        <MenuItem onClick={handleActivation}>
          <ListItemIcon>
            {selectedUser?.activated ? <Block /> : <CheckCircle />}
          </ListItemIcon>
          <ListItemText>{selectedUser?.activated ? 'Deaktivoi' : 'Aktivoi'}</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleHardDelete}>
          <ListItemIcon>
            <Delete />
          </ListItemIcon>
          <ListItemText>Poista pysyvästi</ListItemText>
        </MenuItem>
      </MenuList>
    </Menu>
  );
};

export default ActionMenu;