import React, { useEffect } from 'react';
import { Box, Typography, List, Paper, Divider } from '@mui/material';
import { UserSearch } from '../../../../../types';
import PageSectionHeader from '../../../../PageSectionHeader';
import { useAppDispatch, useAppSelector, useLoader } from '../../../../../hooks';
import savedSearchService from '../../../../../services/savedSearchService';
import { setSavedSearches } from '../../../../../reducers/savedSearchesReducer';
import LoadingSpinner from '../../../../LoadingSpinner';
import SearchItem from './SearchItem';

const Searches = () => {
  const searchProps = useAppSelector(state => state.searchProps);
  const dispatch = useAppDispatch();
  const searches: UserSearch[] = useAppSelector(state => state.savedSearches);
  const loader = useLoader(true);

  useEffect(() => {
    async function get() {
      const response = await savedSearchService.getOwnSearches();
      const userSearches: UserSearch[] = response.data;
      dispatch(setSavedSearches(userSearches));
      setTimeout(() => {
        loader.stop();
      }, 50);
    }
    void get();
  }, []);

  const getTitle = (): string => {
    let title = 'Omat haut';
    if (searches.length > 0) {
      title += ` · ${searches.length}`;
    }
    return title;
  };

  return (
    <Box>
      <PageSectionHeader title={getTitle()} />
      {searches.length > 0
        ? <Paper sx={{ pt: 1, pb: 1 }}>
          <List sx={{ width: '100%' }} >
            {searches.map((search, i) => (
              <Box key={i}>
                <SearchItem search={search} searchProps={searchProps} />
                {i < searches.length - 1 && (<Divider />)}
              </Box>
            ))}
          </List>
        </Paper>
        : loader.loading
          ? <LoadingSpinner />
          : <Typography sx={{ mt: -2 }} variant='body2'>
            Voit tallentaa uusia hakuja etusivulla valittuasi ensin hakuehtoja.
          </Typography>
      }
    </Box>
  );
};

export default Searches;