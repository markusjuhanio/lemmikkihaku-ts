import express from 'express';
import { IPasswordRequest, PasswordRequestStatus } from '../types';
import passwordRequestService from '../services/passwordRequestService';
const router = express.Router();

router.get('/:guid', async (req, res) => {
  const guid: string = req.params.guid;
  const passwordRequest: IPasswordRequest = await passwordRequestService.getPasswordRequest(guid);
  res.json(passwordRequest);
});

router.put('/setPassword/:guid', async (req, res) => {
  const guid: string = req.params.guid;
  const newPassword: string = req.body.password;
  const passwordRequest: IPasswordRequest = await passwordRequestService.setPassword(guid, newPassword);
  res.json(passwordRequest);
});

router.post('/', async (req: any, res) => {
  const email: string = req.body.email;
  await passwordRequestService.createPasswordRequest(email, PasswordRequestStatus.CHANGE_PASSWORD);
  res.sendStatus(200);
});

export default router;
