import React, { lazy, Suspense } from 'react';
import { Container, Box } from '@mui/material';
import MenuAppbar from './components/MenuAppbar';
import { ThemeProvider } from '@mui/system';
import { DARK_THEME, LIGHT_THEME } from './themes';
import { CssBaseline } from '@mui/material';
import { Route, BrowserRouter as Router, Switch, Redirect } from 'react-router-dom';
import LoadingSpinner from './components/LoadingSpinner';
import { useAppSelector, useAutoLogin, useIsLoggedIn, useListenForConversations, useListenForListings, useListenForMessages, useListenForNotifications, useLoadConversations, useLoadNotifications, usePrefersDarkMode } from './hooks';
import { routes } from './routes';
import Footer from './components/Footer';
import { APP_WIDTH } from './constants';
import { setMetaColor } from './utils';

const Login = lazy(() => import('./components/popups/login/Main'));
const SessionExpired = lazy(() => import('./components/popups/SessionExpired'));
const Cookies = lazy(() => import('./components/popups/CookieDialog'));
const Toast = lazy(() => import('./components/Toast'));

const App = () => {
  const isLoggedIn: boolean = useIsLoggedIn();

  const darkMode = useAppSelector(state => state.darkMode);
  setMetaColor(darkMode.enabled);
  usePrefersDarkMode();

  useAutoLogin();

  useLoadNotifications();
  useLoadConversations();

  useListenForConversations();
  useListenForMessages();
  useListenForNotifications();
  useListenForListings();

  return (
    <ThemeProvider theme={darkMode.enabled ? DARK_THEME : LIGHT_THEME}>
      <CssBaseline />
      <Suspense fallback={null}>
        <Login />
        <SessionExpired />
        <Toast />
        <Cookies />
      </Suspense>
      <Router>
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          height: '100%',
          gap: 2
        }}>
          <Container sx={{ maxWidth: APP_WIDTH, flex: 1, pt: 2 }} maxWidth={false}>
            <MenuAppbar />
            <Suspense fallback={<LoadingSpinner />}>
              <Switch>
                {routes.map((route, i) =>
                  route.requireLogin && !isLoggedIn ? null : <Route key={i} exact path={route.path} component={route.component} />
                )}
                <Redirect from='*' to='/' />
              </Switch>
            </Suspense>
          </Container>
          <Footer />
        </Box>
      </Router>
    </ThemeProvider >
  );
};


export default App;
