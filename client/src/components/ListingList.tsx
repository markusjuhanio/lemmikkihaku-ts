import React from 'react';
import { Box } from '@mui/material';
import { PublicListing, OwnListing } from '../types';
import ListingCard from './ListingCard';
import { Link, useLocation } from 'react-router-dom';
import { useDetectAdblock } from '../hooks';
import InArticleAd from './ads/InArticleAd';

interface ListingListProps {
  listings: PublicListing[] | OwnListing[],
}

const ListingList = (props: ListingListProps) => {
  const { listings } = props;
  const adblock = useDetectAdblock();
  const location = useLocation();

  const showAd = (i: number): boolean => {
    return i % 3 === 0 && !adblock.detected && location.pathname === '/';
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, transform: 'translate3d(0, 0, 0)' }}>

      {listings.map((listing: OwnListing | PublicListing, i) => {
        i++;
        return <Box key={i}>
          <Box sx={{ pb: showAd(i) ? 2 : 0 }}>
            <Link
              onClick={(event) => event.preventDefault()}
              style={{ textDecoration: 'none' }}
              to={`/ilmoitus/${listing.id}`}
            >
              <ListingCard listing={listing} />
            </Link>
          </Box>
          {showAd(i) && (
            <InArticleAd />
          )}
        </Box>;
      })}

    </Box>
  );
};

export default ListingList;