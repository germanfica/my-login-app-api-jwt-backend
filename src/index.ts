import express from 'express';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';

passport.use(new LocalStrategy(
  (username, password, done) => {
    console.log(`Intento de inicio de sesión con usuario: ${username}`);
    if (username === 'admin' && password === 'admin') {
      console.log('Inicio de sesión exitoso');
      done(null, { id: 1, name: 'Admin' });
    } else {
      console.log('Inicio de sesión fallido');
      done(null, false);
    }
  }
));

passport.serializeUser((user: any, done) => {
  console.log('Serializando usuario:', user);
  done(null, user);
});

passport.deserializeUser((user: any, done) => {
  console.log('Deserializando usuario:', user);
  done(null, user);
});

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

app.post('/login', (req, res, next) => {
  console.log('Solicitud de login recibida', req.body);
  passport.authenticate('local', (err: any, user: any, info: any) => {
    if (err) {
      console.log('Error en la autenticación:', err);
      return next(err);
    }
    if (!user) {
      console.log('Login fallido:', info);
      return res.status(400).send('Login fallido');
    }
    console.log('Usuario autenticado:', user);
    res.send('Autenticado con éxito');
  })(req, res, next);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
