// routes/auth.routes.ts
import { Router } from 'express';
import { authenticateLocal, authenticateJwt } from '../auth';
import * as AuthController from '../controllers/auth.controller';
import { handleValidationErrors } from '../middlewares/error.middleware';
import { validateUserLogin, validateUserSignUp } from '../middlewares/validation.middleware';

const router = Router();

router.post('/login', validateUserLogin, handleValidationErrors, authenticateLocal, AuthController.login);
router.post('/signup', validateUserSignUp, handleValidationErrors, AuthController.signup);
router.post('/logout', authenticateJwt, AuthController.logout);

export default router;
