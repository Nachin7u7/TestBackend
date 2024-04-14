import path from "path";
import { readFileSync } from "fs";
import handlebars from "handlebars";
import { config } from '../config';
import { sendEmail, buildLogger } from '../plugin';

const sourceHtmlPath: string = path.join(__dirname, "../templates/emailTemplates/confirmEmail.html");
const sourceForgotHtmlPath: string = path.join(__dirname, "../templates/emailTemplates/forgotPasswordEmail.html");
const sourceHtml: string = readFileSync(sourceHtmlPath, "utf-8").toString();
const sourceForgotHtml: string = readFileSync(sourceForgotHtmlPath, "utf-8").toString();

const verifyEmailTemplate = handlebars.compile(sourceHtml);
const forgotPasswordTemplate = handlebars.compile(sourceForgotHtml);
const { client } = config;

const logger = buildLogger('emailService');

const sendVerificationEmail = async (email: string, token: string): Promise<void> => {
  try {
    const verificationUrl: string = client.url;
    const replacements = {
      username: email,
      verifyUrl: verificationUrl,
      token: token,
    };
    const htmlToSend: string = verifyEmailTemplate(replacements);
    logger.log('Attempting to send the verification email.', {
      email: email
    });
    await sendEmail({
      to: email,
      subject: 'Por favor, confirma tu dirección de correo electrónico.',
      attachments: [
        {
          filename: "logo192.png",
          path: path.join(__dirname, "../templates/emailTemplates/logo192.png"),
          cid: "logo",
        },
      ],
      html: htmlToSend,
    });
    logger.log('Successfully sent the verification email.', {
      email: email
    });
  } catch (err: any) {
    logger.error('Error while sending the verification email.', {
      error: err.message,
      email: email
    });
    throw new Error('Failed to send the verification email.');
  }
};

const sendForgotPassword = async (email: string, token: string): Promise<void> => {
  try {
    logger.log('Attempting to send the forgot password email.', {
      email: email
    });
    const replacements = {
      username: email,
      resetUrl: `${client.url}/#/reset-password/${token}`,
    };
    const htmlToSend: string = forgotPasswordTemplate(replacements);
    await sendEmail({
      to: email,
      subject: 'Restablecer contraseña',
      attachments: [
        {
          filename: "logo192.png",
          path: path.join(__dirname, "../templates/emailTemplates/logo192.png"),
          cid: "logo",
        },
      ],
      html: htmlToSend,
    });
    logger.log('Successfully sent the forgot password email.', {
      email: email
    });
  } catch (err: any) {
    logger.error('Error while sending the forgot password email.', {
      error: err.message,
      email: email
    });
    throw new Error('Failed to send the forgot password email.');
  }
}

export { sendVerificationEmail, sendForgotPassword };
