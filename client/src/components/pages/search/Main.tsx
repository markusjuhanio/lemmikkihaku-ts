import React, { useEffect, useState } from 'react';
import { Box, Button, IconButton, Pagination, PaginationItem } from '@mui/material';
import PageSectionHeader from '../../PageSectionHeader';
import { useAppDispatch, useAppSelector, useDocumentTitle, useLoader } from '../../../hooks';
import { FilterType, PaginatedPublicListings, SearchProps, Severity, UserSearch } from '../../../types';
import ListingList from '../../ListingList';
import SortSelector from './children/SortSelector';
import CategoryTabs from './children/CategoryTabs';
import Filters from './children/Filters';
import listingService from '../../../services/listingService';
import { initialState, setSearchProps } from '../../../reducers/searchPropsReducer';
import { MAX_LISTINGS_PER_PAGE } from '../../../constants';
import { setListings } from '../../../reducers/listingsReducer';
import { ArrowBack, ArrowForward, KeyboardArrowUp } from '@mui/icons-material';
import Welcome from '../../Welcome';
import { showToast } from '../../../reducers/toastReducer';
import { setLastSavedSearch } from '../../../reducers/lastSavedSearch';
import { setLoginModal } from '../../../reducers/loginModalReducer';
import savedSearchService from '../../../services/savedSearchService';

const title = 'Hae ilmoituksia';

const Main = () => {
  const dispatch = useAppDispatch();

  const searchProps: SearchProps = useAppSelector(state => state.searchProps);
  const listings = useAppSelector(state => state.listings);
  const user = useAppSelector(state => state.user.user);
  const lastSavedSearch = useAppSelector(state => state.lastSavedSearch);
  const [total, setTotal] = useState<number | null>(null);
  const loader = useLoader();

  useDocumentTitle('Löydä tai anna lemmikille uusi koti');

  useEffect(() => {
    void handleSearch();
  }, [searchProps]);

  const handleSearch = async (): Promise<void> => {
    loader.start();
    const response = await listingService.searchListings(searchProps);
    const paginatedData: PaginatedPublicListings = response.data;

    const t: number = paginatedData.total;
    setTotal(t);

    dispatch(setListings(paginatedData.data));
    loader.stop();
  };

  const getTitle = (): string => {
    const category = searchProps.filters.find(c => c.filterType === FilterType.Category);
    if (total === null || !category) {
      return 'Ladataan...';
    } else if (total === 0) {
      if (loader.loading) {
        return 'Ladataan...';
      }
      return 'Ei ilmoituksia.';
    } else {
      return `${category.filterValue} · ${total}`;
    }
  };

  const handlePageChange = (value: number): void => {
    const offset = Math.round((value * MAX_LISTINGS_PER_PAGE) - MAX_LISTINGS_PER_PAGE);

    //console.log(`Page is ${value}. Offset: ${fixedOffset}. Limit: ${searchProps.limit}`);

    dispatch(setSearchProps({
      ...searchProps,
      offset: offset,
      limit: searchProps.limit,
      page: value
    }));

    if (!loader.loading) {
      setTimeout(() => {
        scrollToTop();
      }, 250);
    }
  };

  const scrollToTop = () => {
    const element: HTMLElement | null = document.getElementById('page-change-scroll-anchor');
    if (element && document) {
      const offset = 15;
      const bodyRect: number = document.body.getBoundingClientRect().top;
      const elementRect: number = element.getBoundingClientRect().top;
      const elementPosition: number = elementRect - bodyRect;
      const offsetPosition: number = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition
      });
    }
  };

  const isSaveable = (): boolean => {
    return searchProps.filters.length > initialState.filters.length;
  };

  const handleSaveSearch = async (): Promise<void> => {
    if (user) {
      try {
        const response = await savedSearchService.createSearch(searchProps);
        const savedSearch: UserSearch = response.data;
        dispatch(setLastSavedSearch(savedSearch));
        dispatch(showToast({
          open: true,
          message: 'Haku tallennettiin.',
          severity: Severity.Success,
          timeout: 3,
        }));
      } catch (error) {
        dispatch(showToast({
          open: true,
          message: 'Haun tallentaminen epäonnistui.',
          severity: Severity.Error,
          timeout: 3,
        }));
      }
    } else {
      dispatch(setLoginModal({
        opened: true,
        tab: 0
      }));
    }
  };

  const isSavedSearchSameThanCurrentSearch = (): boolean => {
    const searchPropsFilters = searchProps.filters;
    const savedSearchFilters = lastSavedSearch.filters;

    if (savedSearchFilters === null || searchPropsFilters === null) {
      return false;
    }

    for (let i = 0; i <= searchPropsFilters.length - 1; i++) {

      if (!searchPropsFilters[i] || !savedSearchFilters[i]) {
        return false;
      }

      if (searchPropsFilters[i].filterValue !== savedSearchFilters[i].filterValue) {
        return false;
      }
    }

    return true;
  };

  return (
    <Box>
      <CategoryTabs searchProps={searchProps} dispatch={dispatch} />
      <Welcome />
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <PageSectionHeader title={title} />
        <Box sx={{ ml: 'auto' }}>
          <SortSelector searchProps={searchProps} dispatch={dispatch} />
        </Box>
      </Box>
      <Filters />
      <Box sx={{
        display: 'flex',
        alignItems: 'center'
      }}>
        <PageSectionHeader title={getTitle()} />
        {isSaveable() && (
          <Button disabled={isSavedSearchSameThanCurrentSearch()} onClick={handleSaveSearch} sx={{ ml: 'auto' }} size='small' variant='outlined'>Tallenna haku</Button>
        )}
      </Box>
      <div id={'page-change-scroll-anchor'} />
      <ListingList listings={listings} />

      {listings.length > 0 && (
        <Box sx={{
          pt: 3,
          pb: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative'
        }}>
          <Pagination
            color='primary'
            size='large'
            count={total ? Math.ceil(total / MAX_LISTINGS_PER_PAGE) : 1}
            page={searchProps.page}
            onChange={(event, value) => handlePageChange(value)}
            renderItem={(item) => (
              <PaginationItem
                components={{ previous: ArrowBack, next: ArrowForward }}
                {...item}
              />
            )}
          />
          <IconButton onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} sx={{ position: 'absolute', right: 0, bottom: 7 }}>
            <KeyboardArrowUp />
          </IconButton>
        </Box>
      )}
    </Box >
  );
};

export default Main;