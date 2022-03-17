import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { ThemeProvider } from '@mui/material';
import { DARK_THEME, LIGHT_THEME } from '../../themes';
import { isDarkModeSelected } from '../../utils';

interface ConfirmPopupProps {
  text: string,
  resolve: (value: boolean | PromiseLike<boolean>) => void
}

const Confirm = (props: ConfirmPopupProps) => {
  const { text, resolve } = props;
  const [open, setOpen] = useState<boolean>(true);

  const handleClose = (): void => {
    setOpen(false);
  };

  const handleCancel = (): void => {
    resolve(false);
    handleClose();
  };

  const handleConfirm = (): void => {
    resolve(true);
    handleClose();
  };

  return (
    <ThemeProvider theme={isDarkModeSelected() ? DARK_THEME : LIGHT_THEME}>
      <Dialog
        fullWidth
        maxWidth="xs"
        open={open}
        onClose={handleCancel}
        scroll={'paper'}
      >
        <DialogTitle>Vahvista toiminto</DialogTitle>
        <DialogContent dividers={true}>
          <DialogContentText>
            {text}
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button color='secondary' onClick={handleCancel}>Peruuta</Button>
          <Button variant='contained' color='primary' onClick={handleConfirm}>Vahvista</Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
};

export default Confirm;