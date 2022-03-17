import mongoose from 'mongoose';
import supertest, { SuperTest, Test } from 'supertest';
import app from '../app';
import userEntries from '../data/users';
import { AuthorizedUser, Role, UserEntry } from '../types';
import test_helper from './test_helper';

const api: SuperTest<Test> = supertest(app);

let authorizedUser: AuthorizedUser;

beforeEach(async () => {
  await test_helper.initUsers();
  authorizedUser = await test_helper.getAuthorizedUser(Role.User, api);
});

test('users can login', async () => {
  const user: UserEntry | undefined = userEntries.find(user => user.activated === 1 && user.role === 'user');
  if (user) {
    const data: { nickname: string, password: string } = {
      nickname: user.nickname,
      password: user.password
    };
    await api
      .post('/api/auth/login')
      .send(data)
      .expect(200)
      .expect('Content-Type', /application\/json/);
  } else {
    throw new Error('UserEntry to test not found');
  }
});

test('not activated users can not login', async () => {
  const user: UserEntry | undefined = userEntries.find(user => user.activated === 0);
  if (user) {
    const data: { nickname: string, password: string } = {
      nickname: user.nickname,
      password: user.password
    };
    await api
      .post('/api/auth/login')
      .send(data)
      .expect(409);
  } else {
    throw new Error('UserEntry to test not found');
  }
});

test('user can view own user', async () => {
  const userId: string = authorizedUser.user.id;
  await api
    .get(`/api/users/${userId}`)
    .set('Authorization', 'Bearer ' + authorizedUser.accessToken)
    .expect(200)
    .expect('Content-Type', /application\/json/);
});

test('user can not view other users', async () => {
  const users = await test_helper.getUsersInDb();
  const otherUser: UserEntry | undefined = users.find(user => user.id !== authorizedUser.user.id);
  if (otherUser) {
    await api
      .get(`/api/users/${otherUser.id}`)
      .set('Authorization', 'Bearer ' + authorizedUser.accessToken)
      .expect(403);
  } else {
    throw new Error('UserEntry to test not found');
  }
});

afterAll(async () => {
  await mongoose.connection.close();
});