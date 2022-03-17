import React from 'react';
import { Fade, Menu, MenuList, MenuItem, ListItemIcon, ListItemText, Divider } from '@mui/material';
import { Check, Restore, HideSource, Delete, Block } from '@mui/icons-material';
import { AdminViewListing } from '../../../types';
import { confirm } from '../../../utils';
import listingService from '../../services/listingService';
import { deleteListing, updateListing } from '../../../reducers/listingsReducer';
import { useDispatch } from 'react-redux';

interface ListingActionMenu {
  selectedListing: AdminViewListing,
  actionMenuRef: EventTarget & HTMLButtonElement,
  onClose: () => void,
  open: boolean
}

const ActionMenu = (props: ListingActionMenu) => {
  const { selectedListing, actionMenuRef, onClose, open } = props;
  const dispatch = useDispatch();

  const handleActivation = async (): Promise<void> => {
    onClose();
    const confirmed: boolean = await confirm(`Vahvista ilmoituksen ${selectedListing.title} aktivointi.`);
    if (confirmed) {
      try {
        const response = await listingService.activateListing(selectedListing?.id);
        const updatedListing: AdminViewListing = response.data;
        dispatch(updateListing(updatedListing));
      } catch (error) {
        console.log('Error activating listing:', error);
      }
    }
  };

  const handleRejection = async (): Promise<void> => {
    onClose();
    const confirmed: boolean = await confirm(`Vahvista ilmoituksen ${selectedListing.title} hylkääminen.`);
    if (confirmed) {
      try {
        const response = await listingService.rejectListing(selectedListing?.id);
        const updatedListing: AdminViewListing = response.data;
        dispatch(updateListing(updatedListing));
      } catch (error) {
        console.log('Error deactivating listing:', error);
      }
    }
  };

  const handleRestore = async (): Promise<void> => {
    onClose();
    const confirmed: boolean = await confirm(`Vahvista ilmoituksen ${selectedListing.title} palauttaminen.`);
    if (confirmed) {
      try {
        const response = await listingService.restoreListing(selectedListing?.id);
        const updatedListing: AdminViewListing = response.data;
        dispatch(updateListing(updatedListing));
      } catch (error) {
        console.log('Error restoring listing:', error);
      }
    }
  };

  const handleSoftDelete = async (): Promise<void> => {
    onClose();
    const confirmed: boolean = await confirm(`Vahvista ilmoituksen ${selectedListing.title} poistaminen.`);
    if (confirmed) {
      try {
        const response = await listingService.softDeleteListing(selectedListing?.id);
        const updatedListing: AdminViewListing = response.data;
        dispatch(updateListing(updatedListing));
      } catch (error) {
        console.log('Error soft deleting listing:', error);
      }
    }
  };

  const handleHardDelete = async (): Promise<void> => {
    onClose();
    const confirmed: boolean = await confirm(`Vahvista ilmoituksen ${selectedListing.title} poistaminen. Ilmoitus poistetaan pysyvästi eikä sitä ole mahdollista palauttaa.`);
    if (confirmed) {
      try {
        const response = await listingService.hardDeleteListing(selectedListing?.id);
        const deletedListing: AdminViewListing = response.data;
        dispatch(deleteListing(deletedListing.id));
      } catch (error) {
        console.log('Error hard deleting listing:', error);
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
        <MenuItem disabled={selectedListing?.activated === 1 || selectedListing?.rejected === 1} onClick={handleActivation}>
          <ListItemIcon>
            <Check />
          </ListItemIcon>
          <ListItemText>Hyväksy</ListItemText>
        </MenuItem>
        <MenuItem disabled={selectedListing?.activated === 1 || selectedListing?.rejected === 1} onClick={handleRejection}>
          <ListItemIcon>
            <Block />
          </ListItemIcon>
          <ListItemText>Hylkää</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem disabled={selectedListing?.deleted === 0} onClick={handleRestore}>
          <ListItemIcon>
            <Restore />
          </ListItemIcon>
          <ListItemText>Palauta</ListItemText>
        </MenuItem>
        <MenuItem disabled={selectedListing?.deleted === 1} onClick={handleSoftDelete}>
          <ListItemIcon>
            <HideSource />
          </ListItemIcon>
          <ListItemText>Poista</ListItemText>
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