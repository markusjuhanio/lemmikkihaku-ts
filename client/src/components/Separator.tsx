import { ReactJSXElement } from '@emotion/react/types/jsx-namespace';
import { Typography } from '@mui/material';
import React from 'react';
import { isDarkModeSelected } from '../utils';

interface SeparatorButtonProps {
  button?: ReactJSXElement,
  text?: string,
}

const Separator = (props: SeparatorButtonProps) => {
  const { button, text } = props;
  return (
    <div className={isDarkModeSelected() ? 'separator-dark' : 'separator'}>
      {button ? button : <Typography sx={{ opacity: 0.75 }} variant='caption'>{text}</Typography>}
    </div>
  );
};

export default Separator;