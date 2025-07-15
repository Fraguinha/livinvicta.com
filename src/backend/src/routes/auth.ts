import express from 'express';
import passport from 'passport';
import { UserDoc } from "../models/user";

const router = express.Router()

router.post("/auth/status", (req, res) => {
  if (req.isAuthenticated() && req.user) {
    const user = req.user as UserDoc;
    const safeUser = {
      id: user._id,
      email: user.email,
      role: user.role,
    };
    res.json({ authenticated: true, user: safeUser });
  } else {
    res.json({ authenticated: false });
  }
});

router.post('/auth/login', (req, res, next) => {
  passport.authenticate('local', (err: any, user: any, info: any) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ success: false, error: "Invalid credentials" });
    req.logIn(user, (err: any) => {
      if (err) return next(err);
      const safeUser = {
        id: user._id,
        email: user.email,
        role: user.role,
      };
      return res.json({ success: true, user: safeUser });
    });
  })(req, res, next);
});

router.post('/auth/logout', (req, res) => {
  req.logout(() => {
    res.json({ success: true });
  });
});

router.get('/auth/google', passport.authenticate('google', { scope: ['email', 'profile'] }))
router.get('/auth/google/callback', passport.authenticate('google', {
  failureRedirect: '/login',
}), (req, res) => {
  res.redirect('/')
})

export default router
