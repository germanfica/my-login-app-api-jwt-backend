import { Router } from 'express';
import { authenticateJwt } from '../auth';
import { User } from '../dtos/user.dto';

const router = Router();

router.get('/profile', authenticateJwt, (req, res) => {
    const user = req.user as User;
    res.json({ username: user.username, email: user.email });
});

export default router;
