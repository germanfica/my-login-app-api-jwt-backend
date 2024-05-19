// app.ts
import express from 'express';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as BearerStrategy } from 'passport-http-bearer';
import morgan from 'morgan';
import cors from 'cors';
import { users } from './db';  // Asumimos que db exporta correctamente los usuarios
import { User } from './db/users';

// cors with whitelist
// var whitelist = ['http://localhost:4200']
// var corsOptions = {
//   origin: function (origin: any, callback: any) {
//     if (whitelist.indexOf(origin) !== -1) {
//       callback(null, true)
//     } else {
//       callback(new Error('Not allowed by CORS'))
//     }
//   }
// }

// simple cors
var corsOptions = {
  origin: 'http://localhost:4200',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

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

// Habilitar CORS
app.use(cors(corsOptions));  // Esto permitirá solicitudes desde cualquier origen. Puedes personalizarlo según tus necesidades.

// Inicializar Passport
app.use(passport.initialize());

// Rutas
app.post('/login',
  passport.authenticate('local', { session: false }),
  (req, res) => {
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

app.post('/signup', async (req, res) => {
  try {
    const { username, password, displayName, email } = req.body;
    const newUser = await users.createUser(username, password, displayName, email);
    res.status(201).json({
      id: newUser.id,
      username: newUser.username,
      displayName: newUser.displayName,
      email: newUser.emails[0].value,
      token: newUser.token
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/logout',
  passport.authenticate('bearer', { session: false }),
  (req, res) => {
    const user = req.user as User;
    res.status(200).send({ message: 'Logout successful' });

    const success = users.invalidateToken(user.token);
    if (success) {
      res.status(200).send({ message: 'Logout successful' });
    } else {
      res.status(400).send({ message: 'Logout failed' });
    }
  }
);

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
