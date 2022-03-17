import React from 'react';
import { Dialog, IconButton, Box } from '@mui/material';
import Listing from '../Listing';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { setListingToPreview } from '../../reducers/selectedListingReducer';
import { Close } from '@mui/icons-material';

const ListingView = () => {
  const listing = useAppSelector(state => state.listingToPreview);
  const dispatch = useAppDispatch();

  const handleClose = () => {
    dispatch(setListingToPreview(null));
  };

  return (
    <Dialog onClose={handleClose} open={Boolean(listing)}>
      {listing && (
        <>
          <Box>
            <IconButton onClick={handleClose} sx={{ float: 'right' }}>
              <Close />
            </IconButton>
          </Box>
          <Listing listing={listing} />
        </>
      )}
    </Dialog>
  );
};

export default ListingView;