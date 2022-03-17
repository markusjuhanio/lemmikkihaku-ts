import { createAction } from '@reduxjs/toolkit';
import { AnyAction } from 'redux';
import { MAX_LISTINGS_PER_PAGE } from '../constants';
import { Category, FilterType, ListingType, SearchProps, SortBy } from '../types';

export const initialState: SearchProps = {
  offset: 0,
  limit: MAX_LISTINGS_PER_PAGE,
  page: 1,
  filters: [
    {
      filterType: FilterType.Category,
      filterValue: Category.All
    },
    {
      filterType: FilterType.SortBy,
      filterValue: SortBy.Newest
    },
    {
      filterType: FilterType.ListingType,
      filterValue: ListingType.Animal
    }
  ]
};

export const setSearchProps = createAction<SearchProps>('setSearchProps');
export const setDefaultSearchProps = createAction('setDefaultSearchProps');

export const searchPropsReducer = (state = initialState, action: AnyAction): SearchProps => {
  switch (action.type) {
  case 'setSearchProps':
    return action.payload as SearchProps;
  case 'setDefaultSearchProps':
    return initialState;
  default:
    return state;
  }
};