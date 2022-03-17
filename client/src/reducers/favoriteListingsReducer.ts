import { createAction } from '@reduxjs/toolkit';
import { AnyAction } from 'redux';
import { PublicListing } from '../types';

const initialState: PublicListing[] = [];

export const setFavoriteListings = createAction<PublicListing[]>('setFavoriteListings');
export const updateFavoriteListing = createAction<PublicListing>('updateFavoriteListing');
export const deleteFavoriteListing = createAction<string>('deleteFavoriteListing');

export const favoriteListingsReducer = (state = initialState, action: AnyAction): PublicListing[] => {
  switch (action.type) {
  case 'setFavoriteListings':
    return action.payload as PublicListing[];
  case 'updateFavoriteListing':
    return state.map(listing => listing.id === action.payload.id ? action.payload as PublicListing : listing);
  case 'deleteFavoriteListing':
    return state.filter(listing => listing.id !== action.payload as string);
  default:
    return state;
  }
};