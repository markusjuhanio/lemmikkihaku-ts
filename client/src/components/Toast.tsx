import React from 'react';
import { Snackbar, Alert, Button, Paper } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../hooks';
import { showToast } from '../reducers/toastReducer';

const Toast = () => {
  const toast = useAppSelector(state => state.toast);
  const dispatch = useAppDispatch();

  const handleClose = (): void => {
    dispatch(showToast({ ...toast, open: false }));
  };

  const handleAction = () => {
    if (toast.action) {
      toast.action();
    }
    handleClose();
  };

  return (
    <Snackbar
      sx={{ maxWidth: 665 }}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      open={toast.open}
      autoHideDuration={toast.timeout * 1000}
      onClose={handleClose}
    >
      <Paper>
        <Alert
          onClose={handleClose}
          severity={toast.severity}
          sx={{ width: '100%' }}
          action={
            <Button
              size='small'
              color='secondary'
              onClick={toast.action ? handleAction : handleClose}
            >
              {toast.actionName ? toast.actionName : 'Sulje'}
            </Button>
          }
        >
          {toast.message}
        </Alert>
      </Paper>
    </Snackbar>
  );
};

export default Toast;
