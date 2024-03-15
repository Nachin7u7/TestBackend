import { config } from '../config'; // Asegúrate de que config esté exportado adecuadamente como módulo ES6
import nodemailer from 'nodemailer';
import { SentMessageInfo } from 'nodemailer';

let sendEmail: (mailOptions: any) => Promise<any>;

const { email } = config;

if (email.serviceProvider === 'nodemailer') {
  const transporter = nodemailer.createTransport({
    service: email.service,
    auth: {
      user: email.user,
      pass: email.pass,
    },
  });

  sendEmail = async (mailOptions: any): Promise<any> => {
    try {
      const info: SentMessageInfo = await transporter.sendMail(mailOptions);
      return { success: true, message: info };
    } catch (error) {
      console.error('Failed to send email:', error);
      throw error;
    }
  };
} else {
  sendEmail = async (mailOptions: any): Promise<any> => {
    throw new Error('Email service provider not implemented.');
  };
}

export default sendEmail;
