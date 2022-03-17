import nodemailer from 'nodemailer';
import { MAILER_ADDRESS, MAILER_NAME, MAILER_PASSWORD, MAILER_SMTP } from './config';
import { Email } from './types';
import { logger } from './logger';
import userService from './services/userService';

const config = `smtps://${MAILER_ADDRESS}:${MAILER_PASSWORD}@${MAILER_SMTP}/`;

const transporter = nodemailer.createTransport(config);

export const sendEmail = async (email: Email): Promise<void> => {

  if (email.userId) {
    const userSettings = await userService.getUserSettings(email.userId);
    if (userSettings.useEmails === false) {
      return;
    }
  }

  const data = {
    from: {
      name: MAILER_NAME,
      address: MAILER_ADDRESS,
    },
    to: email.to,
    subject: email.subject,
    text: `${email.message}\n\nTerveisin,\nLemmikkihaku\n\nWWW: https://www.lemmikkihaku.fi\nInstagram: https://www.instagram.com/lemmikkihaku\nFacebook: https://www.facebook.com/lemmikkihaku`
  };

  transporter.sendMail(data, function (error, info) {
    if (error) {
      logger.error(`Error sending email: ${error}`);
    } else {
      logger.info(`Email sent to ${email.to}: ${info.response}`);
    }
  });
};

module.exports = { sendEmail };