// index.ts
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { initializePassport, authenticateLocal, authenticateJwt } from './auth';
import { validationResult } from 'express-validator';
import config from './config';
//import { initializeDatabase } from './models';
import db from './models';
import routes from './routes';

const app = express();

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
db.initializeDatabase().then(() => {
  console.log('Database initialized');
}).catch(error => {
  console.error('Database initialization failed:', error);
});

// Middleware de manejo de errores de validación
const handleValidationErrors = (req: any, res: any, next: any) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Rutas
app.use(routes);

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
