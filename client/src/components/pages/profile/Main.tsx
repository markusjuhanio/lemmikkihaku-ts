import React, { useEffect, useState } from 'react';
import { Box, Paper, Tabs, Tab } from '@mui/material';
import PageSectionHeader from '../../PageSectionHeader';
import { useAppSelector, useDocumentTitle } from '../../../hooks';
import { useHistory, useLocation } from 'react-router-dom';
import { ProfileHistory, LoggedUserView } from '../../../types';
import OwnListings from './children/OwnListings';
import Favorites from './children/Favorites';
import Chat from './children/chat/Main';
import Searches from './children/searches/Main';
import Settings from './children/Settings';
import { profileViews } from '../../../routes';

const title = 'Oma sivu';

const Main = () => {
  const history = useHistory<ProfileHistory>();
  const location = useLocation<ProfileHistory>();
  const user = useAppSelector(state => state.user.user);
  const [selectedTab, setSelectedTab] = useState<number>(location && location.state ? location.state.tab : 0);

  useDocumentTitle(title);

  useEffect(() => {
    if (location && location.state) {
      setSelectedTab(location.state.tab);
    }
  }, [location]);

  const getComponent = (): JSX.Element => {
    switch (selectedTab) {
    case 0:
      return <OwnListings user={user} />;
    case 1:
      return <Favorites user={user} />;
    case 2:
      return <Searches />;
    case 3:
      return <Chat user={user} />;
    case 4:
      return <Settings user={user} />;
    default:
      return <OwnListings user={user} />;
    }
  };

  const handleTabChange = (value: number): void => {
    setSelectedTab(value);
    const newState = { ...history.location.state, tab: value };
    history.replace({ ...history.location, state: newState });
  };

  return (
    <Box>
      <PageSectionHeader title={user ? user.nickname : title} />
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 0
      }}>
        <Paper sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: 70
        }}>
          <Tabs
            value={selectedTab}
            onChange={(event: React.SyntheticEvent<Element, Event>, newValue: number) => handleTabChange(newValue)}
            indicatorColor='primary'
            scrollButtons={true}
            allowScrollButtonsMobile
            variant='scrollable'
          >
            {profileViews.map((view: LoggedUserView, i: number) => (
              <Tab key={i} value={i} label={view.title} icon={view.icon} />
            ))}
          </Tabs>
        </Paper>

        {getComponent()}

      </Box>

    </Box>
  );
};

export default Main;