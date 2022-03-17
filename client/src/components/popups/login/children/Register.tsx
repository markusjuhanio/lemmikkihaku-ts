import React, { useState } from 'react';
import { Button, Grid, TextField, Alert, IconButton, Typography, Switch, Link, Box, Divider } from '@mui/material';
import UserIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import CloseIcon from '@mui/icons-material/Close';
import { AxiosErrorMessage, IUseField, LoginModalStage, OwnUser, RegisterData } from '../../../../types';
import { useField, useLoader } from '../../../../hooks';
import { isEmptyString, isValidNickname, isEmail, isValidPassword } from '../../../../utils';
import userService from '../../../../services/userService';
import { AxiosError } from 'axios';

const RegisterStage = () => {
  const nickname: IUseField = useField('username');
  const email: IUseField = useField('email');
  const password: IUseField = useField('password');

  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<boolean>(false);
  const loader = useLoader();
  const [tosChecked, setTosChecked] = useState<boolean>(false);

  const handleRegister = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    if (canRegister()) {
      try {
        loader.start();
        const registerData: RegisterData = { nickname: nickname.value, email: email.value, password: password.value };
        const response = await userService.register(registerData);
        const user: OwnUser = response.data;
        if (user) {
          setSuccess(true);
        }
      } catch (error) {
        let message = 'Tapahtui virhe. Yritä myöhemmin uudelleen.';
        const err = error as AxiosError;
        if (err.response?.status) {
          if (err.response?.status && err.response?.data) {
            const errorMessage = err.response.data as AxiosErrorMessage;
            const errorCode: number = err.response.status;

            if (errorCode && errorMessage) {
              if (errorCode === 409) {
                const msg: string = errorMessage.error;
                switch (msg) {
                case 'nickname':
                  message = 'Valitsemasi nimimerkki on jo käytössä.';
                  break;
                case 'email':
                  message = 'Valitsemasi sähköpostiosoite on jo käytössä.';
                  break;
                }
              }
            }
          }
        }
        loader.stop();
        setError(message);
      }
    }
  };

  const handleNicknameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (isValidNickname(event.target.value)) {
      nickname.onChange(event);
    }
  };

  const canRegister = (): boolean => {
    if (!isEmptyString(nickname.value) && !isEmptyString(email.value) && !isEmptyString(password.value)) {
      if (isValidNickname(nickname.value) && isEmail(email.value) && isValidPassword(password.value)) {
        if (tosChecked) {
          return true;
        }
      }
    }
    return false;
  };

  return (
    success
      ? <Alert severity='success'>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Typography variant='subtitle2'>
            Vahvista vielä sähköpostiosoitteesi
          </Typography>
          <Typography variant='body2'>
            Aloittaaksesi palvelun käytön, aktivoi käyttäjätunnuksesi seuraamalla sähköpostiisi tulleita ohjeita.
          </Typography>
          <Typography variant='body2'>
            Jos et saanut sähköpostia, tarkistathan myös roskapostikansion.
          </Typography>
        </Box>
      </Alert>
      : <form onSubmit={handleRegister}>
        <Grid container spacing={2}>
          <Grid item lg={12} md={12} sm={12} xs={12}>
            <TextField
              type={nickname.type}
              value={nickname.value}
              onChange={handleNicknameChange}
              autoComplete={nickname.type}
              variant='outlined'
              fullWidth
              helperText='Nimimerkin pituus 4-15 merkkiä.'
              label='Nimimerkki'
              inputProps={{
                maxLength: 15
              }}
              InputProps={{
                startAdornment:
                  <UserIcon sx={{ mr: 1 }} />
              }}
            />
          </Grid >
          <Grid item lg={12} md={12} sm={12} xs={12}>
            <TextField
              error={email.value.length > 0 && !email.value.includes('@')}
              type={email.type}
              value={email.value}
              onChange={email.onChange}
              autoComplete={password.type}
              variant='outlined'
              fullWidth
              label='Sähköpostiosoite'
              inputProps={{
                maxLength: 100
              }}
              InputProps={{
                startAdornment:
                  <LockIcon sx={{ mr: 1 }} />
              }}
            />
          </Grid>
          <Grid item lg={12} md={12} sm={12} xs={12}>
            <TextField
              error={password.value.length > 0 && password.value.length < 8}
              type={password.type}
              value={password.value}
              onChange={password.onChange}
              autoComplete={password.type}
              variant='outlined'
              fullWidth
              label='Salasana'
              helperText='Vähintään 8 merkkiä pitkä salasana.'
              inputProps={{
                maxLength: 100
              }}
              InputProps={{
                startAdornment: <LockIcon sx={{ mr: 1 }} />
              }}
            />
          </Grid>

          <Grid sx={{ mt: 1 }} item lg={12} md={12} sm={12} xs={12}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography sx={{ flex: 1 }} variant='body2'>
                Olen lukenut ja hyväksyn <Link color='secondary' href='/kayttoehdot' target='_blank'>käyttöehdot</Link> sekä <Link color='secondary' href='/rekisteriseloste' target='_blank'>rekisteriselosteen.</Link>
              </Typography>
              <Switch sx={{ ml: 1 }} checked={tosChecked} onChange={(event, checked) => setTosChecked(checked)} />
            </Box>
          </Grid>

          {
            !isEmptyString(error) && (
              <Grid item lg={12} md={12} sm={12} xs={12}>
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
            )
          }

          <Grid sx={{ mt: 1 }} item lg={12} md={12} sm={12} xs={12}>
            <Divider sx={{ mb: 3 }} />
            <Button
              type='submit'
              disabled={!canRegister() || loader.loading}
              sx={{ height: 60 }}
              size='large'
              variant='contained'
              fullWidth
            >
              {LoginModalStage.Register}
            </Button>
          </Grid>
        </Grid >
      </form >
  );
};

export default RegisterStage;