import express from 'express';
import passport from 'passport';

const router = express.Router()

router.post("/auth/status", (req, res) => {
  res.json({ authenticated: req.isAuthenticated() });
});

router.post('/auth/login', (req, res, next) => {
  passport.authenticate('local', (err: any, user: any, info: any) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ success: false, error: "Invalid credentials" });
    req.logIn(user, (err: any) => {
      if (err) return next(err);
      return res.json({ success: true });
    });
  })(req, res, next);
});

router.post('/auth/logout', (req, res) => {
  req.logout(() => {
    res.json({ success: true });
  });
});

export default router
