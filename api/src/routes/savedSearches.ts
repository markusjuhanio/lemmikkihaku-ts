import express from 'express';
import { grantAccess, validate, validator } from '../middleware';
import savedSearchService from '../services/savedSearchService';
import { UserSearch } from '../types';
const router = express.Router();

router.post('/', grantAccess('createOwn', 'search'), validate('createSearch'), validator, async (req: any, res: any) => {
  const data: any = req.body;
  const userId: string = req.userId;
  data.userId = userId;
  const search: UserSearch = await savedSearchService.createSearch(data);
  res.json(search);
});

router.get('/', grantAccess('readOwn', 'search'), async (req: any, res) => {
  const userId: string = req.userId;
  const searches: UserSearch[] = await savedSearchService.getOwnSearches(userId);
  res.json(searches);
});

router.delete('/:id', grantAccess('deleteOwn', 'search'), async (req, res) => {
  const id: string = req.params.id;
  const search: UserSearch = await savedSearchService.deleteOwnSearch(id);
  res.json(search);
});

export default router;