// controllers/auth.controller.ts
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config';
import { createUser } from '../services/user.service';
import { User } from '../dtos/user.dto';
import { getUserRoles } from '../services/role.service';

const jwtSecret = config.jwtSecret;

export const login = async (req: Request, res: Response): Promise<void> => {
    const user = req.user as User;
    const token = jwt.sign({
        id: user.id,
        email: user.email,
        display_name: user.display_name,
        username: user.username,
        roles: await getUserRoles(user.id)
    }, jwtSecret);
    res.json({ token });
};

export const signup = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { username, password, display_name, email } = req.body;
        const newUser = await createUser(username, password, display_name, email);
        return res.status(201).json({
            id: newUser.id,
            username: newUser.username,
            display_name: newUser.display_name,
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
