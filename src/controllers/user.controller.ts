// controllers/user.controller.ts
import { Request, Response } from 'express';
import { User } from '../dtos/user.dto';

export const getUserProfile = (req: Request, res: Response) => {
    const user = req.user as User;
    res.json({ username: user.username, email: user.email });
};
