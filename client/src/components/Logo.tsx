import React from 'react';
import { Box } from '@mui/material';
import { useHistory } from 'react-router-dom';
import { setDefaultSearchProps } from '../reducers/searchPropsReducer';
import { useAppDispatch } from '../hooks';
import { setMoreFilters } from '../reducers/moreFiltersReducer';
import { setDefaultLastSavedSearch } from '../reducers/lastSavedSearch';

interface LogoProps {
  src: string,
  width: number,
  height: number
}

const Logo = (props: LogoProps) => {
  const { src, width, height } = props;
  const history = useHistory();
  const dispatch = useAppDispatch();

  const handleClick = () => {
    history.push('/');
    dispatch(setDefaultSearchProps());
    dispatch(setMoreFilters({ visible: false }));
    dispatch(setDefaultLastSavedSearch());
  };

  return (
    <Box onClick={handleClick} sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
      <img style={{ paddingRight: 10 }} src={src} width={width} height={height} />
    </Box>
  );
};

export default Logo;