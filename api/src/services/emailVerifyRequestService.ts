import EmailVerifyRequest from '../models/emailVerifyRequest';
import User from '../models/user';
import { IEmailVerifyRequest, EmailVerifyRequestStatus, EmailVerifyRequestEntry, ErrorName, OwnUser } from '../types';
import { throwError, toEmailVerifyRequest } from '../utils';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '../logger';
import moment from 'moment';
import { sendEmail } from '../mailer';
import { APP_URL } from '../config';

const getEmailVerifyRequest = async (guid: string): Promise<IEmailVerifyRequest> => {
  const emailVerifyRequest = await EmailVerifyRequest.findOne({ guid: guid }).populate('user');

  if (!emailVerifyRequest) {
    logger.warn('EmailVerifyRequest not found');
    throwError(ErrorName.EmailVerifyRequestNotFoundError);
  } else if (emailVerifyRequest.status === EmailVerifyRequestStatus.DONE) {
    logger.warn(`EmailVerifyRequest is already verified status: ${emailVerifyRequest.status}`);
    throwError(ErrorName.EmailVerifyRequestStatusError);
  } else if (moment(emailVerifyRequest.validTo).isBefore(new Date())) {
    logger.warn('EmailVerifyRequest is too old');
    throwError(ErrorName.EmailVerifyRequestNotValidError);
  }

  return toEmailVerifyRequest(emailVerifyRequest);
};

const createEmailVerifyRequest = async (userId: string, email: string, type: EmailVerifyRequestStatus): Promise<IEmailVerifyRequest> => {

  const emailVerifyRequestEntry: EmailVerifyRequestEntry = {
    user: userId,
    validTo: moment(new Date()).add(7, 'days').toDate(),
    status: type,
    guid: uuidv4(),
    email: email
  };

  // If request type is CHANGE_EMAIL, check for existings users for that email
  if (type === EmailVerifyRequestStatus.CHANGE_EMAIL) {
    const user: OwnUser = await User.findOne({ email: emailVerifyRequestEntry.email });
    if (user) {
      throwError(ErrorName.EmailInUseError);
    }
  }

  //Delete previous requests with same email and status
  await EmailVerifyRequest.deleteMany({ email: emailVerifyRequestEntry.email, status: emailVerifyRequestEntry.status });

  //Save and populate
  const newEmailVerifyRequest = new EmailVerifyRequest(emailVerifyRequestEntry);
  const saved = await newEmailVerifyRequest.save();
  const populated = await EmailVerifyRequest.findById(saved._id).populate('user');

  const emailVerifyRequest: IEmailVerifyRequest = toEmailVerifyRequest(populated);

  if (type === EmailVerifyRequestStatus.ACTIVATE_USER) {
    await sendEmail({
      to: emailVerifyRequest.email,
      subject: 'Kiitos rekisteröitymisestä Lemmikkihakuun!',
      message: `Kiitos rekisteröitymisestä Lemmikkihakuun. Aktivoi käyttäjätunnuksesi vahvistamalla sähköpostiosoitteesi alla olevasta linkistä:\n\n${APP_URL}/vahvista-sahkoposti/${emailVerifyRequest.guid}`
    });
  } else {
    await sendEmail({
      to: emailVerifyRequest.email,
      subject: 'Vaihda sähköpostiosoite',
      message: `Pyysit sähköpostin vaihtolinkkiä Lemmikkihaku -tunnuksellesi. Klikkaa alla olevaa linkkiä vaihtaaksesi sähköpostiosoitteesi.\n\n${APP_URL}/vahvista-sahkoposti/${emailVerifyRequest.guid}`
    });
  }

  return emailVerifyRequest;
};

const activateUser = async (guid: string): Promise<IEmailVerifyRequest> => {
  const updatedEmailVerifyRequest = await EmailVerifyRequest.findOneAndUpdate(
    { guid: guid },
    { status: EmailVerifyRequestStatus.DONE },
    { new: true })
    .populate('user');

  const emailVerifyRequest: IEmailVerifyRequest = toEmailVerifyRequest(updatedEmailVerifyRequest);

  if (emailVerifyRequest) {
    await User.findByIdAndUpdate(emailVerifyRequest.user.id, { activated: 1 });
  }
  await EmailVerifyRequest.findByIdAndDelete(emailVerifyRequest.id);
  return toEmailVerifyRequest(emailVerifyRequest);
};

const changeEmail = async (guid: string): Promise<IEmailVerifyRequest> => {
  const updatedEmailVerifyRequest = await EmailVerifyRequest.findOneAndUpdate(
    { guid: guid },
    { status: EmailVerifyRequestStatus.DONE },
    { new: true })
    .populate('user');

  const emailVerifyRequest: IEmailVerifyRequest = toEmailVerifyRequest(updatedEmailVerifyRequest);

  if (emailVerifyRequest) {
    const emailAlreadyInUse = await User.findOne({ email: emailVerifyRequest.user.id });
    if (emailAlreadyInUse) {
      throwError(ErrorName.EmailInUseError);
    } else {
      await User.findByIdAndUpdate(emailVerifyRequest.user.id, { email: emailVerifyRequest.email });
    }
  }

  await EmailVerifyRequest.findByIdAndDelete(emailVerifyRequest.id);

  return toEmailVerifyRequest(emailVerifyRequest);
};

export default {
  getEmailVerifyRequest,
  createEmailVerifyRequest,
  activateUser,
  changeEmail
};