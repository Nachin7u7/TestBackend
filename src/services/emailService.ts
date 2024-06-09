import path from "path";
import { readFileSync } from "fs";
import handlebars from "handlebars";
import { config } from '../config';
import { sendEmail, buildLogger } from '../plugin';

class EmailService {
  private sourceHtmlPath: string;
  private sourceForgotHtmlPath: string;
  private sourceHtml: string;
  private sourceForgotHtml: string;
  private verifyEmailTemplate: HandlebarsTemplateDelegate;
  private forgotPasswordTemplate: HandlebarsTemplateDelegate;
  private client: any;
  private logger: any;

  constructor() {
    this.sourceHtmlPath = path.join(__dirname, "../templates/emailTemplates/confirmEmail.html");
    this.sourceForgotHtmlPath = path.join(__dirname, "../templates/emailTemplates/forgotPasswordEmail.html");
    this.sourceHtml = readFileSync(this.sourceHtmlPath, "utf-8").toString();
    this.sourceForgotHtml = readFileSync(this.sourceForgotHtmlPath, "utf-8").toString();
    this.verifyEmailTemplate = handlebars.compile(this.sourceHtml);
    this.forgotPasswordTemplate = handlebars.compile(this.sourceForgotHtml);
    this.client = config.client;
    this.logger = buildLogger('emailService');
  }

async sendVerificationEmail(email: string, token: string): Promise<void>  {
  try {
    const verificationUrl: string = this.client.url;
    const replacements = {
      username: email,
      verifyUrl: verificationUrl,
      token: token,
    };
    const htmlToSend: string = this.verifyEmailTemplate(replacements);
    this.logger.log('Attempting to send the verification email.', {
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
    this.logger.log('Successfully sent the verification email.', {
      email: email
    });
  } catch (err: any) {
    this.logger.error('Error while sending the verification email.', {
      error: err.message,
      email: email
    });
    throw new Error('Failed to send the verification email.');
  }
};

async sendForgotPassword (email: string, token: string): Promise<void> {
  try {
    this.logger.log('Attempting to send the forgot password email.', {
      email: email
    });
    const replacements = {
      username: email,
      resetUrl: `${this.client.url}/reset-password/${token}`,
    };
    const htmlToSend: string = this.forgotPasswordTemplate(replacements);
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
    this.logger.log('Successfully sent the forgot password email.', {
      email: email
    });
  } catch (err: any) {
    this.logger.error('Error while sending the forgot password email.', {
      error: err.message,
      email: email
    });
    throw new Error('Failed to send the forgot password email.');
  }
}
}
export default EmailService;
