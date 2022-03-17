import { Close } from '@mui/icons-material';
import { Alert, Box, Button, IconButton, Paper, TextField, Theme, Typography, useTheme } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useAppDispatch, useField, useIsLoggedIn, useLoader } from '../../hooks';
import { showToast } from '../../reducers/toastReducer';
import { logout } from '../../reducers/userReducer';
import passwordRequestService from '../../services/passwordRequestService';
import { Severity, IUseField, PasswordRequest, PasswordRequestStatus } from '../../types';
import { isEmptyString } from '../../utils';

const ChangePassword = () => {
  const isLoggedIn = useIsLoggedIn();
  const dispatch = useAppDispatch();
  const history = useHistory();

  const { guid } = useParams<{ guid: string }>();

  const [passwordRequest, setPasswordRequest] = useState<PasswordRequest | null>();
  const newPassword: IUseField = useField('password');
  const [error, setError] = useState<string>('');
  const theme: Theme = useTheme();
  const loader = useLoader();

  useEffect(() => {
    async function get(guid: string) {
      try {
        const response = await passwordRequestService.getPasswordRequest(guid);
        const request: PasswordRequest = response.data;

        if (request) {
          const status: PasswordRequestStatus = request.status;

          switch (status) {
          case PasswordRequestStatus.DONE:
            navigateToHome();
            break;
          case PasswordRequestStatus.CHANGE_PASSWORD:
            setPasswordRequest(request);
          }
        }
      } catch (error) {
        navigateToHome();
      }
    }

    if (isLoggedIn) {
      dispatch(logout());
    } else {
      if (guid) {
        void get(guid);
      } else {
        navigateToHome();
      }
    }

  }, [window.location.href, isLoggedIn]);


  const navigateToHome = (): void => {
    history.push('/');
  };

  const handleChangePassword = async (): Promise<void> => {
    try {
      loader.start();
      await passwordRequestService.setPassword(guid, newPassword.value);
      dispatch(showToast({
        open: true,
        severity: Severity.Success,
        message: 'Salasanasi on nyt vaihdettu.',
        timeout: 10
      }));
      loader.stop();
      navigateToHome();
    } catch (error) {
      loader.stop();
      dispatch(showToast({
        open: true,
        severity: Severity.Error,
        message: 'Salasanan vaihtaminen epäonnistui.',
        timeout: 5,
      }));
    }
  };

  return (
    passwordRequest
      ? <Paper sx={{ p: 2 }}>
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2
        }}>
          <Typography variant='h6'>
            Aseta uusi salasana käyttäjälle <b style={{ color: theme.palette.primary.main }}>{passwordRequest.user.nickname}</b>.
          </Typography>

          <TextField
            label='Uusi salasana'
            type={newPassword.type}
            value={newPassword.value}
            inputProps={{
              maxLength: 100
            }}
            helperText='Valitse vähintään 8 merkkiä pitkä salasana.'
            onChange={newPassword.onChange}
          />

          {!isEmptyString(error) && (
            <Box sx={{ pb: 1 }}>
              <Alert action={<IconButton size='small' onClick={() => setError('')}><Close /></IconButton>} severity='error'>
                <Typography variant='body2'>
                  {error}
                </Typography>
              </Alert>
            </Box>
          )}

          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: 2
          }}>


            <Button color='secondary' onClick={navigateToHome}>
              Peruuta
            </Button>
            <Button disabled={loader.loading || isEmptyString(newPassword.value) || newPassword.value.length < 8} variant='contained' onClick={handleChangePassword}>
              Lähetä
            </Button>
          </Box>

        </Box>
      </Paper>
      : null
  );
};

export default ChangePassword;