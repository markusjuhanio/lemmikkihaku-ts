import {
  AdminViewListing,
  AdminViewUser,
  ErrorName,
  PublicUser,
  PublicListing,
  CustomError,
  UserEntry,
  ListingEntry,
  Image, OwnUser,
  OwnListing, UserSearch,
  UserSaveableSettings,
  Role,
  LoginData,
  RegisterData,
  Email,
  IEmailVerifyRequest,
  IPasswordRequest,
  ConversationEntry,
  EncryptedMessage,
  PublicConversation,
  MessageEntry,
  PublicMessage,
  INotification,
} from './types';
import bcrypt from 'bcrypt';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { Storage } from '@google-cloud/storage';
import { AVATAR_COLORS } from './config';
import { decryptMessage, encryptMessage } from './crypto';
import { logger } from './logger';

export const throwError = (name: ErrorName): CustomError => {
  const error: CustomError = { name: name };
  throw error;
};

export const toPublicListing = (object: any): PublicListing => {
  const listing: PublicListing = {
    id: object._id ? object._id.toString() : object.id,
    user: toPublicUser(object.user),
    title: object.title,
    category: object.category,
    specie: object.specie,
    gender: object.gender,
    age: object.age,
    race: object.race,
    province: object.province,
    city: object.city,
    shortDescription: object.shortDescription,
    fullDescription: object.fullDescription,
    type: object.type,
    images: object.images.map((image: any) => toImage(image)),
    date: object.date,
    price: object.price,
    registrationNumber: object.registrationNumber
  };
  return listing;
};

export const toOwnListing = (object: any): OwnListing => {
  const listing: OwnListing = {
    id: object._id ? object._id.toString() : object.id,
    user: toOwnUser(object.user),
    title: object.title,
    category: object.category,
    specie: object.specie,
    gender: object.gender,
    age: object.age,
    race: object.race,
    province: object.province,
    city: object.city,
    shortDescription: object.shortDescription,
    fullDescription: object.fullDescription,
    type: object.type,
    images: object.images.map((image: any) => toImage(image)),
    date: object.date,
    price: object.price,
    registrationNumber: object.registrationNumber,
    activated: object.activated,
    rejected: object.rejected
  };
  return listing;
};

export const toAdminViewListing = (object: any): AdminViewListing => {
  const listing: AdminViewListing = {
    id: object._id ? object._id.toString() : object.id,
    user: toAdminViewUser(object.user),
    title: object.title,
    category: object.category,
    specie: object.specie,
    gender: object.gender,
    age: object.age,
    race: object.race,
    province: object.province,
    city: object.city,
    shortDescription: object.shortDescription,
    fullDescription: object.fullDescription,
    type: object.type,
    createdAt: object.createdAt,
    activated: object.activated,
    deleted: object.deleted,
    rejected: object.rejected,
    date: object.date,
    price: object.price,
    registrationNumber: object.registrationNumber,
    images: object.images.map((image: any) => toImage(image)),
  };
  return listing;
};

export const toListingEntry = (object: any): ListingEntry => {
  const listing: ListingEntry = {
    title: object.title,
    category: object.category,
    specie: object.specie,
    gender: object.gender,
    age: object.age,
    registrationNumber: object.registrationNumber || '',
    race: object.race,
    province: object.province,
    city: object.city,
    shortDescription: object.shortDescription,
    fullDescription: object.fullDescription,
    type: object.type,
    images: object.images,
    date: object.date || new Date(),
    price: object.price || -1,
    user: object.user.id,
    activated: 0,
    rejected: 0
  };
  return listing;
};

export const toPublicUser = (object: any): PublicUser => {
  const user: PublicUser = {
    id: object._id ? object._id.toString() : object.id,
    nickname: object.nickname,
    email: object.email,
    avatarColor: object.avatarColor,
  };
  return user;
};

