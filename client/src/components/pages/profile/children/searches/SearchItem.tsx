import React from 'react';
import { Typography, ListItem, ListItemAvatar, ListItemText, Avatar, CardActionArea, IconButton } from '@mui/material';
import { UserSearch, FilterOption, Severity, FilterType, Age, Gender, SearchProps } from '../../../../../types';
import { Delete, FindInPage } from '@mui/icons-material';
import moment from 'moment';
import 'moment/locale/fi';
import { showToast } from '../../../../../reducers/toastReducer';
import { setSearchProps } from '../../../../../reducers/searchPropsReducer';
import { setMoreFilters } from '../../../../../reducers/moreFiltersReducer';
import { setLastSavedSearch } from '../../../../../reducers/lastSavedSearch';
import savedSearchService from '../../../../../services/savedSearchService';
import { deleteSavedSearch } from '../../../../../reducers/savedSearchesReducer';
import { useHistory } from 'react-router-dom';
import { useAppDispatch } from '../../../../../hooks';

interface SearchItemProps {
  search: UserSearch,
  searchProps: SearchProps
}

const SearchItem = (props: SearchItemProps) => {
  const { search, searchProps } = props;
  const dispatch = useAppDispatch();
  const history = useHistory();

  const getFiltersAsText = (filters: FilterOption[] | null): string => {
    const keys: string[] = [];

    if (filters) {
      const category = filters.find(f => f.filterType === FilterType.Category);
      const sortBy = filters.find(f => f.filterType === FilterType.SortBy);
      const text = filters.find(f => f.filterType === FilterType.Text);
      const cityOrProvince = filters.find(f => f.filterType === FilterType.City || f.filterType === FilterType.Province);
      const raceOrSpecie = filters.find(f => f.filterType === FilterType.Race || f.filterType === FilterType.Specie);
      const age = filters.find(f => f.filterType === FilterType.Age && f.filterValue !== Age.Unknown);
      const gender = filters.find(f => f.filterType === FilterType.Gender && f.filterValue !== Gender.Unknown);
      const registered = filters.find(f => f.filterType === FilterType.Registered);

      if (category) {
        keys.push(category.filterValue);
      }

      if (cityOrProvince) {
        keys.push(cityOrProvince.filterValue);
      }

      if (raceOrSpecie) {
        keys.push(raceOrSpecie.filterValue);
      }

      if (registered) {
        keys.push('Rekisteröity');
      }

      if (text) {
        keys.push(text.filterValue);
      }

      if (gender) {
        keys.push(gender.filterValue);
      }

      if (age) {
        keys.push(age.filterValue);
      }

      if (sortBy) {
        keys.push(sortBy.filterValue);
      }
    }

    return keys.join(', ').replace(', ', ' · ');
  };

  const handleDeleteSearch = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>): Promise<void> => {
    event.stopPropagation();
    event.preventDefault();
    try {
      if (search.id) {
        dispatch(deleteSavedSearch(search.id));
        await savedSearchService.deleteOwnSearch(search.id);
      }
      dispatch(showToast(({
        open: true,
        severity: Severity.Success,
        message: 'Haku poistettiin.',
        timeout: 3,
      })));
    } catch (error) {
      dispatch(showToast({
        open: true,
        severity: Severity.Error,
        message: 'Haun poistaminen epäonnistui.',
        timeout: 3,
      }));
    }
  };

  const handleSetSearchProps = (search: UserSearch): void => {
    if (search.filters) {

      dispatch(setSearchProps({
        ...searchProps,
        filters: search.filters
      }));

      dispatch(setLastSavedSearch(search));

      const enableMoreFilters = search.filters.find(f =>
        f.filterType === FilterType.Registered ||
        f.filterType === FilterType.Age ||
        f.filterType === FilterType.Gender ||
        f.filterType === FilterType.Text
      );

      if (enableMoreFilters) {
        dispatch(setMoreFilters({ visible: true }));
      }

      history.push('/');
    }
  };


  return (
    <CardActionArea onClick={() => handleSetSearchProps(search)}>
      <ListItem>
        <ListItemAvatar>
          <Avatar>
            <FindInPage />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary={getFiltersAsText(search.filters)} secondary={<Typography sx={{ opacity: 0.75 }} variant='caption'>{moment(search.date).format('Do MMMM[ta]')}</Typography>} />
        <IconButton
          onClick={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => handleDeleteSearch(event)}
          onMouseDown={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => event.stopPropagation()}
          onTouchStart={(event: React.TouchEvent<HTMLButtonElement>) => event.stopPropagation()}
        >
          <Delete />
        </IconButton>
      </ListItem>
    </CardActionArea>
  );
};

export default SearchItem;