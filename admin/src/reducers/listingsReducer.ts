import { createAction } from '@reduxjs/toolkit';
import { AnyAction } from 'redux';
import { AdminViewListing } from '../types';

const initialState: AdminViewListing[] = [];

export const setListings = createAction<AdminViewListing[]>('setListings');
export const updateListing = createAction<AdminViewListing>('updateListing');
export const deleteListing = createAction<string>('deleteListing');
export const addListing = createAction<AdminViewListing>('addListing');

export const listingsReducer = (state = initialState, action: AnyAction): AdminViewListing[] => {
  switch (action.type) {
  case 'setListings':
    return action.payload as AdminViewListing[];
  case 'updateListing':
    return state.map(listing => listing.id === action.payload.id ? action.payload as AdminViewListing : listing);
  case 'deleteListing':
    return state.filter(listing => listing.id !== action.payload);
  case 'addListing': {
    const newState = state.filter(listing => listing.id !== action.payload.id);
    return [action.payload, ...newState] as AdminViewListing[];
  }
  default:
    return state;
  }
};