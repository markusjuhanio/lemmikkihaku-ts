import React from 'react';
import { MenuItem, FormControl, InputLabel, Select, SelectChangeEvent } from '@mui/material';
import { FilterOption, SearchProps, SortBy, FilterType } from '../../../../types';
import { setSearchProps } from '../../../../reducers/searchPropsReducer';
import { Dispatch } from 'redux';

interface SortSelectorProps {
  searchProps: SearchProps,
  dispatch: Dispatch
}

const SortSelector = (props: SortSelectorProps) => {
  const { searchProps, dispatch } = props;
  const handleChange = (event: SelectChangeEvent<string>) => {
    const filters: FilterOption[] = searchProps.filters.filter(s => s.filterType !== FilterType.SortBy);
    if (event.target.value) {
      filters.push({ filterType: FilterType.SortBy, filterValue: event.target.value });
    }
    dispatch(setSearchProps({
      ...searchProps,
      filters: filters
    }));
  };

  return (
    <FormControl size='small' sx={{ minWidth: 120 }}>
      <InputLabel>Järjestys</InputLabel>
      <Select
        value={searchProps.filters.find(s => s.filterType === FilterType.SortBy)?.filterValue}
        label="Järjestys"
        onChange={handleChange}
      >
        {Object.values(SortBy).map((sortBy, i) =>
          <MenuItem key={i} value={sortBy}>{sortBy}</MenuItem>
        )}
      </Select>
    </FormControl>
  );
};

export default SortSelector;