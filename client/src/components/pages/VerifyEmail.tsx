import { Close } from '@mui/icons-material';
import { Alert, Box, Button, IconButton, Paper, TextField, Theme, Typography, useTheme } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useAppDispatch, useField, useIsLoggedIn, useLoader } from '../../hooks';
import { setLoginModal } from '../../reducers/loginModalReducer';
import { showToast } from '../../reducers/toastReducer';
import { logout } from '../../reducers/userReducer';
import emailVerifyRequestService from '../../services/emailVerifyRequestService';
import userService from '../../services/userService';
import { EmailVerifyRequest, Severity, EmailVerifyRequestStatus, IUseField, AuthorizedUser, LoginData } from '../../types';
import { isEmptyString } from '../../utils';

interface ParamsProps {
  guid: string
}

const VerifyEmail = () => {
  const isLoggedIn = useIsLoggedIn();
  const dispatch = useAppDispatch();
  const history = useHistory();

  const [emailVerifyRequest, setEmailVerifyRequest] = useState<EmailVerifyRequest | null>();
  const password: IUseField = useField('password');
  const [error, setError] = useState<string>('');
  const loader = useLoader();

  const theme: Theme = useTheme();

  const { guid } = useParams<ParamsProps>();

  useEffect(() => {
    async function get(guid: string) {
      try {
        const response = await emailVerifyRequestService.getEmailVerifyRequest(guid);
        const emailVerifyRequest: EmailVerifyRequest = response.data;

        if (emailVerifyRequest) {
          const status: EmailVerifyRequestStatus = emailVerifyRequest.status;

          switch (status) {
          case EmailVerifyRequestStatus.DONE:
            navigateToHome();
            break;
          case EmailVerifyRequestStatus.ACTIVATE_USER:
            await handleActivateUser();
            break;
          case EmailVerifyRequestStatus.CHANGE_EMAIL:
            setEmailVerifyRequest(emailVerifyRequest);
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

  const handleActivateUser = async (): Promise<void> => {
    try {
      loader.start();
      await emailVerifyRequestService.activateUser(guid);
      navigateToHome();
      dispatch(showToast({
        open: true,
        severity: Severity.Success,
        message: 'Sähköpostiosoitteesi on vahvistettu ja voit nyt kirjautua sisään.',
        timeout: 15
      }));
      loader.stop();
      dispatch(setLoginModal({ opened: true, tab: 0 }));
    } catch (error) {
      navigateToHome();
    }
  };

  const handleChangeEmail = async (): Promise<void> => {

    //Check login first

    let user: AuthorizedUser | null = null;

    if (emailVerifyRequest) {
      try {
        loader.start();
        const loginData: LoginData = { nickname: emailVerifyRequest.user.nickname, password: password.value };
        const response = await userService.login(loginData);
        user = response.data;
      } catch (error) {
        setError('Virheellinen salasana.');
        password.clear();
        loader.stop();
        return;
      }
    }

    if (user) {
      try {
        await emailVerifyRequestService.verifyNewEmail(guid);
        navigateToHome();
        dispatch(showToast({
          open: true,
          severity: Severity.Success,
          message: 'Sähköpostiosoitteesi on nyt vaihdettu.',
          timeout: 10
        }));
        loader.stop();
      } catch (error) {
        loader.stop();
        dispatch(showToast({
          open: true,
          severity: Severity.Error,
          message: 'Sähköpostiosoitteen vaihtaminen epäonnistui.',
          timeout: 5
        }));
      }
    }
  };

  return (
    emailVerifyRequest
      ? <Paper sx={{ p: 2 }}>
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2
        }}>
          <Typography variant='h6'>
            Syötä käyttäjän <b style={{ color: theme.palette.primary.main }}>{emailVerifyRequest.user.nickname}</b> salasana asettaaksesi uuden sähköpostiosoitteen.
          </Typography>
          <Typography variant='body2'>
            Uusi sähköpostiosoite: <b>{emailVerifyRequest.email}</b>
          </Typography>

          <TextField
            label='Salasana'
            type={password.type}
            value={password.value}
            inputProps={{
              maxLength: 100
            }}
            onChange={password.onChange}
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
            <Button disabled={loader.loading || isEmptyString(password.value) || password.value.length < 8} variant='contained' onClick={handleChangeEmail}>
              Lähetä
            </Button>
          </Box>

        </Box>
      </Paper>
      : <Typography>Ladataan...</Typography>
  );
};

export default VerifyEmail;