import React from 'react';
import { Box, Paper } from '@mui/material';
import PageSectionHeader from '../PageSectionHeader';
import { useAppSelector, useDocumentTitle } from '../../hooks';
import { AdminViewListing } from '../../types';
import Table from '../tables/listing/ListingTable';
import ListingView from '../popups/ListingView';

const title = 'Ilmoitukset';

const Listings = () => {
  const listings: AdminViewListing[] = useAppSelector(state => state.listings);

  useDocumentTitle(title);

  return (
    <Box>
      <PageSectionHeader title={`${title} · ${listings.length}`} />
      <Paper>
        <Table listings={listings} searchPlaceholderText='Hae ilmoituksia' />
      </Paper>

      <ListingView />
    </Box>
  );
};

export default Listings;