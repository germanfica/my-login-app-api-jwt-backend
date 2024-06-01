// services/user.service.ts
import bcrypt from 'bcrypt';
import UserModel from '../models/user.model';
import { User } from '../dtos/user.dto';

// Define a type that includes only the attributes needed to create a new user
//type UserCreationAttributes = Pick<User, 'username' | 'email' | 'password' | 'displayName'>;
type UserCreationAttributes = Omit<User, 'id'>;

export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
};

export const findByUsername = async (username: string): Promise<User | null> => {
  const user = await UserModel.findOne({ where: { username } });
  return user ? user.get() as User : null;
};

export const verifyPassword = async (user: User, password: string): Promise<boolean> => {
  const match = await bcrypt.compare(password, user.password);
  return match;
};

export const createUser = async (username: string, password: string, displayName: string, email: string): Promise<User> => {
  const existingUser = await findByUsername(username);
  if (existingUser) {
    throw new Error('Username already exists.');
  }

  const hashedPassword = await hashPassword(password);

  const userData: UserCreationAttributes = {
    username,
    email,
    password: hashedPassword,
    displayName,
  };

  const newUser = await UserModel.create(userData);

  return newUser.get() as User;
};

// CRUD
// Get all users
export const getAllUsers = async (): Promise<User[]> => {
  const users = await UserModel.findAll();
  return users.map(user => user.get() as User);
};

// Get user by ID
export const getUser = async (id: number): Promise<User | null> => {
  const user = await UserModel.findByPk(id);
  return user ? user.get() as User : null;
};

// Delete user by ID
export const deleteUser = async (id: number): Promise<boolean> => {
  const deletedCount = await UserModel.destroy({ where: { id } });
  return deletedCount > 0;
};

// Get first name by ID
export const getFirstNameById = async (id: number): Promise<string | null> => {
  const user = await UserModel.findByPk(id, {
    attributes: ['displayName']
  });
  return user ? user['displayName'] : null;
};
