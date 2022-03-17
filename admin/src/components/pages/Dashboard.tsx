import React from 'react';
import { Box, Grid } from '@mui/material';
import PageSectionHeader from '../PageSectionHeader';
import { useAppSelector, useDocumentTitle } from '../../hooks';
import { AdminViewListing, AdminViewUser } from '../../types';
import LineChart from '../charts/LineChart';

const title = 'Ohjauspaneeli';

const Dashboard = () => {
  const listings: AdminViewListing[] = useAppSelector(state => state.listings);
  const users: AdminViewUser[] = useAppSelector(state => state.users);

  useDocumentTitle(title);

  return (
    <Box>
      <PageSectionHeader title={title} />
      <Grid container spacing={3}>
        <Grid item lg={6} md={6} sm={6} xs={12}>
          <LineChart
            data={users}
            title='Käyttäjät'
            borderColor='rgb(255, 99, 132)'
            backgroundColor='rgba(255, 99, 132, 0.5)'
          />
        </Grid>
        <Grid item lg={6} md={6} sm={6} xs={12}>
          <LineChart
            data={listings.filter(listing => listing.deleted === 0 && listing.activated === 1)}
            title='Ilmoitukset'
            borderColor='rgb(53, 162, 235)'
            backgroundColor='rgba(53, 162, 235, 0.5)'
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;