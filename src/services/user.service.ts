// user.service.ts
import bcrypt from 'bcrypt';
import UserModel, { User } from '../models/user.model';

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

  const newUser = await UserModel.create({
    username,
    email: email,
    password: hashedPassword,
    displayName,
  });

  return newUser.get() as User;
};
