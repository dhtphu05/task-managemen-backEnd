import passport from 'passport';
import { Strategy as GoogleStrategy, type Profile } from 'passport-google-oauth20';
import { env } from './env.js';
import { userModel } from '../models/userModel.js';
import type { User } from '../types/User.js';

const findOrCreateUserFromProfile = async (profile: Profile): Promise<User> => {
  const primaryEmail = profile.emails?.[0]?.value;

  if (!primaryEmail) {
    throw new Error('Google account does not provide an email address');
  }

  const existingUser = await userModel.findByEmail(primaryEmail);
  if (existingUser) {
    return existingUser;
  }

  const displayName =
    profile.displayName ??
    [profile.name?.givenName, profile.name?.familyName].filter(Boolean).join(' ') ??
    'Google User';

  return userModel.create({
    name: displayName || 'Google User',
    email: primaryEmail,
  });
};

passport.use(
  new GoogleStrategy(
    {
      clientID: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      callbackURL: env.GOOGLE_REDIRECT_URI,
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const user = await findOrCreateUserFromProfile(profile);
        done(null, user);
      } catch (error) {
        done(error as Error);
      }
    }
  )
);

export { passport };
