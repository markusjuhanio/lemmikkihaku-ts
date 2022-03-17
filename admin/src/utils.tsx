import React from 'react';
import { render } from 'react-dom';
import Confirm from './components/popups/Confirm';
import { AdminViewListing } from './types';

export const isEmptyString = (value: string): boolean => {
  if (!value) {
    return true;
  } else if (value.length === 0) {
    return true;
  }
  return false;
};

export const isDarkModeSelected = (): boolean => {
  const savedMode = localStorage.getItem('darkMode');
  if (savedMode) {
    const darkMode = JSON.parse(savedMode) as boolean;
    if (darkMode) {
      return true;
    }
    return false;
  }
  return false;
};


export const isString = (value: unknown): boolean => {
  if (typeof value === 'string') {
    return true;
  }
  return false;
};

export const confirm = (text: string): Promise<boolean> => {
  let resolve: (value: boolean | PromiseLike<boolean>) => void;

  const promise = new Promise<boolean>((res, _rej) => {
    resolve = res;
    const containerElement = document.createElement('div');
    document.body.appendChild(containerElement);
    render(<Confirm text={text} resolve={resolve} />, containerElement);
  });

  return promise;
};


export const isTypeOfListing = (object: unknown): object is AdminViewListing => {
  return Object.prototype.hasOwnProperty.call(object, 'title') &&
    Object.prototype.hasOwnProperty.call(object, 'shortDescription');
};

export const setMetaColor = (darkMode: boolean) => {
  const metaColor = document.querySelector('meta[name="theme-color"]');
  if (metaColor) {
    metaColor.setAttribute('content', darkMode === true ? '#121212' : '#f5f5f5');
  }
};