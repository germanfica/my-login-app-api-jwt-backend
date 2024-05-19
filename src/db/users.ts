// db/users.ts
import bcrypt from 'bcrypt';
import { DataTypes, Model } from 'sequelize';
import sequelize from './database';

export interface User {
  id: number;
  username: string;
  password: string;
  displayName: string;
  emails: { value: string }[];
}

class UserModel extends Model { }

UserModel.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  displayName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  emails: {
    type: DataTypes.JSON,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'User',
});

export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  console.log(`Hashed Password: ${hashedPassword}`); // Imprime el hash en consola
  return hashedPassword;
};

export const findByUsername = async (username: string): Promise<User | null> => {
  const user = await UserModel.findOne({ where: { username } });
  return user ? user.get() as User : null;
};

export const verifyPassword = async (user: User, password: string): Promise<boolean> => {
  console.log(`USERNAME: ${user.username}; PASSWORD ${password}`);
  console.log(`USER PASSWORD FROM RECORDS: ${user.password}`);
  const match = await bcrypt.compare(password, user.password);
  const hashedPassword = await bcrypt.hash(password, 10);

  console.log(`HASHED PASSWORD: ${hashedPassword}`);
  console.log(`VERIFICACION ${match}`);

  return match;
};

export async function createUser(username: string, password: string, displayName: string, email: string): Promise<User> {
  // Comprobar si el nombre de usuario ya existe
  const existingUser = await findByUsername(username);
  if (existingUser) {
    throw new Error('Username already exists.');
  }

  // Hash de la contraseña
  const hashedPassword = await hashPassword(password);

  // Crear el usuario
  const newUser = await UserModel.create({
    username,
    password: hashedPassword,
    displayName,
    emails: [{ value: email }]
  });

  return newUser.get() as User;
}

export async function initializeDatabase() {
  // await sequelize.sync({ force: true }); // Usar { force: true } solo en desarrollo; elimina tablas existentes
  // await sequelize.sync({ alter: true }); // Usar { alter: true } para actualizar la estructura sin eliminar datos
  await sequelize.sync(); // Sincroniza la base de datos con los modelos definidos. Esto crea las tablas si no existen, pero no realiza cambios estructurales. Es adecuado para entornos de desarrollo y pruebas donde la estructura de la base de datos no cambia frecuentemente.
}
