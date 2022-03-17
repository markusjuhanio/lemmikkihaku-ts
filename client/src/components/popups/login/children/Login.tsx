import React, { useState } from 'react';
import { Button, Grid, TextField, Alert, IconButton, Typography } from '@mui/material';
import UserIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import CloseIcon from '@mui/icons-material/Close';
import { AuthorizedUser, IUseField, LoginData, LoginModalStage } from '../../../../types';
import { useField } from '../../../../hooks';
import { isEmptyString, isValidPassword } from '../../../../utils';
import userService from '../../../../services/userService';
import { login } from '../../../../reducers/userReducer';
import { useDispatch } from 'react-redux';
import { AxiosError } from 'axios';

interface LoginProps {
  handleClose: () => void;
}

const LoginStage = (props: LoginProps) => {
  const { handleClose } = props;
  const nickname: IUseField = useField('username');
  const password: IUseField = useField('password');
  const [error, setError] = useState<string>('');
  const dispatch = useDispatch();

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    if (!isEmptyString(nickname.value) && !isEmptyString(password.value)) {
      try {
        const loginData: LoginData = { nickname: nickname.value, password: password.value };
        const response = await userService.login(loginData);
        const user: AuthorizedUser = response.data;
        if (user && user.user) {
          dispatch(login(user));
          handleClose();
        }
      } catch (error) {
        let message = 'Tapahtui virhe. Yritä myöhemmin uudelleen.';
        const err = error as AxiosError;
        if (err.response?.status) {
          const status: number = err.response.status;
          switch (status) {
          case 403:
            message = 'Virheellinen käyttäjätunnus tai salasana.';
            break;
          case 409:
            message = 'Käyttäjätunnuksesi ei ole käytössä.';
            break;
          }
        }
        setError(message);
      }
    }
  };

  const canLogin = (): boolean => {
    if (!isEmptyString(nickname.value) && !isEmptyString(password.value)) {
      if (isValidPassword(password.value)) {
        return true;
      }
    }
    return false;
  };

  return (
    <form onSubmit={handleLogin}>
      <Grid container spacing={2}>
        <Grid item lg={12} md={12} sm={12} xs={12}>
          <TextField
            type={nickname.type}
            value={nickname.value}
            onChange={nickname.onChange}
            autoComplete={nickname.type}
            variant='outlined'
            fullWidth
            label='Nimimerkki tai sähköpostiosoite'
            InputProps={{
              startAdornment:
                <UserIcon sx={{ mr: 1 }} />
            }}
          />
        </Grid>
        <Grid item lg={12} md={12} sm={12} xs={12}>
          <TextField
            type={password.type}
            value={password.value}
            onChange={password.onChange}
            autoComplete={password.type}
            variant='outlined'
            fullWidth
            label='Salasana'
            InputProps={{
              startAdornment:
                <LockIcon sx={{ mr: 1 }} />
            }}
          />
        </Grid>
        {!isEmptyString(error) && (
          <Grid sx={{ mb: -1 }} item lg={12} md={12} sm={12} xs={12}>
            <Alert action={
              <IconButton size='small' onClick={() => setError('')}>
                <CloseIcon />
              </IconButton>
            } severity='error'>
              <Typography variant='body2'>
                {error}
              </Typography>
            </Alert>
          </Grid>
        )}
        <Grid sx={{ mt: 1 }} item lg={12} md={12} sm={12} xs={12}>
          <Button
            type='submit'
            disabled={!canLogin()}
            sx={{ height: 60 }}
            size='large'
            variant='contained'
            fullWidth
          >
            {LoginModalStage.Login}
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default LoginStage;