import { AccessControl } from 'ts-access-control';
import { Role } from './types';
const ac = new AccessControl();

export default (() => {
  ac.grant(Role.User)

    .updateOwn('listing')
    .createAny('listing')
    .deleteOwn('listing')

    .readOwn('notification')
    .updateOwn('notification')
    .deleteOwn('notification')
    .updateOwn('notification')

    .createOwn('search')
    .readOwn('search')
    .updateOwn('search')
    .deleteOwn('search')

    .readOwn('message')
    .updateOwn('message')
    .deleteOwn('message')

    .deleteOwn('conversation')
    .createAny('conversation')
    .readOwn('conversation')

    .readOwn('accessToken')

    .updateOwn('email')

    .updateOwn('user')
    .deleteOwn('user')
    .readOwn('user');

  ac.grant(Role.Admin)
    .extend('user')

    .updateAny('user')
    .updateAny('listing')
    .updateAny('notification')

    .deleteAny('listing')
    .deleteAny('user')
    .deleteAny('notification')
    .deleteAny('conversation')
    .deleteAny('message')

    .readAny('listing')
    .readAny('user')
    .readAny('notification')
    .readAny('conversation')
    .readAny('message')

    .createAny('notification');

  return ac;
})();