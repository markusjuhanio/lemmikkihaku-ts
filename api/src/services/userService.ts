import { AdminViewUser, ErrorName, OwnListing, OwnUser, PublicListing, UserSaveableSettings, UserSettings } from '../types';
import User from '../models/user';
import { isValidNickname, throwError, toAdminViewUser, toOwnListing, toOwnUser, toPublicListing, toUserSaveableSettings } from '../utils';
import { ObjectId } from 'mongoose';
import Listing from '../models/listing';
import { AVATAR_COLORS } from '../config';
import SavedSearch from '../models/savedSearch';
import EmailVerifyRequest from '../models/emailVerifyRequest';
import PasswordRequest from '../models/passwordRequest';
import Conversation from '../models/conversation';
import listingService from './listingService';
import Notification from '../models/notification';

const getUsers = async (): Promise<AdminViewUser[]> => {
  const users = await User.find({}).sort({ createdAt: -1 });
  return users.map((user) => toAdminViewUser(user));
};

const getUser = async (id: string): Promise<AdminViewUser> => {
  const user = await User.findById(id);
  return toAdminViewUser(user);
};

const activateUser = async (id: string): Promise<AdminViewUser> => {
  const user = await User.findByIdAndUpdate(id, { activated: 1 }, { new: true });
  return toAdminViewUser(user);
};

const deactivateUser = async (id: string): Promise<AdminViewUser> => {
  const user = await User.findByIdAndUpdate(id, { activated: 0 }, { new: true });
  return toAdminViewUser(user);
};

const deleteUser = async (id: string): Promise<OwnUser> => {
  const userToDelete = await User.findById(id);
  const user: OwnUser = toOwnUser(userToDelete);

  const listings = await Listing.find({ user: user.id });
  if (listings && listings.length > 0) {
    listings.forEach(async (listing) => {
      await listingService.softDeleteListing(listing);
    });
  }

  await EmailVerifyRequest.deleteMany({ user: user.id });
  await PasswordRequest.deleteMany({ user: user.id });
  await SavedSearch.deleteMany({ userId: user.id });
  await Notification.deleteMany({ user: user.id });

  //Soft delete conversations where user participated
  const conversations = await Conversation.find({ $or: [{ 'from': user.id }, { 'to': user.id }] });
  if (conversations && conversations.length > 0) {
    conversations.forEach(async (conversation) => {
      const receiver: string = conversation.from.toString() === id ? conversation.to.toString() : conversation.from.toString();
      const sender: string = conversation.from.toString() === id ? conversation.from.toString() : conversation.to.toString();
      const deletedBy: string[] = [receiver, sender];
      await conversation.update({ $push: { deletedBy: deletedBy } });
    });
  }

  await userToDelete.delete();
  return user;
};

const addFavoriteListing = async (id: string, listingId: string): Promise<OwnUser> => {
  const user = await User.findById(id);

  const favoritesAsObjectIds: ObjectId[] = user.favorites;
  let favorites: string[] = favoritesAsObjectIds.map(favorite => favorite.toString());

  if (!favorites.includes(listingId)) {
    favorites.push(listingId);
  } else {
    favorites = favorites.filter(favorite => favorite !== listingId);
  }

  user.favorites = favorites;
  await user.save();
  const updatedUser = await User.findById(id);
  return toOwnUser(updatedUser);
};

const getFavoriteListings = async (userId: string): Promise<PublicListing[]> => {
  const user: OwnUser = await User.findById(userId).populate('favorites');
  const listings: PublicListing[] = [];

  if (user.favorites) {
    for (const favorite of user.favorites) {
      const listing = await Listing.findById(favorite.id).populate('user');
      listings.push(toPublicListing(listing));
    }
  }

  return listings;
};

const getOwnListings = async (userId: string): Promise<OwnListing[]> => {
  const listings = await Listing.find({ deleted: 0, user: userId }).sort({ date: -1 }).populate('user');
  return listings.map((listing) => toOwnListing(listing));
};

const saveSettings = async (id: string, data: any): Promise<OwnUser> => {
  const saveableSettings: UserSaveableSettings = toUserSaveableSettings(data);
  const user = await User.findById(id);

  const userWithNickname = await User.findOne({ nickname: saveableSettings.nickname });
  if (userWithNickname && saveableSettings.nickname !== user.nickname) {
    throwError(ErrorName.NicknameInUseError);
  } else {
    if (isValidNickname(saveableSettings.nickname)) {
      user.nickname = saveableSettings.nickname.toLowerCase();
    }
  }

  if (!AVATAR_COLORS.includes(saveableSettings.avatarColor)) {
    throwError(ErrorName.AvatarColorError);
  } else {
    user.avatarColor = saveableSettings.avatarColor;
  }

  user.settings = { useEmails: saveableSettings.settings.useEmails, useNotifications: saveableSettings.settings.useNotifications };

  await user.save();
  const updatedUser = await User.findById(id);
  return toOwnUser(updatedUser);
};

export const getUserSettings = async (id: string): Promise<UserSettings> => {
  const user = await User.findById(id);
  return {
    useEmails: user.settings.useEmails,
    useNotifications: user.settings.useNotifications
  };
};


export default { deleteUser, getUsers, getUserSettings, getUser, activateUser, deactivateUser, addFavoriteListing, getFavoriteListings, getOwnListings, saveSettings };