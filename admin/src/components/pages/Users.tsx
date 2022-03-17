import React from 'react';
import { Box, Paper } from '@mui/material';
import PageSectionHeader from '../PageSectionHeader';
import { useAppSelector, useDocumentTitle } from '../../hooks';
import UserTable from '../tables/user/UserTable';
import { AdminViewUser } from '../../types';

const title = 'Käyttäjät';

const Users = () => {
  const users: AdminViewUser[] = useAppSelector(state => state.users);

  useDocumentTitle(title);

  return (
    <Box>
      <PageSectionHeader title={`${title} · ${users.length}`} />
      <Paper>
        <UserTable users={users} searchPlaceholderText='Hae käyttäjiä' />
      </Paper>
    </Box>
  );
};

export default Users;