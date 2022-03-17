import { createAction } from '@reduxjs/toolkit';
import { AnyAction } from 'redux';
import { PublicListing } from '../types';

const initialState: PublicListing[] = [];

export const setListings = createAction<PublicListing[]>('setListings');
export const updateListing = createAction<PublicListing>('updateListing');
export const deleteListing = createAction<string>('deleteListing');
export const addListing = createAction<PublicListing>('addListing');

export const listingsReducer = (state = initialState, action: AnyAction): PublicListing[]=> {
  switch (action.type) {
  case 'setListings':
    return action.payload as PublicListing[];
  case 'updateListing':
    return state.map((listing: PublicListing) => listing.id === action.payload.id ? action.payload as PublicListing : listing);
  case 'deleteListing':
    return state.filter((listing: PublicListing) => listing.id !== action.payload);
  case 'addListing':
    return [action.payload, ...state] as PublicListing[];
  default:
    return state;
  }
};