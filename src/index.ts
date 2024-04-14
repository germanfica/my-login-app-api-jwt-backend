// app.ts
import express from 'express';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as BearerStrategy } from 'passport-http-bearer';
import morgan from 'morgan';
import { users } from './db';  // Asumimos que db exporta correctamente los usuarios
import { User } from './db/users';

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

// Configuración de la estrategia Bearer para Passport
passport.use(new BearerStrategy(
  (token, done) => {
    users.findByToken(token, (err, user) => {
      if (err) { return done(err); }
      if (!user) { return done(null, false); }
      return done(null, user);
    });
  }
));

const app = express();

// Middleware para parsear el cuerpo de las peticiones
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined'));

// Inicializar Passport
app.use(passport.initialize());

// Rutas
app.post('/login',
  passport.authenticate('local', { session: false }),
  (req, res) => {
    // Suponiendo que tienes una función para generar un token al usuario
    const token = users.generateToken(req.user as User);
    res.json({ token });
  }
);

app.get('/profile',
  passport.authenticate('bearer', { session: false }),
  (req, res) => {
    const user = req.user as User;
    res.json({ username: user.username, email: user.emails[0].value });
  }
);

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
