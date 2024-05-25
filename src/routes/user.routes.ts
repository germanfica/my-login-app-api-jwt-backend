import { Router } from 'express';
import { authenticateJwt } from '../auth';
import * as UserController from '../controllers/user.controller';

const router = Router();

router.get('/profile', authenticateJwt, UserController.getUserProfile);

export default router;
