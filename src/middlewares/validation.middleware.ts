// middlewares/validation.middleware.ts
import { body } from 'express-validator';

export const validateUserSignUp = [
    body('username').isString().trim().notEmpty().withMessage('Username is required.'),
    body('password').isString().trim().isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.'),
    body('displayName').isString().trim().notEmpty().withMessage('Display name is required.'),
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required.')
];

export const validateUserLogin = [
    body('username').isString().trim().notEmpty().withMessage('Username is required.'),
    body('password').isString().trim().notEmpty().withMessage('Password is required.')
];
