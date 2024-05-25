import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { authenticateLocal, authenticateJwt } from '../auth';
import { validationResult } from 'express-validator';
import config from '../config';
import { validateUserLogin, validateUserSignUp } from '../utils/validators';
import { createUser } from '../services/user.service';
import { User } from '../dtos/user.dto';

const router = Router();
const jwtSecret = config.jwtSecret; // Asegúrate de mantener tu secreto seguro y privado

const handleValidationErrors = (req: any, res: any, next: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

router.post('/login', validateUserLogin, handleValidationErrors, authenticateLocal, (req: any, res: any) => {
    const user = req.user as User;
    const token = jwt.sign({ username: user.username }, jwtSecret);
    res.json({ token });
});

router.post('/signup', validateUserSignUp, handleValidationErrors, async (req: any, res: any) => {
    try {
        const { username, password, displayName, email } = req.body;
        const newUser = await createUser(username, password, displayName, email);
        res.status(201).json({
            id: newUser.id,
            username: newUser.username,
            displayName: newUser.displayName,
            email: newUser.email,
            token: jwt.sign({ username: newUser.username }, jwtSecret)
        });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

router.post('/logout', authenticateJwt, (req, res) => {
    res.status(200).send({ message: 'Logout successful' });
});

export default router;
