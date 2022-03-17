import { CHAT_IMAGES_BUCKET, MAX_SAVED_MESSAGES_IN_CONVERSATION } from '../config';
import Conversation from '../models/conversation';
import { sendPrivateMessage } from '../socket';
import { ConversationEntry, PublicConversation, Image, SocketAction, PublicMessage, NotificationType } from '../types';
import { isEmptyString, toConversationEntry, toPublicConversation, uploadImages } from '../utils';
import { sendNotification } from './notificationService';

const createMessage = async (data: any): Promise<PublicMessage> => {
  const conversationEntry: ConversationEntry = toConversationEntry(data);
  const requestUserId: string = data.userId;

  // If base64 image file, upload it and replace it in conversationEntry message
  if (conversationEntry.messages[0].image) {
    const uploadedImages: Image[] = await uploadImages([conversationEntry.messages[0].image], CHAT_IMAGES_BUCKET);
    conversationEntry.messages[0].image = uploadedImages[0];
  }

  //Find conversationId
  let conversationId = '';
  if (conversationEntry.conversationId) {
    conversationId = conversationEntry.conversationId;
  } else {
    const from_to = await Conversation.findOne({ from: conversationEntry.from, to: conversationEntry.to });
    const to_from = await Conversation.findOne({ from: conversationEntry.to, to: conversationEntry.from });
    if (from_to) {
      conversationId = from_to._id;
    } else if (to_from) {
      conversationId = to_from._id;
    }
  }

  //If conversationId, conversation was already created
  if (!isEmptyString(conversationId)) {
    const conversation = await Conversation.findByIdAndUpdate(conversationId,
      {
        $pull: { 'deletedBy': { $in: [conversationEntry.from, conversationEntry.to] } },
        $push: { messages: conversationEntry.messages[0] }
      }, { new: true })
      .populate('from')
      .populate('to')
      .populate({
        path: 'messages',
        populate: {
          path: 'from',
          model: 'User',
        }
      })
      .populate({
        path: 'messages',
        populate: {
          path: 'to',
          model: 'User',
        }
      });

    const publicConversation: PublicConversation = toPublicConversation(requestUserId, conversation);
    const message: PublicMessage = publicConversation.messages[publicConversation.messages.length - 1];

    sendPrivateMessage(message.from.id, SocketAction.NEW_MESSAGE, message);
    sendPrivateMessage(message.to.id, SocketAction.NEW_MESSAGE, message);

    await sendNotification(message.to.id, NotificationType.NEW_MESSAGE, message);

    // If messages length exceedes max limit, remove latest one
    if (publicConversation.messages.length > MAX_SAVED_MESSAGES_IN_CONVERSATION) {
      const c = await Conversation.findById(publicConversation.id);
      c.messages.shift();
      await c.save();
    }

    return message;
  } else {
    // Conversation was not already created, create new one
    const newConversation = new Conversation(conversationEntry);
    const savedConversation = await newConversation.save();
    const populatedConversation = await Conversation.findById(savedConversation._id)
      .populate('from')
      .populate('to')
      .populate({
        path: 'messages',
        populate: {
          path: 'from',
          model: 'User',
        }
      })
      .populate({
        path: 'messages',
        populate: {
          path: 'to',
          model: 'User',
        }
      });

    const publicConversation: PublicConversation = toPublicConversation(requestUserId, populatedConversation);
    const message: PublicMessage = publicConversation.messages[publicConversation.messages.length - 1];

    sendPrivateMessage(publicConversation.to.id, SocketAction.NEW_CONVERSATION, publicConversation);
    sendPrivateMessage(publicConversation.from.id, SocketAction.NEW_CONVERSATION, publicConversation);
    await sendNotification(publicConversation.to.id, NotificationType.NEW_MESSAGE, message);
    return message;
  }
};

const getOwnConversations = async (userId: string): Promise<PublicConversation[]> => {
  const conversations = await Conversation
    .where('deletedBy').nin([userId])
    .find({ $or: [{ from: userId }, { to: userId }] })
    .sort({ createdAt: -1 })
    .populate('from')
    .populate('to')
    .populate({
      path: 'messages',
      populate: {
        path: 'from',
        model: 'User',
      }
    })
    .populate({
      path: 'messages',
      populate: {
        path: 'to',
        model: 'User',
      }
    });

  return conversations.map((conversation) => toPublicConversation(userId, conversation));
};

const softDeleteMessage = async (data: { messageId: string, conversationId: string, userId: string }): Promise<void> => {
  const conversation = await Conversation.findOne({ _id: data.conversationId });
  if (conversation.from.toString() === data.userId || conversation.to.toString() === data.userId) {
    const message = conversation.messages.find((msg: any) => msg._id.toString() === data.messageId);
    message.deletedBy.push(data.userId.toString());
    conversation.messages = conversation.messages.filter((m: any) => m._id === message._id ? message : m);
    await conversation.save();
  }
};

const softDeleteConversation = async (data: { conversationId: string, userId: string }): Promise<void> => {
  const conversation = await Conversation.findById(data.conversationId);
  if (conversation.from.toString() === data.userId || conversation.to.toString() === data.userId) {
    await conversation.update({ $push: { deletedBy: data.userId } });
  }
};

export default {
  createMessage,
  getOwnConversations,
  softDeleteMessage,
  softDeleteConversation
};