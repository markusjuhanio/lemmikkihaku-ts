import React, { useState } from 'react';
import { Box, IconButton } from '@mui/material';
import { AdminViewUser, GridColumn } from '../../../types';
import { MoreVert } from '@mui/icons-material';
import TableRoot from '../TableRoot';
import UserActionMenu from './UserActionMenu';

interface UserTableProps {
  users: AdminViewUser[],
  searchPlaceholderText: string
}

const Table = (props: UserTableProps) => {
  const { users, searchPlaceholderText } = props;
  const [actionMenuRef, setActionMenuRef] = useState<EventTarget & HTMLButtonElement | null>();
  const [selectedUser, setSelectedUser] = useState<AdminViewUser | null>();
  const [actionMenuOpen, setActionMenuOpen] = useState<boolean>(false);

  const columns: GridColumn[] = [
    {
      field: 'nickname',
      headerName: 'Nimimerkki',
      width: 125,
    },
    {
      field: 'email',
      headerName: 'Sähköpostiosoite',
      width: 200,
    },
    {
      field: 'role',
      headerName: 'Rooli',
      width: 100
    },
    {
      field: 'activated',
      headerName: 'Tila',
      width: 120,
      valueGetter: (params: { row: { activated: number; }; }) => params.row.activated === 1 ? 'Käytössä' : 'Ei käytössä'
    },
    {
      field: 'action',
      headerName: 'Hallinta',
      align: 'right' as const,
      minWidth: 85,
      type: 'number',
      flex: 1,
      renderCell: (params: { row: unknown; }) => {
        const onClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
          e.stopPropagation();
          setActionMenuRef(e.currentTarget);
          setSelectedUser(params.row as AdminViewUser);
          setActionMenuOpen(true);
        };
        return <IconButton onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => onClick(e)}><MoreVert /></IconButton>;
      }
    },
  ];


  const handleActionMenuClose = (): void => {
    setActionMenuRef(null);
    setActionMenuOpen(false);
  };

  return (
    <Box>
      <TableRoot columns={columns} rows={users} searchPlaceholderText={searchPlaceholderText} />
      {selectedUser && actionMenuRef && (
        <UserActionMenu open={actionMenuOpen} selectedUser={selectedUser} actionMenuRef={actionMenuRef} onClose={handleActionMenuClose} />
      )}
    </Box >
  );
};

export default Table;