import { createAction } from '@reduxjs/toolkit';
import { AnyAction } from 'redux';

interface MoreFiltersState {
  visible: boolean
}

const initialState: MoreFiltersState = {
  visible: false,
};

export const setMoreFilters = createAction<MoreFiltersState>('setMoreFilters');

export const moreFiltersReducer = (state = initialState, action: AnyAction): MoreFiltersState => {
  switch (action.type) {
  case 'setMoreFilters':
    return action.payload as MoreFiltersState;
  default:
    return state;
  }
};