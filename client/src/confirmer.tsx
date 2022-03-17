import * as React from 'react';
import { render } from 'react-dom';
import Confirm from './components/popups/Confirm';

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