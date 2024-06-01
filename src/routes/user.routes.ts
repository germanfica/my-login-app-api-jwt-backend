// routes/user.routes.ts
import { Router } from 'express';
import { authenticateJwt } from '../auth';
import * as UserController from '../controllers/user.controller';
import { rolesAllowed } from '../middlewares/role.middleware';
import { ERole } from '../enums/role.enum';

const router = Router();

//router.get('/profile', authenticateJwt, UserController.getUserProfile);
router.get('/profile', authenticateJwt, rolesAllowed([ERole.ROLE_USER]), UserController.getUserProfile);

export default router;
