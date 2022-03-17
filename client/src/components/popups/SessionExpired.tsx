import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { setSessionExpired } from '../../reducers/sessionExpiredReducer';
import { setLoginModal } from '../../reducers/loginModalReducer';

const SessionExpired = () => {
  const sessionExpired: boolean = useAppSelector(state => state.sessionExpired.expired);
  const dispatch = useAppDispatch();

  const handleClose = () => {
    dispatch(setSessionExpired({ expired: false }));
  };

  const handleLogin = () => {
    dispatch(setSessionExpired({ expired: false }));
    dispatch(setLoginModal({ opened: true, tab: 0 }));
  };

  return (
    <Dialog
      fullWidth
      maxWidth="xs"
      open={sessionExpired}
      onClose={handleClose}
      scroll={'paper'}
    >
      <DialogTitle>Istunto on vanhentunut</DialogTitle>
      <DialogContent dividers={true}>
        <DialogContentText>
          Istuntosi on vanhentunut. Jos haluat jatkaa palvelun käyttöä sisäänkirjautuneena, kirjaudu sisään uudelleen.
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={handleClose} color='secondary'>Peruuta</Button>
        <Button onClick={handleLogin} variant='contained' color='primary'>Kirjaudu sisään</Button>
      </DialogActions>
    </Dialog>
  );
};

export default SessionExpired;