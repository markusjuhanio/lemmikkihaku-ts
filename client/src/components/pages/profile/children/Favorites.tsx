import React, { useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import userService from '../../../../services/userService';
import ListingList from '../../../ListingList';
import { PublicListing, OwnUser } from '../../../../types';
import PageSectionHeader from '../../../PageSectionHeader';
import LoadingSpinner from '../../../LoadingSpinner';
import { useAppDispatch, useAppSelector, useLoader } from '../../../../hooks';
import { setFavoriteListings } from '../../../../reducers/favoriteListingsReducer';

interface FavoritesProps {
  user: OwnUser | null
}

const Favorites = (props: FavoritesProps) => {
  const { user } = props;
  const favoriteListings: PublicListing[] = useAppSelector(state => state.favoriteListings);
  const dispatch = useAppDispatch();
  const loader = useLoader(true);
  const listings = useAppSelector(state => state.listings);

  useEffect(() => {
    async function get() {
      if (user) {
        const response = await userService.getFavoriteListings(user.id);
        const listings: PublicListing[] = response.data;
        dispatch(setFavoriteListings(listings));
        loader.stop();
      }
    }
    void get();
  }, [user, listings]);

  const getTitle = (): string => {
    let title = 'Omat suosikit';
    if (favoriteListings.length > 0) {
      title += ` · ${favoriteListings.length}`;
    }
    return title;
  };

  return (
    <Box>
      <PageSectionHeader title={getTitle()} />

      {favoriteListings.length > 0
        ? <ListingList listings={favoriteListings} />
        : loader.loading
          ? <LoadingSpinner />
          : <Typography sx={{ mt: -2 }} variant='body2'>
            Voit lisätä suosikki-ilmoituksia napauttamalla ilmoituskortin kolmea palloa.
          </Typography>
      }

    </Box>
  );
};

export default Favorites;