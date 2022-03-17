import crypto from 'crypto';
import { MESSAGES_SECRET } from './config';
import { EncryptedMessage } from './types';

const algorithm = 'aes-256-ctr';
const secretKey: string = MESSAGES_SECRET;
const iv = crypto.randomBytes(16);

export const encryptMessage = (text: string): EncryptedMessage => {
  const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
  const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
  const encryptedMessage: EncryptedMessage = {
    iv: iv.toString('hex'),
    content: encrypted.toString('hex')
  };
  return encryptedMessage;
};

export const decryptMessage = (hash: EncryptedMessage): string => {
  const decipher = crypto.createDecipheriv(algorithm, secretKey, Buffer.from(hash.iv, 'hex'));
  const decrypted = Buffer.concat([decipher.update(Buffer.from(hash.content, 'hex')), decipher.final()]);
  return decrypted.toString();
};