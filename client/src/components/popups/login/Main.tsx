import React, { useEffect, useState } from 'react';
import { Dialog, Divider, Typography, Box, IconButton, Tabs, Tab } from '@mui/material';
import { useAppSelector } from '../../../hooks';
import CloseIcon from '@mui/icons-material/Close';
import { LoginModalStage } from '../../../types';
import { setLoginModal } from '../../../reducers/loginModalReducer';
import { useDispatch } from 'react-redux';
import LoginStage from './children/Login';
import RegisterStage from './children/Register';
import ResetPasswordStage from './children/ResetPassword';

const Login = () => {
  const opened = useAppSelector(state => state.loginModal.opened);
  const tab = useAppSelector(state => state.loginModal.tab);
  const dispatch = useDispatch();

  const [selectedTab, setSelectedTab] = useState<number>(tab);

  useEffect(() => {
    setSelectedTab(tab);
  }, [tab]);

  const handleClose = (): void => {
    dispatch(setLoginModal({ opened: false, tab: 0 }));
  };

  const getStageTitle = (): string => {
    switch (selectedTab) {
    case 0:
      return LoginModalStage.Login;
    case 1:
      return LoginModalStage.Register;
    case 2:
      return LoginModalStage.ResetPassword;
    default:
      return LoginModalStage.Login;
    }
  };

  const getStage = () => {
    switch (selectedTab) {
    case 0:
      return (
        <LoginStage handleClose={handleClose} />
      );
    case 1:
      return (
        <RegisterStage />
      );
    case 2:
      return (
        <ResetPasswordStage />
      );
    default:
      return <LoginStage handleClose={handleClose} />;
    }
  };

  return (
    <Dialog onClose={handleClose} open={opened}>

      <Box sx={{
        minWidth: 310,
        maxWidth: 400,
        p: 3,
        display: 'flex',
        flexDirection: 'column',
        gap: 1
      }}>
        <Typography sx={{ textAlign: 'center', fontWeight: 'bold' }} variant='h5'>
          {getStageTitle()}
        </Typography>

        <Tabs sx={{ mb: -1 }} value={selectedTab} onChange={(event, value: number) => setSelectedTab(value)} variant='scrollable'>
          <Tab value={0} label={LoginModalStage.Login} />
          <Tab value={1} label={LoginModalStage.Register} />
          <Tab value={2} label={LoginModalStage.ResetPassword} />
        </Tabs>

        <IconButton onClick={handleClose} size='small' sx={{ position: 'absolute', right: 8, top: 8 }}>
          <CloseIcon />
        </IconButton>

        <Divider />
        <Box sx={{ pt: 2 }}>
          {getStage()}
        </Box>
      </Box>
    </Dialog>
  );
};

export default Login;