export const toUserSaveableSettings = (object: any): UserSaveableSettings => {
  const saveableSettings: UserSaveableSettings = {
    settings: {
      useEmails: object.settings.useEmails,
      useNotifications: object.settings.useNotifications,
    },
    nickname: object.nickname,
    avatarColor: object.avatarColor,
  };
  return saveableSettings;
};

export const toOwnUser = (object: any): OwnUser => {
  const user: OwnUser = {
    id: object._id ? object._id.toString() : object.id,
    nickname: object.nickname,
    email: object.email,
    role: object.role,
    avatarColor: object.avatarColor,
    favorites: object.favorites,
    searches: object.searches,
    settings: {
      useEmails: object.settings.useEmails,
      useNotifications: object.settings.useNotifications
    }
  };
  return user;
};

export const toUserSearch = (object: any): UserSearch => {
  const userSearch: UserSearch = {
    id: object._id ? object._id.toString() : object.id,
    userId: object.userId,
    date: new Date(),
    filters: object.filters,
  };
  return userSearch;
};

export const toImage = (object: any): Image => {
  const image: Image = {
    id: object._id ? object._id.toString() : object.id,
    name: object.name,
    url: object.url
  };
  return image;
};

export const toUserEntry = (object: any): UserEntry => {
  const user: UserEntry = {
    nickname: object.nickname.toLowerCase(),
    email: object.email.toLowerCase(),
    password: object.password,
    role: Role.User,
    avatarColor: AVATAR_COLORS[Math.floor(Math.random() * (AVATAR_COLORS.length))]
  };
  return user;
};

export const toLoginData = (object: any): LoginData => {
  const loginData: LoginData = {
    nickname: object.nickname.toLowerCase(),
    password: object.password,
  };
  return loginData;
};

export const toRegisterData = (object: any): RegisterData => {
  const registerData: RegisterData = {
    nickname: object.nickname.toLowerCase(),
    email: object.email.toLowerCase(),
    password: object.password,
  };
  return registerData;
};

export const toAdminViewUser = (object: any): AdminViewUser => {
  const user: AdminViewUser = {
    id: object._id ? object._id.toString() : object.id,
    nickname: object.nickname,
    email: object.email,
    role: object.role,
    avatarColor: object.avatarColor,
    createdAt: object.createdAt,
    activated: object.activated,
    lastLoggedIn: object.lastLoggedIn
  };
  return user;
};

export const isEmptyString = (value: string): boolean => {
  if (!value) {
    return true;
  } else if (value.length === 0) {
    return true;
  }
  return false;
};

export const hashPassword = async (password: string): Promise<string> => {
  const salt: string = await bcrypt.genSalt(12);
  const hashedPassword: string = await bcrypt.hash(password, salt);
  return hashedPassword;
};

export const uploadImages = async (images: Image[], bucketName: string): Promise<Image[]> => {
  const storage: Storage = getCloudStorage();
  const uploadedImages: Image[] = [];

  /* Create temporary folder for images */
  const folderId: string = uuidv4();
  const dir = `/tmp/${folderId}`;
  fs.mkdirSync(dir);

  for (const image of images) {

    /* If image is not base64, skip */
    if (image.url.startsWith('https://')) {
      uploadedImages.push(image);
      continue;
    }

    const imageId: string = uuidv4() + uuidv4();
    const imageName = `${imageId}.webp`;

    /* Write base64 to file */
    const base64: string = image.url.split('base64,')[1];
    const imageBuffer: Buffer = new Buffer(base64, 'base64');
    fs.writeFileSync(`${dir}/${imageName}`, imageBuffer);

    /* Upload files to google cloud storage */
    try {
      await storage.bucket(bucketName).upload(`${dir}/${imageName}`, {
        gzip: true,
        metadata: {
          cacheControl: 'public, max-age=31536000',
        },
      });
    } catch (error) {
      logger.error('Error uploading image:' + error);
    }
    const newImage: Image = { id: imageId, name: imageName, url: `https://storage.googleapis.com/${bucketName}/${imageName}` };
    uploadedImages.push(newImage);
  }

  return uploadedImages;
};

