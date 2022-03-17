import React, { useState } from 'react';
import { Box, IconButton } from '@mui/material';
import { AdminViewListing, GridColumn } from '../../../types';
import { MoreVert } from '@mui/icons-material';
import TableRoot from '../TableRoot';
import ListingActionMenu from './ListingActionMenu';

interface ListingTableProps {
  listings: AdminViewListing[],
  searchPlaceholderText: string
}

const Table = (props: ListingTableProps) => {
  const { listings, searchPlaceholderText } = props;
  const [actionMenuRef, setActionMenuRef] = useState<EventTarget & HTMLButtonElement | null>();
  const [selectedListing, setSelectedListing] = useState<AdminViewListing | null>();
  const [actionMenuOpen, setActionMenuOpen] = useState<boolean>(false);

  const handleActionMenuClose = (): void => {
    setActionMenuRef(null);
    setTimeout(() => {
      setSelectedListing(null);
    }, 250);
    setActionMenuOpen(false);
  };
  

  const getStatus = (row: AdminViewListing) => {
    if (row?.deleted === 1) {
      return 'Poistettu';
    } else {
      if (row?.activated === 1) {
        return 'Julkaistu';
      } else {
        if (row?.rejected === 1) {
          return 'Hylätty';
        } else {
          return 'Ei tarkistettu';
        }
      }
    }
  };

  const columns: GridColumn[] = [
    {
      field: 'title',
      headerName: 'Otsikko',
      width: 170,
    },
    {
      field: 'user.nickname',
      headerName: 'Käyttäjä',
      width: 125,
      valueGetter: (params: { row: { user: { nickname: string; }; }; }) => params.row.user.nickname
    },
    {
      field: 'activated',
      headerName: 'Tila',
      width: 145,
      valueGetter: (params: { row: AdminViewListing; }) => getStatus(params.row)
    },
    {
      field: 'action',
      headerName: 'Hallinta',
      flex: 1,
      minWidth: 85,
      align: 'right' as const,
      type: 'number',
      renderCell: (params: { row: unknown; }) => {
        const onClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
          e.stopPropagation();
          setActionMenuRef(e.currentTarget);
          setSelectedListing(params.row as AdminViewListing);
          setActionMenuOpen(true);
        };
        return <IconButton onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => onClick(e)}><MoreVert /></IconButton>;
      }
    },
  ];

  return (
    <Box>
      <TableRoot columns={columns} rows={listings} searchPlaceholderText={searchPlaceholderText} />
      {selectedListing && actionMenuRef && (
        <ListingActionMenu open={actionMenuOpen} selectedListing={selectedListing} actionMenuRef={actionMenuRef} onClose={handleActionMenuClose} />
      )}
    </Box>
  );
};

export default Table;
