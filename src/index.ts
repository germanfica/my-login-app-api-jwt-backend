// index.ts
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import { initializePassport, authenticateLocal, authenticateJwt } from './auth';
import { initializeDatabase, createUser, findByUsername, verifyPassword } from './db/users';
import { User } from './db/users';

const app = express();
const jwtSecret = 'your_jwt_secret'; // Asegúrate de mantener tu secreto seguro y privado

// Middleware para parsear el cuerpo de las peticiones
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined'));

// Habilitar CORS
app.use(cors({
  origin: 'http://localhost:4200',
  optionsSuccessStatus: 200
}));

// Inicializar Passport
app.use(initializePassport());

// Inicializar base de datos
initializeDatabase().then(() => {
  console.log('Database initialized');
}).catch(error => {
  console.error('Database initialization failed:', error);
});

// Rutas
app.post('/login', authenticateLocal, (req, res) => {
  const user = req.user as User;
  const token = jwt.sign({ username: user.username }, jwtSecret);
  res.json({ token });
});

app.get('/profile', authenticateJwt, (req, res) => {
  const user = req.user as User;
  res.json({ username: user.username, email: user.emails[0].value });
});

app.post('/signup', async (req, res) => {
  try {
    const { username, password, displayName, email } = req.body;
    const newUser = await createUser(username, password, displayName, email);
    res.status(201).json({
      id: newUser.id,
      username: newUser.username,
      displayName: newUser.displayName,
      email: newUser.emails[0].value,
      token: jwt.sign({ username: newUser.username }, jwtSecret)
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/logout', authenticateJwt, (req, res) => {
  res.status(200).send({ message: 'Logout successful' });
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
