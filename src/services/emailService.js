const path = require("path");
const { readFileSync } = require("fs");
const handlebars = require("handlebars");

const { config } = require('../config');
const { sendEMail } = require('../plugin');

const sourceHtmlPath = path.join(__dirname, "../templates/emailTemplates/confirmEmail.html");
const sourceHtml = readFileSync(sourceHtmlPath, "utf-8").toString();

const verifyEmailTemplate = handlebars.compile(sourceHtml);
const { client } = config;

const sendVerificationEmail = async (email, token) => {
  const verificationUrl = `${client.url}/verify/${token}`;
  const replacements = {
    username: email,
    verifyUrl: verificationUrl,
  };
  const htmlToSend = verifyEmailTemplate(replacements);

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
};

module.exports = { sendVerificationEmail };
