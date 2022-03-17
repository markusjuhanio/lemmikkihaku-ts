import express from 'express';
import { MAILER_ADDRESS } from '../config';
import { sendEmail } from '../mailer';
import { Email } from '../types';
import { toEmail } from '../utils';
const router = express.Router();

router.post('/', async (req, res) => {
  const data: any = req.body;
  data.to = MAILER_ADDRESS;
  
  const email: Email = toEmail(data);

  await sendEmail(email);
  res.sendStatus(200);
});

export default router;