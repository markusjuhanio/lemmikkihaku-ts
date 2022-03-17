import React from 'react';
import { Close, Search } from '@mui/icons-material';
import { IconButton, TextField } from '@mui/material';

interface FilterProps {
  placeholder: string,
  filter: string,
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void,
  onClear: () => void,
}

const TableFilter = (props: FilterProps) => {
  const { placeholder, filter, onChange, onClear } = props;
  return (
    <TextField
      fullWidth
      type={'text'}
      value={filter}
      onChange={onChange}
      placeholder={placeholder}
      variant='outlined'
      InputProps={{
        startAdornment: <Search sx={{ mr: 1 }} />,
        endAdornment: filter.length > 0 && (<IconButton size='small' onClick={onClear}><Close /></IconButton>)
      }}
    />
  );
};

export default TableFilter;