export const deleteImages = async (images: Image[], bucketName: string): Promise<void> => {
  const storage: Storage = getCloudStorage();
  for (const image of images) {
    try {
      await storage.bucket(bucketName).file(`${image.name}`).delete();
    } catch (error) {
      logger.error('Error deleting image' + error);
    }
  }
};

const getCloudStorage = (): Storage => {
  const storage: Storage = new Storage({ keyFilename: 'cloud-storage-key.json' });
  return storage;
};

export const isValidNickname = (nickname: string) => {
  const regex = /[^a-zA-Zäö\d]/i; // Allow a-z äö, 0-9 only
  const isValid = !(regex.test(nickname));

  if (isValid) {
    const regexp = /^\S*$/; // No spaces
    const valid: boolean = (regexp.test(nickname));
    if (valid) {
      return true;
    }
  }

  return false;
};

export const toEmail = (object: any): Email => {
  const email: Email = {
    to: object.to,
    subject: object.subject,
    message: object.message,
  };
  return email;
};

export const toEmailVerifyRequest = (object: any) => {
  const emailVerifyRequest: IEmailVerifyRequest = {
    id: object._id ? object._id.toString() : object.id,
    guid: object.guid,
    email: object.email,
    status: object.status,
    validTo: object.validTo,
    user: toOwnUser(object.user)
  };
  return emailVerifyRequest;
};

export const toPasswordRequest = (object: any) => {
  const passwordRequest: IPasswordRequest = {
    id: object._id ? object._id.toString() : object.id,
    guid: object.guid,
    email: object.email,
    user: toOwnUser(object.user),
    status: object.status,
    validTo: object.validTo
  };
  return passwordRequest;
};

export const toConversationEntry = (object: any): ConversationEntry => {
  const messageEntry: MessageEntry = toMessageEntry(object);
  const conversationEntry: ConversationEntry = {
    from: object.from,
    to: object.to,
    messages: [messageEntry],
    conversationId: object.conversationId ? object.conversationId : undefined
  };
  return conversationEntry;
};

export const toEncryptedMessage = (message: string): EncryptedMessage => {
  const encryptedMessage: EncryptedMessage = encryptMessage(message);
  return encryptedMessage;
};

export const toDecryptedMessage = (message: EncryptedMessage): string => {
  const msg: string = decryptMessage(message);
  return msg;
};

export const toMessageEntry = (object: any): MessageEntry => {
  const messageEntry: MessageEntry = {
    from: object.from,
    to: object.to,
    message: toEncryptedMessage(object.message),
    date: object.date || new Date(),
    image: object.image
  };
  return messageEntry;
};

export const toPublicMessage = (object: any): PublicMessage => {
  const publicMessage: PublicMessage = {
    id: object._id ? object._id.toString() : object.id,
    from: toPublicUser(object.from),
    to: toPublicUser(object.to),
    message: decryptMessage(object.message),
    deletedBy: object.deletedBy,
    date: object.date,
    image: toImage(object.image),
    conversationId: object.conversationId
  };
  return publicMessage;
};

export const toPublicConversation = (requestUserId: string, object: any): PublicConversation => {
  object.messages = object.messages.map((msg: any) => msg.conversationId = object._id.toString());
  const publicConversation: PublicConversation = {
    id: object._id ? object._id.toString() : object.id,
    from: toPublicUser(object.from),
    to: toPublicUser(object.to),
    new: object.new ? true : false,
    date: object.createdAt,
    wasDeleted: object.wasDeleted ? true : false,
    messages: object.messages
      .map((msg: any) => toPublicMessage(msg))
      .filter((msg: PublicMessage) => !msg.deletedBy.includes(requestUserId)),
    deletedBy: object.deletedBy
  };
  return publicConversation;
};

export const toNotification = (object: any): INotification => {
  const notification: INotification = {
    id: object._id ? object._id.toString() : object.id,
    type: object.type,
    user: toPublicUser(object.user),
    resource: object.resource,
    checked: object.checked,
    date: object.createdAt
  };
  return notification;
};