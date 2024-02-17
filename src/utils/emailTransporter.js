const nodemailer = require('nodemailer');
const { email } = require('../config/config');

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: email.emailUser,
    pass: email.emailPass,
  },
});

module.exports = transporter;
