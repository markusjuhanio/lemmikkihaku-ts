import { NotificationEntry, INotification, NotificationType, NotificationResource, SocketAction } from '../types';
import Notification from '../models/notification';
import { toNotification } from '../utils';
import { MAX_SAVED_NOTIFICATIONS } from '../config';
import { sendPrivateMessage } from '../socket';
import userService from './userService';

const getOwnNotifications = async (userId: string): Promise<INotification[]> => {
  const notifications = await Notification.find({ user: userId }).sort({ createdAt: -1 }).limit(MAX_SAVED_NOTIFICATIONS).populate('user');
  return notifications.map(notification => toNotification(notification));
};

const createNotification = async (data: NotificationEntry): Promise<INotification> => {

  // If notifications count are bigger than MAX_SAVED_NOTIFICATIONS, remove oldest
  const count = await Notification.count({ user: data.user });
  if (count > MAX_SAVED_NOTIFICATIONS) {
    await Notification.findOneAndDelete({ user: data.user }).sort({ createdAt: 1 });
  }

  const newNotification = new Notification(data);
  const savedNotification = await newNotification.save();
  const populatedNotification = await Notification.findById(savedNotification._id).populate('user');
  return toNotification(populatedNotification);
};

const checkNotification = async (id: string): Promise<INotification> => {
  const updatedNotification = await Notification.findByIdAndUpdate(id, { checked: true }, { new: true }).populate('user');
  return toNotification(updatedNotification);
};

const deleteNotification = async (id: string): Promise<void> => {
  await Notification.findByIdAndDelete(id).populate('user');
};

export const sendNotification = async (userId: string, type: NotificationType, resource: NotificationResource): Promise<void> => {
  const userSettings = await userService.getUserSettings(userId);
  if (userSettings.useNotifications) {
    const notification: NotificationEntry = {
      type: type,
      resource: resource,
      user: userId
    };
    const createdNotification = await createNotification(notification);
    sendPrivateMessage(userId, SocketAction.NOTIFICATION, createdNotification);
  }
};

export default { getOwnNotifications, createNotification, checkNotification, deleteNotification };