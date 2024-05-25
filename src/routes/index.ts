// routes/index.ts
import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';

const router = Router();

// Warning: Having multiple routes with the same endpoint (/) can lead to conflicts and unexpected behavior.
// It's recommended to use specific prefixes for different route groups (e.g., /auth, /user).
router.use('/', authRoutes); // use /auth if possible
router.use('/', userRoutes); // use /user if possible

export default router;
