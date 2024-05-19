// auth.ts
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { users } from './db';  // Asegúrate de que 'db' exporta correctamente los usuarios

const jwtSecret = 'your_jwt_secret'; // Asegúrate de mantener tu secreto seguro y privado

// Configuración de la estrategia Local para Passport
passport.use(new LocalStrategy(
  (username, password, done) => {
    users.findByUsername(username, async (err, user) => {
      if (err) { return done(err); }
      if (!user) { return done(null, false, { message: 'Incorrect username.' }); }
      const passwordMatch = await users.verifyPassword(user, password);
      if (!passwordMatch) { return done(null, false, { message: 'Incorrect password.' }); }
      return done(null, user);
    });
  }
));

// Configuración de la estrategia JWT para Passport
const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: jwtSecret,
};

passport.use(new JwtStrategy(opts, (jwtPayload: any, done: any) => {
  users.findByUsername(jwtPayload.username, (err, user) => {
    if (err) { return done(err, false); }
    if (user) {
      return done(null, user);
    } else {
      return done(null, false);
    }
  });
}));

export const initializePassport = () => passport.initialize();

export const authenticateLocal = passport.authenticate('local', { session: false });
export const authenticateJwt = passport.authenticate('jwt', { session: false });
