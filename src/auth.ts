// auth.ts
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { findByUsername, verifyPassword } from './db/users';

const jwtSecret = 'your_jwt_secret'; // Asegúrate de mantener tu secreto seguro y privado

// Configuración de la estrategia Local para Passport
passport.use(new LocalStrategy(
  async (username, password, done) => {
    try {
      const user = await findByUsername(username);
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      const passwordMatch = await verifyPassword(user, password);
      if (!passwordMatch) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
));

// Configuración de la estrategia JWT para Passport
const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: jwtSecret,
};

passport.use(new JwtStrategy(opts, async (jwtPayload, done) => {
  try {
    const user = await findByUsername(jwtPayload.username);
    if (user) {
      return done(null, user);
    } else {
      return done(null, false);
    }
  } catch (err) {
    return done(err, false);
  }
}));

export const initializePassport = () => passport.initialize();

export const authenticateLocal = passport.authenticate('local', { session: false });
export const authenticateJwt = passport.authenticate('jwt', { session: false });
