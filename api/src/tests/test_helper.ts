import userEntries from '../data/users';
import User from '../models/user';
import { AuthorizedUser, Role, UserEntry } from '../types';
import { hashPassword, toUserEntry } from '../utils';
import { SuperTest, Test } from 'supertest';

const getUsersInDb = async (): Promise<UserEntry[]> => {
  const users = await User.find({});
  return users.map(user => toUserEntry(user));
};

const initUsers = async (): Promise<void> => {
  await User.deleteMany({});
  for (const user of userEntries) {
    const newUser = new User(user);
    newUser.password = await hashPassword(newUser.password);
    await newUser.save();
  }
};

const getAuthorizedUser = async (role: Role, api: SuperTest<Test>): Promise<AuthorizedUser> => {
  const user: UserEntry | undefined = userEntries.find(user => user.activated === 1 && user.role === role);
  const data: any = {
    nickname: user?.nickname,
    password: user?.password
  };
  const response = await api
    .post('/api/auth/login')
    .send(data);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return { user: response.body.user, accessToken: response.body.accessToken, refreshToken: response.body.refreshToken } as AuthorizedUser;
};

export default { getUsersInDb, initUsers, getAuthorizedUser };