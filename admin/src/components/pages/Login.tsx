import React, { useState } from 'react';
import { Container, Grid, Paper, TextField, Typography, Box, Button, Alert, IconButton } from '@mui/material';
import { useDarkModeHandler, useDocumentTitle, useField } from '../../hooks';
import UserIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import { isEmptyString } from '../../utils';
import userService from '../services/userService';
import { AxiosError } from 'axios';
import { login } from '../../reducers/authReducer';
import { useDispatch } from 'react-redux';
import { Brightness4 } from '@mui/icons-material';
import { Role } from '../../types';

const title = 'Kirjaudu sisään';

const Login = () => {
  const dispatch = useDispatch();
  const nickname = useField('username');
  const password = useField('password');
  const [error, setError] = useState<string>('');
  const darkMode = useDarkModeHandler();

  useDocumentTitle(title);

  const canSubmit = (): boolean => {
    if (!isEmptyString(nickname.value) && !isEmptyString(password.value)) {
      return true;
    }
    return false;
  };

  const handleLoginClick = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    if (!canSubmit()) {
      return;
    }

    try {
      const user = await userService.login(nickname.value, password.value);
      if (user?.data?.user?.role !== Role.Admin) {
        setError('Pääsy evätty.');
        return;
      }
      dispatch(login(user.data));
    } catch (error) {
      const err = error as AxiosError;
      if (err.response?.status) {
        const status: number = err.response.status;
        switch (status) {
        case 403:
          setError('Virheellinen käyttäjätunnus tai salasana.');
          break;
        case 409:
          setError('Käyttäjätunnuksesi ei ole käytössä.');
          break;
        }
      } else {
        setError('Tapahtui virhe. Yritä myöhemmin uudelleen.');
      }
    }
  };

  return (
    <Container sx={{ marginTop: '28vh' }} maxWidth='xs'>
      <Paper sx={{ p: '10px 20px 20px 20px' }}>
        <Box sx={{ display: 'flex', gap: 3, flexDirection: 'column' }}>

          <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            <Typography variant='h5' sx={{ fontWeight: 'bold', flex: 1, textAlign: 'center' }}>Kirjaudu sisään</Typography>
            <IconButton color='secondary' onClick={darkMode.handleChange}>
              <Brightness4 />
            </IconButton>
          </Box>

          <form onSubmit={(event: React.FormEvent<HTMLFormElement>) => handleLoginClick(event)}>
            <Grid container spacing={2}>
              <Grid item lg={12} md={12} sm={12} xs={12}>
                <TextField InputProps={{
                  startAdornment:
                                        <UserIcon sx={{ mr: 1 }} />,
                }} type={nickname.type} value={nickname.value} onChange={nickname.onChange} autoComplete={nickname.type} variant='outlined' fullWidth label='Nimimerkki tai sähköpostiosoite' />
              </Grid>
              <Grid item lg={12} md={12} sm={12} xs={12}>
                <TextField InputProps={{
                  startAdornment:
                                        <LockIcon sx={{ mr: 1 }} />,
                }} type={password.type} value={password.value} onChange={password.onChange} autoComplete={password.type} variant='outlined' fullWidth label='Salasana' />
              </Grid>

              {!isEmptyString(error) && (
                <Grid item lg={12} md={12} sm={12} xs={12}>
                  <Alert severity='error'>
                    <Typography variant='body2'>
                      {error}
                    </Typography>
                  </Alert>
                </Grid>
              )}

              <Grid item lg={12} md={12} sm={12} xs={12}>
                <Button sx={{ minHeight: 60 }} type='submit' variant='contained' size='large' fullWidth color='primary'>
                                    Kirjaudu sisään
                </Button>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;