import { Box, Button, Paper, Typography, useTheme, Theme } from '@mui/material';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { useAppDispatch, useIsLoggedIn } from '../hooks';
import { setLoginModal } from '../reducers/loginModalReducer';

const Welcome = () => {
  const theme: Theme = useTheme();
  const history = useHistory();
  const dispatch = useAppDispatch();

  const isLoggedIn: boolean = useIsLoggedIn();

  return (
    <Paper sx={{ mt: 2, display: { xs: 'none', sm: 'block' } }}>
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        p: 2
      }}>
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2
        }}>
          <Typography variant='h5' sx={{ fontWeight: 'bold' }}>
            Löydä tai anna lemmikille uusi koti
          </Typography>
          <Typography variant='body2'>
            Lemmikkihaku on uusi palvelu, joka auttaa kodit ja lemmikit löytämään yhteen. Ilmoita ilmaiseksi - helposti ja nopeasti!
          </Typography>
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}>
            <Button onClick={() => history.push('/ilmoita')} variant='contained' color='primary'>
              Ilmoita ilmaiseksi
            </Button>
            {!isLoggedIn && (
              <Button onClick={() => dispatch(setLoginModal({ opened: true, tab: 1 }))} variant='outlined' color='secondary'>
                Rekisteröidy
              </Button>
            )}

          </Box>
        </Box>
        <img
          style={{
            marginLeft: 'auto',
            borderRadius: theme.shape.borderRadius
          }}
          src='/images/dog.webp'
          width='40%'
          height='100%'
        />
      </Box>
    </Paper>
  );
};

export default Welcome;