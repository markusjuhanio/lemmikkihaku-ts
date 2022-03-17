import express from 'express';
import { grantAccess } from '../middleware';
import notificationService from '../services/notificationService';
const router = express.Router();

router.get('/', grantAccess('readOwn', 'notification'), async (req: any, res) => {
  const userId: string = req.userId;
  const notifications = await notificationService.getOwnNotifications(userId);
  res.json(notifications);
});

router.put('/:id', grantAccess('updateOwn', 'notification'), async (req: any, res) => {
  const id: string = req.params.id;
  const notification = await notificationService.checkNotification(id);
  res.json(notification);
});

router.delete('/:id', grantAccess('updateOwn', 'notification'), async (req: any, res) => {
  const id: string = req.params.id;
  await notificationService.deleteNotification(id);
  res.sendStatus(200);
});

export default router;