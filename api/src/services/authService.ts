import { AuthorizedUser, ErrorName, LoginData, OwnUser, RegisterData, UserEntry } from '../types';
import User from '../models/user';
import bcrypt from 'bcrypt';
import { hashPassword, throwError, toUserEntry, toOwnUser, toRegisterData } from '../utils';
import { ACCESS_TOKEN_EXPIRE_TIME, ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from '../config';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { logger } from '../logger';

const login = async (loginData: LoginData): Promise<AuthorizedUser> => {

  const nickname: string = loginData.nickname;
  const password: string = loginData.password;

  const foundUser = await User.findOne({ $or: [{ 'nickname': nickname }, { 'email': nickname }] });

  if (!foundUser) {
    logger.warn('User not found, can not login.');
    throwError(ErrorName.WrongCredentialsError);
  }

  const isValidPassword: boolean = await bcrypt.compare(password, foundUser.password);

  if (!isValidPassword) {
    logger.warn('User password is invalid, can not login.');
    throwError(ErrorName.WrongCredentialsError);
  }

  if (foundUser.activated === 0) {
    logger.warn('User is not activated, can not login.');
    throwError(ErrorName.UserNotActivatedError);
  }

  const accessToken: string = await foundUser.createAccessToken();
  const refreshToken: string = await foundUser.createRefreshToken();

  const user: OwnUser = toOwnUser(foundUser);

  return {
    user,
    accessToken,
    refreshToken
  };
};

const register = async (data: any): Promise<OwnUser> => {

  const registerData: RegisterData = toRegisterData(data);

  const nickname: string = registerData.nickname;
  const email: string = registerData.email;
  const password: string = registerData.password;

  const userWithSameNickname = await User.findOne({ nickname: nickname });
  if (userWithSameNickname) {
    logger.warn('User with same nickname found, can not register.');
    throwError(ErrorName.NicknameInUseError);
  }

  const userWithSameEmail = await User.findOne({ email: email });
  if (userWithSameEmail) {
    logger.warn('User with same email found, can not register.');
    throwError(ErrorName.EmailInUseError);
  }

  const hashedPassword = await hashPassword(password);
  registerData.password = hashedPassword;

  const userEntry: UserEntry = toUserEntry(registerData);

  const newUser = new User(userEntry);
  const savedUser = await newUser.save();
  return toOwnUser(savedUser);
};

const getNewAccessToken = (oldToken: string): string | undefined => {
  const secret = REFRESH_TOKEN_SECRET;

  try {
    const payload = jwt.verify(oldToken, secret) as JwtPayload;
    const newToken: string = jwt.sign(
      { user: payload.user },
      ACCESS_TOKEN_SECRET,
      {
        expiresIn: ACCESS_TOKEN_EXPIRE_TIME + 's',
      }
    );
    return newToken;
  } catch (error) {
    throwError(ErrorName.SessionExpiredError);
    return;
  }
};

export default { login, register, getNewAccessToken };