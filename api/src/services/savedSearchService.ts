import { UserSearch } from '../types';
import SavedSearch from '../models/savedSearch';
import { toUserSearch } from '../utils';

const createSearch = async (data: any): Promise<UserSearch> => {
  const saveableSearch: UserSearch = toUserSearch(data);
  const newSearch = new SavedSearch(saveableSearch);
  const savedSearch = await newSearch.save();
  return toUserSearch(savedSearch);
};

const getOwnSearches = async (userId: string): Promise<UserSearch[]> => {
  const searches = await SavedSearch.find({ userId: userId }).sort({ date: -1 });
  return searches.map((search) => toUserSearch(search));
};

const deleteOwnSearch = async (id: string): Promise<UserSearch> => {
  const deleted = await SavedSearch.findByIdAndDelete(id);
  return toUserSearch(deleted);
};

export default { createSearch, getOwnSearches, deleteOwnSearch };