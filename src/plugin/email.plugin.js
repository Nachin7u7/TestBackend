const { config } = require('../config');

const { email } = config;

let sendEmail;

if (email.serviceProvider === 'nodemailer') {
  const nodemailer = require('nodemailer');
  const transporter = nodemailer.createTransport({
    service: email.service,
    auth: {
      user: email.user,
      pass: email.pass,
    },
  });

  sendEmail = async (mailOptions) => {
    try {
      const info = await transporter.sendMail(mailOptions);
      return { success: true, message: info };
    } catch (error) {
      console.error('Failed to send email:', error);
      throw error;
    }
  };
} else {
  sendEmail = async (mailOptions) => {
    throw new Error('Email service provider not implemented.');
  };
}

module.exports = sendEmail;
