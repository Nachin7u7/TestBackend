// --------------- Passport Config ---------------
const express = require('express');
const passport = require('passport');
const session = require('express-session');
const LocalStrategy = require('passport-local').Strategy;
const config = require('./config');
const User = require('../models/user.model');

const env = config.env;
const passportConfig = config.passport;

// Function to configure authentication session options
const configureSessionOptions = (app) => {
  const sessionOptions = {
    secret: passportConfig.sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 30, // Cookie expiry time = 1 month (in milliseconds)
    },
  };

  if (env == 'production') {
    sessionOptions.cookie.sameSite = 'none';
    sessionOptions.cookie.secure = true;
    sessionOptions.cookie.domain = 'netlify.app';
  }

  return sessionOptions;
};

// Function to configure Passport
const configurePassport = (app) => {
  // Configure authentication session options
  const sessionOptions = configureSessionOptions(app);
  app.use(session(sessionOptions));
  
  // Initialize Passport
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(express.static("./"));

  // Configure LocalStrategy
  passport.use(
    new LocalStrategy(function verify(username, password, cb) {
      User.findOne({ $or: [{ username: username }, { email: username }] }, function (err, user) {
        if (err) {
          return cb(err);
        }
        if (!user) {
          return cb(null, false, { message: "Incorrect username." });
        }
        //TODO: Implement comparing hash passwords
        // if (user.password !== password) {
        //   return cb(null, false, { message: "Incorrect password."});
        // }
        return cb(null, user);
      });
    })
  );

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
