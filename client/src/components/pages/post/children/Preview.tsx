import React, { useEffect } from 'react';
import { useAppDispatch } from '../../../../hooks';
import { setNewListing } from '../../../../reducers/newListingReducer';
import { ListingEntry } from '../../../../types';
import Listing from '../../../Listing';

interface PreviewProps {
  listing: ListingEntry
}

const Preview = (props: PreviewProps) => {
  const { listing } = props;
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setNewListing(listing));
  }, []);

  return (
    <Listing listing={listing} />
  );
};

export default Preview;