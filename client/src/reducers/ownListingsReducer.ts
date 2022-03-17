import { createAction } from '@reduxjs/toolkit';
import { AnyAction } from 'redux';
import { OwnListing } from '../types';

const initialState: OwnListing[] = [];

export const setOwnListings = createAction<OwnListing[]>('setOwnListings');
export const updateOwnListing = createAction<OwnListing>('updateOwnListing');
export const deleteOwnListing = createAction<string>('deleteOwnListing');

export const ownListingsReducer = (state = initialState, action: AnyAction): OwnListing[] => {
  switch (action.type) {
  case 'setOwnListings':
    return action.payload as OwnListing[];
  case 'updateOwnListing':
    return state.map((listing: OwnListing) => listing.id === action.payload.id ? action.payload as OwnListing : listing);
  case 'deleteOwnListing':
    return state.filter((listing: OwnListing) => listing.id !== action.payload as string);
  default:
    return state;
  }
};