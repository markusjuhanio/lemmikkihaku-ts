import express from 'express';
import { grantAccess, validate, validator } from '../middleware';
import userService from '../services/userService';
import { AdminViewUser, OwnListing, OwnUser, PublicListing } from '../types';
const router = express.Router();

/* For admins */
router.get('/', grantAccess('readAny', 'user'), async (_req, res) => {
  const users: AdminViewUser[] = await userService.getUsers();
  res.json(users);
});

router.get('/:id', grantAccess('readAny', 'user'), async (req, res) => {
  const id: string = req.params.id;
  const user: AdminViewUser = await userService.getUser(id);
  res.json(user);
});

router.put('/activate/:id', grantAccess('updateAny', 'user'), async (req, res) => {
  const id: string = req.params.id;
  const user: AdminViewUser = await userService.activateUser(id);
  res.json(user);
});

router.put('//:id', grantAccess('updateAny', 'user'), async (req, res) => {
  const id: string = req.params.id;
  const user: AdminViewUser = await userService.deactivateUser(id);
  res.json(user);
});

router.get('/favoriteListings/:id', grantAccess('readOwn', 'user'), async (req: any, res) => {
  const userId: string = req.userId;
  const favoriteListings: PublicListing[] = await userService.getFavoriteListings(userId);
  res.json(favoriteListings);
});

router.get('/listings/:id', grantAccess('readOwn', 'user'), async (req: any, res) => {
  const userId: string = req.userId;
  const listings: OwnListing[] = await userService.getOwnListings(userId);
  res.json(listings);
});

router.put('/addFavoriteListing/:id', grantAccess('updateOwn', 'user'), async (req, res) => {
  const id: string = req.params.id;
  const listingId: string = req.body.listingId;
  const user: OwnUser = await userService.addFavoriteListing(id, listingId);
  res.json(user);
});

router.delete('/:id', grantAccess('deleteOwn', 'user'), async (req, res) => {
  const id: string = req.params.id;
  const user: OwnUser = await userService.deleteUser(id);
  res.json(user);
});

router.delete('/:id', grantAccess('deleteOwn', 'user'), async (req, res) => {
  const id: string = req.params.id;
  const user: OwnUser = await userService.deleteUser(id);
  res.json(user);
});

router.put('/settings/:id', grantAccess('updateOwn', 'user'), validate('saveSettings'), validator, async (req: any, res: any) => {
  const id: string = req.params.id;
  const data: any = req.body;
  const ownUser: OwnUser = await userService.saveSettings(id, data);
  res.json(ownUser);
});

export default router;