const path = require("path");
const { readFileSync } = require("fs");
const handlebars = require("handlebars");

const { config } = require('../config');
const { sendEMail, buildLogger } = require('../plugin');


const sourceHtmlPath = path.join(__dirname, "../templates/emailTemplates/confirmEmail.html");
const sourceHtml = readFileSync(sourceHtmlPath, "utf-8").toString();

const verifyEmailTemplate = handlebars.compile(sourceHtml);
const { client } = config;

const logger = buildLogger('emailService');

const sendVerificationEmail = async (email, token) => {
  try {
    const verificationUrl = `${client.url}/verify/${token}`;
    const replacements = {
      username: email,
      verifyUrl: verificationUrl,
    };
    const htmlToSend = verifyEmailTemplate(replacements);
    logger.log('Attempting to send the verification email.', {
      email: email
    });
    await sendEMail({
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
  } catch (err) {
    logger.error('Error while sending the verification email.', {
      error: err.message,
      email: email
    });
    throw new Error('Failed to send the verification email.');
  }
};

module.exports = { sendVerificationEmail };
