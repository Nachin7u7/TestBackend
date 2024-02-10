// --------------- Passport Config ---------------
const passport = require("passport");
const session = require("express-session");
const LocalStrategy = require("passport-local").Strategy;
const { env: envConfig, passport: passportConfig } = require("./config");
const User = require("../models/user.model");
const env = envConfig.mode;

// Function to configure authentication session options
const configureSessionOptions = () => {
  const sessionOptions = {
    secret: passportConfig.sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 30, // Cookie expiry time = 1 month (in milliseconds)
    },
  };

  if (env == "production") {
    sessionOptions.cookie.sameSite = "none";
    sessionOptions.cookie.secure = true;
    sessionOptions.cookie.domain = "netlify.app";
  }

  return sessionOptions;
};

// Function to configure Passport
const configurePassport = (app) => {
  // Configure authentication session options
  const sessionOptions = configureSessionOptions();
  app.use(session(sessionOptions));

  // Configure LocalStrategy
  passport.use(
    new LocalStrategy(
      // {
      //   usernameField: "username",
      //   passwordField: "password",
      // },
      User.authenticate()
      // (username, password, done) => {
      //   User.authenticate(username, password)
      //     .then((user) => {
      //       return done(/* no error */ null, user);
      //     })
      //     .catch(done);
      // }
    )
  );

  // Initialize Passport
  app.use(passport.initialize());
  app.use(passport.session());

  // Serialize and deserialize user
  passport.serializeUser((user, done) => {
    const sessionUser = {
      _id: user._id,
      username: user.username,
      email: user.email,
      userType: user.userType,
    };
    done(null, sessionUser);
  });
  passport.deserializeUser((sessionUser, done) => {
    done(null, sessionUser);
  });
};

module.exports = configurePassport;
