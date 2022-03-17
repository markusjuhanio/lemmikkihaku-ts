import { createAction } from '@reduxjs/toolkit';
import { AnyAction } from 'redux';
import { ListingEntry, ListingType, PublicUser } from '../types';

const initialState: ListingEntry = {
  id: '',
  title: '',
  category: '',
  specie: '',
  gender: '',
  age: '',
  race: '',
  registrationNumber: '',
  province: '',
  city: '',
  shortDescription: '',
  fullDescription: '',
  type: ListingType.Animal,
  images: [],
  price: '',
  date: new Date(),
  user: null
};

export const setNewListing = createAction<ListingEntry>('setNewListing');
export const setDefaultNewListing = createAction<PublicUser | undefined>('setDefaultNewListing');

export const newListingReducer = (state = initialState, action: AnyAction): ListingEntry => {
  switch (action.type) {
  case 'setNewListing':
    return action.payload as ListingEntry;
  case 'setDefaultNewListing':
    return { ...initialState, user: action.payload as PublicUser, date: new Date() };
  default:
    return state;
  }
};