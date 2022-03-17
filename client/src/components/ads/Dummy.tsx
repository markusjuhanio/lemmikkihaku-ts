import React from 'react';
import { Paper, Typography } from '@mui/material';

const Dummy = () => {
  return (
    <Paper sx={{ p: 2, minHeight: 200, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Typography variant='h6'>
        MAINOS
      </Typography>
    </Paper>
  );
};

export default Dummy;