import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config';
import { createUser } from '../services/user.service';
import { User } from '../dtos/user.dto';

const jwtSecret = config.jwtSecret;

export const login = (req: Request, res: Response): void => {
    const user = req.user as User;
    const token = jwt.sign({ username: user.username }, jwtSecret);
    res.json({ token });
};

export const signup = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { username, password, displayName, email } = req.body;
        const newUser = await createUser(username, password, displayName, email);
        return res.status(201).json({
            id: newUser.id,
            username: newUser.username,
            displayName: newUser.displayName,
            email: newUser.email,
            token: jwt.sign({ username: newUser.username }, jwtSecret)
        });
    } catch (error: any) {
        return res.status(400).json({ error: error.message });
    }
};

export const logout = (req: Request, res: Response): void => {
    res.status(200).send({ message: 'Logout successful' });
};
