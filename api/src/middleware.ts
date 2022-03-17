import { ERROR_DEFINITIONS } from './errorDefinitions';
import { logger } from './logger';
import { ACCESS_TOKEN_SECRET } from './config';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { NextFunction } from 'express';
import { AuthorizedRequest, ErrorDefinition, ErrorName, Role, UserSearch } from './types';
import { Request, Response } from 'express';
import ac from './ac';
import { isEmptyString, throwError } from './utils';
import { body, Result, ValidationError, validationResult } from 'express-validator';
import Listing from './models/listing';
import SavedSearch from './models/savedSearch';
import Notification from './models/notification';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler = (error: any, _req: Request, res: Response, _next: NextFunction): any => {
  const name: string = error.name ? error.name : '';
  if (!isEmptyString(name)) {
    ERROR_DEFINITIONS.forEach((description: ErrorDefinition) => {
      if (description.name === name) {
        if (description.stackTrace) {
          logger.error(`Error stack: ${error.stack}`);
        } else {
          logger.error(`Error: ${error.name}`);
        }
        if (description.json) {
          return res.status(description.statusCode).json(description.json);
        } else {
          return res.status(description.statusCode).end();
        }
      }
    });
  } else {
    logger.error(`Uncaught exception: ${error}`);
    return res.sendStatus(400);
  }
};

export const unknownEndpoint = () => {
  throwError(ErrorName.UnknownEndpointError);
};

export const extractToken = (req: AuthorizedRequest, _res: Response, next: NextFunction): void => {
  try {
    const token: string | undefined = req.get('authorization')?.split(' ')[1];
    const secret: string | undefined = ACCESS_TOKEN_SECRET;
    if (token && secret) {
      const payload = jwt.verify(token, secret) as JwtPayload;
      req.userId = payload.user._id;
      req.userRole = payload.user.role;
    }
  } catch (error) {
    next(error);
  }
};

export const grantAccess = (action: string, resource: string): any => {

  const checkPermission = async (req: AuthorizedRequest, res: Response, next: NextFunction): Promise<boolean> => {
    extractToken(req, res, next);

    const role = req.userRole as Role;
    const userId: string = req.userId;
    const resourceId: string = req.params.id;

    //Allow all actions to every resource for admins
    if (role === Role.Admin) {
      return true;
    }

    //Check access by userId and resourceId, where resourceId being for example listing id
    switch (action) {
    case 'createOwn':
      return ac.can(role)[action](resource).granted;
    case 'readOwn':
      switch (resource) {
      case 'accessToken':
        return ac.can(role)[action](resource).granted;
      case 'conversation':
        return ac.can(role)[action](resource).granted;
      case 'notification':
        return ac.can(role)[action](resource).granted;
      case 'user':
        if (userId == resourceId) {
          return ac.can(role)[action](resource).granted;
        }
        break;
      case 'listing':
        return ac.can(role)[action](resource).granted;
      case 'search':
        return ac.can(role)[action](resource).granted;
      }
      return false;
    case 'updateOwn':
      switch (resource) {
      case 'email':
        return ac.can(role)[action](resource).granted;
      case 'user':
        if (userId == resourceId) {
          return ac.can(role)[action](resource).granted;
        }
        break;
      case 'listing': {
        const listing = await Listing.findById(resourceId);
        const listingUserId: string = listing.user.toString();
        if (listingUserId === userId) {
          return ac.can(role)[action](resource).granted;
        }
      }
        break;
      case 'notification': {
        const notification = await Notification.findById(resourceId);
        const notificationUserId: string = notification.user.toString();
        if (notificationUserId === userId) {
          return ac.can(role)[action](resource).granted;
        }
      }
        break;
      case 'search': {
        const userSearch: UserSearch = await SavedSearch.findById(resourceId);
        if (userId === userSearch.userId) {
          return ac.can(role)[action](resource).granted;
        }
      }
        break;
      }
      return false;
    case 'deleteOwn':
      switch (resource) {
      case 'user': {
        if (userId === resourceId) {
          return ac.can(role)[action](resource).granted;
        }
        break;
      }
      case 'message': {
        return ac.can(role)[action](resource).granted;
      }
      case 'conversation': {
        return ac.can(role)[action](resource).granted;
      }
      case 'search': {
        const search = await SavedSearch.findById(resourceId);
        const searchUserId: string = search.userId;
        if (searchUserId === userId) {
          return ac.can(role)[action](resource).granted;
        }
      }
        break;
      }
      return false;
    case 'createAny':
      return ac.can(role)[action](resource).granted;
    case 'readAny':
      return ac.can(role)[action](resource).granted;
    case 'updateAny':
      return ac.can(role)[action](resource).granted;
    case 'deleteAny':
      return ac.can(role)[action](resource).granted;
    default:
      return false;
    }
  };

  return async (req: AuthorizedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const permission: boolean = await checkPermission(req, res, next);
      if (!permission) {
        throwError(ErrorName.PermissionDeniedError);
      }
      next();
    } catch(error) {
      next(error);
    }
  };
};

