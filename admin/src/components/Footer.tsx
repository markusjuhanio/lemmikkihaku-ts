import React from 'react';
import { Paper, Typography, Box, Grid, Container } from '@mui/material';
import { APP_WIDTH } from '../constants';
import { useUsersOnlineCount } from '../hooks';
import { Face } from '@mui/icons-material';

const Footer = () => {
  const onlineUsers = useUsersOnlineCount();
  return (
    <Container sx={{ maxWidth: APP_WIDTH, pb: 2 }} maxWidth={false}>
      <Paper sx={{ p: 2 }}>
        <Grid justifyContent='center' alignItems='center' container spacing={1}>
          <Grid item>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Face color='secondary' sx={{ mr: '5px' }} />
              <Typography variant='body2'>
                Käyttäjiä paikalla: <b>{onlineUsers}</b>
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default Footer;