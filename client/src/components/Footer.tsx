import React from 'react';
import { Paper, Typography, Box, Link, Grid, Container } from '@mui/material';
import { useHistory } from 'react-router-dom';
import { useAppSelector } from '../hooks';
import { APP_WIDTH } from '../constants';

const Footer = () => {
  const selectedConversation = useAppSelector(state => state.selectedConversation);
  const history = useHistory();
  
  return (
    <Container sx={{ maxWidth: APP_WIDTH, pb: 2, display: selectedConversation ? 'none' : 'block', mt: 'auto' }} maxWidth={false}>
      <Paper sx={{ p: 2 }}>
        <Grid justifyContent='center' alignItems='center' container spacing={1}>
          <Grid item>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Link onClick={(event) => {
                event.preventDefault();
                history.push('/tietoa');
              }} color='textSecondary' sx={{ textDecoration: 'none' }} href='/tietoa'>
                <Typography variant='body2'>
                  Tietoa palvelusta
                </Typography>
              </Link>
            </Box>
          </Grid>
          <Grid item>
            ·
          </Grid>
          <Grid item>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Link color='textSecondary' sx={{ textDecoration: 'none' }} href='mailto:info@lemmikkihaku.fi'>
                <Typography variant='body2'>
                  info@lemmikkihaku.fi
                </Typography>
              </Link>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default Footer;