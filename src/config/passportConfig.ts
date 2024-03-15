import { Application } from 'express';
import passport from 'passport';
import { IVerifyOptions, Strategy as LocalStrategy } from 'passport-local';
import { utils } from '../utils';
import { repositories } from '../repositories';

const { findUserByUsernameOrEmail } = repositories;
const { comparePasswords } = utils;

const configurePassport = (app: Application): void => {
  app.use(passport.initialize());

  passport.use(
    new LocalStrategy(
      async (
        username: string,
        password: string,
        done: (
          error: any,
          user?: Express.User | false,
          options?: IVerifyOptions
        ) => void
      ) => {
        const user = await findUserByUsernameOrEmail(username, username);

        if (!user) {
          return done(null, false, { message: 'Incorrect username.' });
        }

        if (!comparePasswords(password, user.password)) {
          return done(null, false, { message: 'Incorrect data.' });
        }

        return done(null, user);
      }
    )
  );
};

export default configurePassport;
