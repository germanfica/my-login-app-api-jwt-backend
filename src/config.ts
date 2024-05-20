// config.ts
import dotenv from 'dotenv';

// Carga las variables de entorno desde el archivo .env
dotenv.config();

const jwtSecret = process.env.JWT_SECRET;
const dbHost = process.env.DB_HOST;
const dbPort = process.env.DB_PORT ? parseInt(process.env.DB_PORT) : undefined;
const dbUsername = process.env.DB_USERNAME;
const dbPassword = process.env.DB_PASSWORD;
const dbName = process.env.DB_NAME;

if (!jwtSecret) throw new Error('JWT_SECRET is not defined in the environment variables');
if (!dbHost) throw new Error('DB_HOST is not defined in the environment variables');
if (!dbPort) throw new Error('DB_PORT is not defined in the environment variables');
if (!dbUsername) throw new Error('DB_USERNAME is not defined in the environment variables');
if (!dbPassword) throw new Error('DB_PASSWORD is not defined in the environment variables');
if (!dbName) throw new Error('DB_NAME is not defined in the environment variables');

export default {
    jwtSecret,
    dbHost,
    dbPort,
    dbUsername,
    dbPassword,
    dbName,
};
