import express from 'express';
import { EmailVerifyRequestStatus, IEmailVerifyRequest } from '../types';
import emailVerifyRequestService from '../services/emailVerifyRequestService';
import { grantAccess } from '../middleware';
const router = express.Router();

router.get('/:guid', async (req, res) => {
  const guid: string = req.params.guid;
  const emailVerifyRequest: IEmailVerifyRequest = await emailVerifyRequestService.getEmailVerifyRequest(guid);
  res.json(emailVerifyRequest);
});

router.put('/activateUser/:guid', async (req, res) => {
  const guid: string = req.params.guid;
  const emailVerifyRequest: IEmailVerifyRequest = await emailVerifyRequestService.activateUser(guid);
  res.json(emailVerifyRequest);
});

router.put('/verifyNewEmail/:guid', async (req, res) => {
  const guid: string = req.params.guid;
  const emailVerifyRequest: IEmailVerifyRequest = await emailVerifyRequestService.changeEmail(guid);
  res.json(emailVerifyRequest);
});

router.post('/', grantAccess('updateOwn', 'email'), async (req: any, res) => {
  const email: string = req.body.email;
  const userId: string = req.userId;
  await emailVerifyRequestService.createEmailVerifyRequest(userId, email, EmailVerifyRequestStatus.CHANGE_EMAIL);
  res.sendStatus(200);
});

export default router;
