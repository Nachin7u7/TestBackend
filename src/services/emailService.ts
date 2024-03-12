import path from "path";
import { readFileSync } from "fs";
import handlebars from "handlebars";
import { config } from '../config';
import { sendEmail, buildLogger } from '../plugin';

const sourceHtmlPath: string = path.join(__dirname, "../templates/emailTemplates/confirmEmail.html");
const sourceHtml: string = readFileSync(sourceHtmlPath, "utf-8").toString();

const verifyEmailTemplate = handlebars.compile(sourceHtml);
const { client } = config;

const logger = buildLogger('emailService');

const sendVerificationEmail = async (email: string, token: string): Promise<void> => {
  try {
    const verificationUrl: string = `${client.url}/verify/${token}`;
    const replacements = {
      username: email,
      verifyUrl: verificationUrl,
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

export { sendVerificationEmail };
