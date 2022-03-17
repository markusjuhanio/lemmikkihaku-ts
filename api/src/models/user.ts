import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import {
  ACCESS_TOKEN_EXPIRE_TIME,
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_EXPIRE_TIME,
  REFRESH_TOKEN_SECRET
} from '../config';
import { logger } from '../logger';

const userSchema = new mongoose.Schema({
  nickname: {
    type: String,
  },
  email: {
    type: String,
  },
  role: {
    type: String,
    default: 'user',
  },
  avatarColor: String,
  password: String,
  favorites: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Listing',
    }
  ],
  settings: {
    useEmails: {
      type: Boolean,
      default: true
    },
    useNotifications: {
      type: Boolean,
      default: true
    },
  },
  activated: {
    type: Number,
    default: 0
  },
}, { timestamps: true });

//Index all for text search
userSchema.index({ '$**': 'text' });

//Define schema level methods to create access token and refresh token:
userSchema.methods = {
  createAccessToken: async function () {
    try {
      const { _id, nickname, email, role } = this;
      const accessToken = jwt.sign(
        { user: { _id, nickname, email, role } },
        ACCESS_TOKEN_SECRET,
        {
          expiresIn: ACCESS_TOKEN_EXPIRE_TIME + 'd',
        }
      );
      return accessToken;
    } catch (error) {
      logger.error(`Error creating access token: ${error}`);
      return;
    }
  },
  createRefreshToken: async function () {
    try {
      const { _id, nickname, email, role } = this;
      const refreshToken = jwt.sign(
        { user: { _id, nickname, email, role } },
        REFRESH_TOKEN_SECRET,
        {
          expiresIn: REFRESH_TOKEN_EXPIRE_TIME + 'd',
        }
      );
      return refreshToken;
    } catch (error) {
      logger.error(`Error creating refresh token: ${error}`);
      return;
    }
  },
};

userSchema.set('toJSON', {
  transform: (_document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject.password;
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

export default mongoose.model('User', userSchema);