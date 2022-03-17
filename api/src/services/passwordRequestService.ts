import PasswordRequest from '../models/passwordRequest';
import User from '../models/user';
import { ErrorName, IPasswordRequest, PasswordRequestStatus, PasswordRequestEntry, OwnUser } from '../types';
import { hashPassword, throwError, toOwnUser, toPasswordRequest } from '../utils';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '../logger';
import moment from 'moment';
import { APP_URL } from '../config';
import { sendEmail } from '../mailer';

const getPasswordRequest = async (guid: string): Promise<IPasswordRequest> => {
  const passwordRequest = await PasswordRequest.findOne({ guid: guid }).populate('user');

  if (!passwordRequest) {
    logger.warn('PasswordRequest not found');
    throwError(ErrorName.PasswordRequestNotFoundError);
  } else if (passwordRequest.status === PasswordRequestStatus.DONE) {
    logger.warn(`PasswordRequest is already verified status: ${passwordRequest.status}`);
    throwError(ErrorName.PasswordRequestStatusError);
  } else if (moment(passwordRequest.validTo).isBefore(new Date())) {
    logger.warn('PasswordRequest is too old');
    throwError(ErrorName.PasswordRequestNotValidError);
  }

  return toPasswordRequest(passwordRequest);
};

const createPasswordRequest = async (email: string, type: PasswordRequestStatus): Promise<IPasswordRequest> => {

  const userFoundWithEmail = await User.findOne({ email: email });

  if (!userFoundWithEmail) {
    logger.warn('User not found with given email, can not send password request.');
    throwError(ErrorName.UsetNotFoundError);
  }

  const user: OwnUser = toOwnUser(userFoundWithEmail);

  const passwordRequestEntry: PasswordRequestEntry = {
    validTo: moment(new Date()).add(3, 'hours').toDate(),
    status: type,
    user: user.id,
    guid: uuidv4(),
    email: email
  };

  //Delete previous requests with same email and status
  await PasswordRequest.deleteMany({ email: passwordRequestEntry.email, status: passwordRequestEntry.status });

  const newPasswordRequest = new PasswordRequest(passwordRequestEntry);
  const saved = await newPasswordRequest.save();

  const populated = await PasswordRequest.findById(saved._id).populate('user');

  await sendEmail({
    to: populated.email,
    subject: 'Vaihda salasana',
    message: `Pyysit salasanan vaihtolinkkiä Lemmikkihaku -tunnuksellesi. Klikkaa alla olevaa linkkiä vaihtaaksesi salasanasi.\n\n${APP_URL}/vaihda-salasana/${populated.guid}`
  });

  return toPasswordRequest(populated);
};

const setPassword = async (guid: string, newPassword: string): Promise<IPasswordRequest> => {
  const updatedPasswordRequest = await PasswordRequest.findOneAndUpdate(
    { guid: guid },
    { status: PasswordRequestStatus.DONE },
    { new: true })
    .populate('user');

  const passwordRequest: IPasswordRequest = toPasswordRequest(updatedPasswordRequest);

  if (passwordRequest) {
    const password = await hashPassword(newPassword);
    await User.findByIdAndUpdate(passwordRequest.user.id, { password: password });
  }

  await PasswordRequest.findByIdAndDelete(passwordRequest.id);
  return toPasswordRequest(passwordRequest);
};

export default {
  getPasswordRequest,
  createPasswordRequest,
  setPassword
};