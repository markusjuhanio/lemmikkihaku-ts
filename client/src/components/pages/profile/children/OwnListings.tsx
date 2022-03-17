import React, { useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import userService from '../../../../services/userService';
import ListingList from '../../../ListingList';
import { OwnListing, OwnUser, PublicListing } from '../../../../types';
import PageSectionHeader from '../../../PageSectionHeader';
import { useAppDispatch, useAppSelector, useLoader } from '../../../../hooks';
import LoadingSpinner from '../../../LoadingSpinner';
import { setOwnListings } from '../../../../reducers/ownListingsReducer';

interface OwnListingsProps {
  user: OwnUser | null
}

const OwnListings = (props: OwnListingsProps) => {
  const { user } = props;
  const ownListings: OwnListing[] = useAppSelector(state => state.ownListings);
  const dispatch = useAppDispatch();
  const mainListings: PublicListing[] = useAppSelector(state => state.listings);
  const loader = useLoader(true);

  useEffect(() => {
    async function get() {
      if (user) {
        const response = await userService.getOwnListings(user.id);
        const listings: OwnListing[] = response.data;
        dispatch(setOwnListings(listings));
        loader.stop();
      }
    }
    void get();
  }, [user, mainListings]);

  const getTitle = (): string => {
    let title = 'Omat ilmoitukset';
    if (ownListings.length > 0) {
      title += ` · ${ownListings.length}`;
    }
    return title;
  };

  return (
    <Box>
      <PageSectionHeader title={getTitle()} />

      {ownListings.length > 0
        ? <ListingList listings={ownListings} />
        : loader.loading
          ? <LoadingSpinner />
          : <Typography sx={{ mt: -2 }} variant='body2'>
            Voit luoda uusia ilmoituksia napauttamalla ylävalikosta Ilmoita.
          </Typography>
      }

    </Box>
  );
};

export default OwnListings;