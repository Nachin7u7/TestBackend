require("dotenv").config();

let CLIENT_URL = "";
let SERVER_URL = "";

const env = {
  port: process.env.SERVER_PORT || 5555,
  mode: process.env.NODE_ENV || "development",
  CLIENT_URL: process.env.CLIENT_URL,
  SERVER_URL: process.env.SERVER_URL,
};

const email = {
  emailUser: process.env.EMAIL_USER,
  emailPass: process.env.EMAIL_PASS,
};

const mongoDB = {
  mongoUri: process.env.DBHOST,
};

const joodle = {
  clientId: process.env.JDOODLE_CLIENT_ID,
  clientSecret: process.env.JDOODLE_CLIENT_SECRET,
};

const passport = {
  sessionSecret: process.env.SESSION_SECRET,
  tokenSecret: process.env.TOKEN_SECRET,
};

if (env == "production") {
  // Set deployed site's client and server url here
  CLIENT_URL = env.CLIENT_URL;
  SERVER_URL = env.SERVER_URL;
} else {
  CLIENT_URL = "http://localhost:3000";
  SERVER_URL = "http://localhost:5555";
}

module.exports = {
  CLIENT_URL,
  SERVER_URL,
  email,
  mongoDB,
  joodle,
  passport,
  env,
};
