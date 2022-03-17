import React from 'react';
import { Typography, Box } from '@mui/material';
import { useHistory } from 'react-router-dom';

interface LogoProps {
  src: string,
  width: number,
  height: number,
}

const Logo = (props: LogoProps) => {
  const { src, width, height } = props;
  const history = useHistory();

  return (
    <Box onClick={() => history.push('/')} sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
      <img style={{ paddingRight: 10 }} src={src} width={width} height={height} />
      <Box sx={{ display: { xs: 'none', sm: 'flex' }, userSelect: 'none', mr: -7, flexDirection: 'column', alignItems: 'flex-start' }} >
        <Typography variant='subtitle2' sx={{ fontSize: 12 }} color='secondary'>
          ADMIN
        </Typography>
      </Box>
    </Box >
  );
};

export default Logo;