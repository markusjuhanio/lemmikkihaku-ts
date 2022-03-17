import { createTheme, Theme } from '@mui/material';

const primaryColor = '#F50057';
const borderRadius = 15;

export const DARK_THEME: Theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: primaryColor,
    },
    secondary: {
      main: '#fafafa'
    },
    text: {
      secondary: '#fafafa'
    },
    info: {
      main: '#fff'
    },
  },
  shape: {
    borderRadius: borderRadius
  }
});

export const LIGHT_THEME: Theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: primaryColor,
    },
    text: {
      secondary: '#333'
    },
    secondary: {
      main: '#444'
    },
    background: {
      default: '#f1f1f1'
    },
    info: {
      main: '#333'
    },
  },
  shape: {
    borderRadius: borderRadius
  }   
});