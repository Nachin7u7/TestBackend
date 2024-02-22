// --------------- Passport Config ---------------
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { encrypt } = require('../utils');

const userRepository = require('../repositories/userRepository');

// Function to configure Passport
const configurePassport = (app) => {

  // Initialize Passport
  app.use(passport.initialize());

  // Configure LocalStrategy
  passport.use(
    new LocalStrategy(async function verify(username, password, done) {
      const user = await userRepository.findUserByUsernameOrEmail(
        username,
        username
      );

      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }

      if (!encrypt.comparePasswords(password, user.password)) {
        return done(null, false, { message: 'Incorrect data.' });
      }

      return done(null, user);
    })
  );

};

module.exports = configurePassport;
