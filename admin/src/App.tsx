import React from 'react';
import Container from '@mui/material/Container';
import MenuAppbar from './components/MenuAppbar';
import { ThemeProvider } from '@mui/system';
import { DARK_THEME, LIGHT_THEME } from './themes';
import { CssBaseline, Box } from '@mui/material';
import { Route, BrowserRouter as Router, Switch, Redirect } from 'react-router-dom';
import { useAutoLogin, useDarkModeHandler, useIsLoggedIn, useListenForListings, useLoadListings, useLoadUsers } from './hooks';
import Login from './components/pages/Login';
import Dashboard from './components/pages/Dashboard';
import Users from './components/pages/Users';
import Listings from './components/pages/Listings';
import { setMetaColor } from './utils';
import { APP_WIDTH } from './constants';
import Footer from './components/Footer';

const App = () => {
  const darkMode = useDarkModeHandler();
  const isLoggedIn: boolean = useIsLoggedIn();

  setMetaColor(darkMode.enabled);

  useAutoLogin();
  useLoadListings();
  useLoadUsers();

  useListenForListings();

  return (
    <ThemeProvider theme={darkMode.enabled ? DARK_THEME : LIGHT_THEME}>
      <CssBaseline />
      <Router>
        {isLoggedIn
          ? <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', gap: 2 }}>
            <Container sx={{ bgcolor: 'background.default', mb: 1, mt: 2, maxWidth: APP_WIDTH }} maxWidth={false}>
              <MenuAppbar />
              <Switch>
                <Route exact path='/users' component={Users} />
                <Route exact path='/listings' component={Listings} />
                <Route exact path='/' component={Dashboard} />
              </Switch>
            </Container>
            <Footer />
          </Box>
          : <Route exact path='/' component={Login} />
        }
        <Redirect from='*' to='/' />
      </Router>
    </ThemeProvider >
  );
};

export default App;
