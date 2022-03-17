import express from 'express';
import { grantAccess, validate, validator } from '../middleware';
import listingService from '../services/listingService';
import { AdminViewListing, PaginatedPublicListings, PublicListing, SearchProps } from '../types';
const router = express.Router();

router.get('/activated', async (_req, res) => {
  const listings: PublicListing[] = await listingService.getActivatedListings();
  res.json(listings);
});

router.get('/activated/:id', async (req, res) => {
  const id: string = req.params.id;
  const listing: PublicListing = await listingService.getActivatedListing(id);
  res.json(listing);
});

router.put('/activate/:id', grantAccess('updateAny', 'listing'), async (req, res) => {
  const id: string = req.params.id;
  const listing: PublicListing = await listingService.activateListing(id);
  res.json(listing);
});

router.put('/reject/:id', grantAccess('updateAny', 'listing'), async (req, res) => {
  const id: string = req.params.id;
  const listing: PublicListing = await listingService.rejectListing(id);
  res.json(listing);
});

router.put('/restore/:id', grantAccess('updateAny', 'listing'), async (req, res) => {
  const id: string = req.params.id;
  const listing: PublicListing = await listingService.restoreListing(id);
  res.json(listing);
});

router.put('/renew/:id', grantAccess('updateOwn', 'listing'), async (req, res) => {
  const id: string = req.params.id;
  const listing: PublicListing = await listingService.renewListing(id);
  res.json(listing);
});

router.delete('/soft/:id', grantAccess('updateOwn', 'listing'), async (req, res) => {
  const id: string = req.params.id;
  const listing: PublicListing = await listingService.softDeleteListing(id);
  res.json(listing);
});

router.delete('/hard/:id', grantAccess('deleteAny', 'listing'), async (req, res) => {
  const id: string = req.params.id;
  const listing: PublicListing = await listingService.hardDeleteListing(id);
  res.json(listing);
});

router.get('/', grantAccess('readAny', 'listing'), async (_req, res) => {
  const listings: AdminViewListing[] = await listingService.getListings();
  res.json(listings);
});

router.get('/:id', grantAccess('readAny', 'listing'), async (req, res) => {
  const id: string = req.params.id;
  const listing: AdminViewListing = await listingService.getListing(id);
  res.json(listing);
});

router.post('/', grantAccess('createAny', 'listing'), validate('createListing'), validator, async (req: any, res: any) => {
  const data: any = req.body;
  const listing: PublicListing = await listingService.createListing(data);
  res.json(listing);
});

router.put('/:id', grantAccess('updateOwn', 'listing'), validate('updateListing'), validator, async (req: any, res: any) => {
  const id: string = req.params.id;
  const data: any = req.body;
  const listing: PublicListing = await listingService.updateListing(id, data);
  res.json(listing);
});

router.post('/search', async (req, res) => {
  const props: SearchProps = req.body;
  const listing: PaginatedPublicListings = await listingService.searchListings(props);
  res.json(listing);
});

export default router;