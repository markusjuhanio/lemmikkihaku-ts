import * as React from 'react';
import { LoggedUserView, Route } from './types';
import Info from './components/pages/Info';
import Search from './components/pages/search/Main';
import Post from './components/pages/post/Main';
import Profile from './components/pages/profile/Main';
import TermsOfService from './components/pages/TermsOfService';
import RegistryDescription from './components/pages/RegistryDescription';
import Listing from './components/Listing';
import Contact from './components/pages/Contact';
import { Article, Favorite, FindInPage, Chat, Settings } from '@mui/icons-material';
import VerifyEmail from './components/pages/VerifyEmail';
import ChangePassword from './components/pages/ChangePassword';

export const routes: Route[] = [
  {
    path: '/',
    component: Search
  },
  {
    path: '/ilmoita',
    component: Post
  },
  {
    path: '/ilmoitus/:id',
    component: Listing
  },
  {
    path: '/oma-sivu',
    component: Profile,
    requireLogin: true
  },
  {
    path: '/tietoa',
    component: Info
  },
  {
    path: '/kayttoehdot',
    component: TermsOfService
  },
  {
    path: '/rekisteriseloste',
    component: RegistryDescription
  },
  {
    path: '/ota-yhteytta',
    component: Contact
  },
  {
    path: '/vahvista-sahkoposti/:guid',
    component: VerifyEmail
  },
  {
    path: '/vaihda-salasana/:guid',
    component: ChangePassword
  },
];

export const profileViews: LoggedUserView[] = [
  {
    title: 'Ilmoitukset',
    icon: <Article fontSize='small' color='secondary' />
  },
  {
    title: 'Suosikit',
    icon: <Favorite fontSize='small' color='secondary' />
  },
  {
    title: 'Haut',
    icon: <FindInPage fontSize='small' color='secondary' />
  },
  {
    title: 'Keskustelut',
    icon: <Chat fontSize='small' color='secondary' />
  },
  {
    title: 'Asetukset',
    icon: <Settings fontSize='small' color='secondary' />
  },
];