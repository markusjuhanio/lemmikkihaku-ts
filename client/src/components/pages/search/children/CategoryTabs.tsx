import React from 'react';
import { Tabs, Tab, Paper } from '@mui/material';
import { Category, SearchProps, FilterOption, FilterType } from '../../../../types';
import { setSearchProps } from '../../../../reducers/searchPropsReducer';
import { Dispatch } from 'redux';
import { MAX_LISTINGS_PER_PAGE } from '../../../../constants';

interface CategoryProps {
  searchProps: SearchProps,
  dispatch: Dispatch
}

const CategoryTabs = (props: CategoryProps) => {
  const { searchProps, dispatch } = props;

  const handleChange = (event: React.SyntheticEvent<Element, Event>, value: string) => {
    const filters: FilterOption[] = searchProps.filters.filter(s => s.filterType !== FilterType.Category);
    if (value) {
      filters.push({ filterType: FilterType.Category, filterValue: value });
    }
    dispatch(setSearchProps({
      ...searchProps,
      filters: filters,
      offset: 0,
      limit: MAX_LISTINGS_PER_PAGE,
      page: 1
    }));
  };

  return (
    <Paper
      sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
      <Tabs
        value={searchProps.filters.find(s => s.filterType === FilterType.Category)?.filterValue}
        onChange={handleChange}
        indicatorColor='primary'
        scrollButtons={true}
        allowScrollButtonsMobile
        variant='scrollable'
      >
        {Object.values(Category).map((category, i) =>
          <Tab key={i} value={category} label={category} />
        )}
      </Tabs>
    </Paper>
  );
};

export default CategoryTabs;