export const validator = (req: Request, _res: Response, next: NextFunction) => {
  const errors: Result<ValidationError> = validationResult(req);
  if (!errors.isEmpty()) {
    logger.warn(`Validation failed for the following parameters: ${JSON.stringify(errors)}`);
    throwError(ErrorName.ValidationError);
  } else {
    next();
  }
};

export const validate = (method: string) => {
  switch (method) {
  case 'login':
    return [
      body('nickname', 'Invalid nickname').exists().isString().isLength({ min: 1, max: 50 }).trim(), // can be nickname or email but read as nickname
      body('password', 'Invalid password').exists().isString().isLength({ min: 8, max: 100 }).trim()
    ];
  case 'register':
    return [
      body('nickname', 'Invalid nickname').exists().isString().isLength({ min: 4, max: 15 }).trim(),
      body('email', 'Invalid email').exists().isEmail().isLength({ min: 1, max: 100 }).trim(),
      body('password', 'Invalid password').exists().isString().isLength({ min: 8, max: 100 }).trim()
    ];
  case 'saveSettings':
    return [
      body('nickname', 'Invalid nickname').exists().isString().isLength({ min: 4, max: 15 }).trim(),
      body('avatarColor', 'Invalid avatarColor').exists().isString().isLength({ min: 1, max: 50 }).trim(),
      body('settings.useEmails', 'Invalid useEmails').exists().isBoolean().trim(),
      body('settings.useNotifications', 'Invalid useNotifications').exists().isBoolean().trim(),
    ];
  case 'createListing':
    return [
      body('title', 'Invalid title').exists().isString().isLength({ min: 1, max: 40 }).trim(),
      body('category', 'Invalid category').exists().isString().isLength({ min: 1, max: 50 }).trim(),
      body('specie', 'Invalid specie').exists().isString().isLength({ min: 1, max: 50 }).trim(),
      body('gender', 'Invalid gender').exists().isString().isLength({ min: 1, max: 50 }).trim(),
      body('age', 'Invalid age').exists().isString().isLength({ min: 1, max: 50 }).trim(),
      body('race', 'Invalid race').exists().isString().isLength({ min: 1, max: 50 }).trim(),
      body('registrationNumber', 'Invalid registrationNumber').optional().isString().isLength({ min: 0, max: 50 }).trim(),
      body('province', 'Invalid province').exists().isString().isLength({ min: 1, max: 50 }).trim(),
      body('city', 'Invalid city').exists().isString().isLength({ min: 1, max: 50 }).trim(),
      body('shortDescription', 'Invalid shortDescription').exists().isString().isLength({ min: 1, max: 200 }).trim(),
      body('fullDescription', 'Invalid fullDescription').exists().isString().isLength({ min: 1, max: 2500 }).trim(),
      body('user.id', 'Invalid userId').exists().isString().isLength({ min: 1, max: 50 }).trim(),
      body('price', 'Invalid price').exists().isNumeric().isLength({ min: 1, max: 5 }).trim(),
      body('images', 'Invalid images array').exists().isArray(),
    ];
  case 'updateListing':
    return [
      body('title', 'Invalid title').exists().isString().isLength({ min: 1, max: 40 }).trim(),
      body('category', 'Invalid category').exists().isString().isLength({ min: 1, max: 50 }).trim(),
      body('specie', 'Invalid specie').exists().isString().isLength({ min: 1, max: 50 }).trim(),
      body('gender', 'Invalid gender').exists().isString().isLength({ min: 1, max: 50 }).trim(),
      body('age', 'Invalid age').exists().isString().isLength({ min: 1, max: 50 }).trim(),
      body('race', 'Invalid race').exists().isString().isLength({ min: 1, max: 50 }).trim(),
      body('registrationNumber', 'Invalid registrationNumber').optional().isString().isLength({ min: 0, max: 50 }).trim(),
      body('province', 'Invalid province').exists().isString().isLength({ min: 1, max: 50 }).trim(),
      body('city', 'Invalid city').exists().isString().isLength({ min: 1, max: 50 }).trim(),
      body('shortDescription', 'Invalid shortDescription').exists().isString().isLength({ min: 1, max: 200 }).trim(),
      body('fullDescription', 'Invalid fullDescription').exists().isString().isLength({ min: 1, max: 2500 }).trim(),
      body('user.id', 'Invalid userId').exists().isString().isLength({ min: 1, max: 50 }).trim(),
      body('price', 'Invalid price').exists().isNumeric().isLength({ min: 1, max: 5 }).trim(),
      body('images', 'Invalid images array').exists().isArray(),
    ];
  case 'createConversation':
    return [
      body('to', 'Invalid user id(to)').exists().isString().isLength({ min: 1, max: 50 }).trim(),
      body('messages', 'Invalid messages array').optional().isArray(),
      body('messages[0].image', 'Invalid image').optional().isString(),
    ];
  case 'createSearch':
    return [
      body('filters', 'Invalid filters array').exists().isArray(),
    ];
  default:
    return [];
  }
};