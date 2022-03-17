import { Role, UserEntry } from '../types';
import { toUserEntry } from '../utils';

/* DUMMY DATA FOR TESTS */

const data: UserEntry[] = [
  {
    nickname: 'admin 1',
    email: 'admin@lemmikkihaku.localhost',
    role: Role.Admin,
    avatarColor: '#FFFFFF',
    password: 'admin123',
    activated: 1
  },
  {
    nickname: 'user 1',
    email: 'user1@lemmikkihaku.localhost',
    role: Role.User,
    avatarColor: '#000000',
    password: 'user123',
    activated: 1
  },
  {
    nickname: 'user 2',
    email: 'user2@lemmikkihaku.localhost',
    role: Role.User,
    avatarColor: '#000000',
    password: 'user123',
    activated: 0
  },
];

const userEntries: UserEntry[] = data.map(object => {
  const user: UserEntry = toUserEntry(object);
  return user;
});

export default userEntries;