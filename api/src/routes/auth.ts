import express from 'express';
import { grantAccess, validate, validator } from '../middleware';
import authService from '../services/authService';
import emailVerifyRequestService from '../services/emailVerifyRequestService';
import { AuthorizedUser, EmailVerifyRequestStatus, LoginData, OwnUser } from '../types';
import { toLoginData } from '../utils';
const router = express.Router();

router.post('/login', validate('login'), validator, async (req: any, res: any) => {
  const data: any = req.body;
  const loginData: LoginData = toLoginData(data);
  const user: AuthorizedUser = await authService.login(loginData);
  res.json(user);
});

router.post('/register', validate('register'), validator, async (req: any, res: any) => {
  const data: any = req.body;
  const user: OwnUser = await authService.register(data);
  await emailVerifyRequestService.createEmailVerifyRequest(user.id, user.email, EmailVerifyRequestStatus.ACTIVATE_USER);
  res.sendStatus(200);
});

router.post('/refreshToken', async (req, res) => {
  const { refreshToken } = req.body;
  const newAccessToken: string | undefined = authService.getNewAccessToken(refreshToken);
  res.json(newAccessToken);
});

router.get('/checkToken', grantAccess('readOwn', 'accessToken'), async (_req, res) => {
  res.sendStatus(200);
});

export default router;