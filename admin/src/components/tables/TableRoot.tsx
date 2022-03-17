import React, { useState, useEffect } from 'react';
import { DataGrid, fiFI, GridColumns } from '@mui/x-data-grid';
import { AdminViewResource } from '../../types';
import { Box } from '@mui/material';
import { isString, isTypeOfListing } from '../../utils';
import TableFilter from './TableFilter';
import { useAppDispatch } from '../../hooks';
import { setListingToPreview } from '../../reducers/selectedListingReducer';

interface GridProps {
  searchPlaceholderText: string,
  columns: GridColumns | unknown,
  rows: AdminViewResource[],
}

const TableRoot = (props: GridProps) => {
  const { searchPlaceholderText, columns, rows } = props;
  const [filter, setFilter] = useState<string>('');
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (rows) {
      filterData();
    }
  }, [rows, filter]);

  const filterData = (): AdminViewResource[] => {
    const found: AdminViewResource[] = [];
    const text = filter.toLowerCase();
    for (const obj of rows) {
      Object.values(obj).forEach((property: string) => {
        let value: string = property;
        if (isString(value) && isString(text)) {
          value = value.toLowerCase();
          if (value.includes(text)) {
            if (!found.includes(obj)) {
              found.push(obj);
            }
          }
        }
      });
    }
    return found;
  };

  const handleFilterClear = (): void => {
    setFilter('');
  };

  const handleRowClick = (row: AdminViewResource): void => {
    if (isTypeOfListing(row)) {
      dispatch(setListingToPreview(row));
    }
  };

  const handleFilterChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setFilter(event.target.value);
  };

  return (
    <Box>
      <Box sx={{ p: 2 }}>
        <TableFilter placeholder={searchPlaceholderText} filter={filter} onChange={handleFilterChange} onClear={handleFilterClear} />
      </Box>
      <Box sx={{ height: 370 }}>
        <DataGrid
          localeText={fiFI.components.MuiDataGrid.defaultProps.localeText}
          sx={{ border: 'none' }}
          rows={filterData()}
          columns={columns as GridColumns}
          pageSize={5}
          onRowClick={(params) => {
            const obj = params.row as AdminViewResource;
            handleRowClick(obj);
          }}
          rowsPerPageOptions={[5]}
          disableColumnFilter
          disableColumnSelector
          disableColumnMenu
          hideFooterSelectedRowCount
          disableSelectionOnClick
        />
      </Box>
    </Box>
  );
};

export default TableRoot;