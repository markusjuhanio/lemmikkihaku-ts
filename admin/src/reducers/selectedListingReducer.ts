import { createAction } from '@reduxjs/toolkit';
import { AnyAction } from 'redux';
import { AdminViewListing } from '../types';

let initialState: AdminViewListing | null;

export const setListingToPreview = createAction<AdminViewListing | null>('setListingToPreview');

export const listingPreviewReducer = (state = initialState, action: AnyAction): AdminViewListing | null => {
  switch (action.type) {
  case 'setListingToPreview':
    return action.payload as AdminViewListing;
  default:
    return state ? state : null;
  }
};