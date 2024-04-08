// app.ts
import express from 'express';
import passport from 'passport';
import { Strategy as BearerStrategy } from 'passport-http-bearer';
import { users } from './db';  // Asumimos que db exporta correctamente los usuarios
import morgan from 'morgan';
import { User } from './db/users';

passport.use(new BearerStrategy(
  (token: string, cb: (error: any, user?: any) => void) => {
    users.findByToken(token, (err, user) => {
      if (err) { return cb(err); }
      if (!user) { return cb(null, false); }
      return cb(null, user);
    });
  })
);

const app = express();
app.use(morgan('combined'));

app.get('/',
  passport.authenticate('bearer', { session: false }),
  (req: express.Request, res: express.Response) => {
    if (req.user) {
        const user = req.user as User;
        res.json({ username: user.username, email: user.emails[0].value });
    }
  }
);

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
