import express from 'express';
import { grantAccess, validate, validator } from '../middleware';
import conversationService from '../services/conversationService';
import { PublicConversation, PublicMessage } from '../types';
const router = express.Router();

router.post('/', grantAccess('createAny', 'conversation'), validate('createConversation'), validator, async (req: any, res: any) => {
  const data: any = req.body;
  data.from = req.userId;
  
  const message: PublicMessage = await conversationService.createMessage(data);
  res.json(message);
});

router.post('/deleteMessage', grantAccess('deleteOwn', 'message'), async (req: any, res) => {
  const data: any = req.body;
  data.userId = req.userId;
  await conversationService.softDeleteMessage(data);
  res.sendStatus(200);
});

router.post('/deleteConversation', grantAccess('deleteOwn', 'conversation'), async (req: any, res) => {
  const data: any = req.body;
  data.userId = req.userId;
  await conversationService.softDeleteConversation(data);
  res.sendStatus(200);
});

router.get('/', grantAccess('readOwn', 'conversation'), async (req: any, res) => {
  const userId: string = req.userId;
  const conversations: PublicConversation[] = await conversationService.getOwnConversations(userId);
  res.json(conversations);
});

export default router;