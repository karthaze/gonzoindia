const express = require('express');
const passport = require('passport');
const router = express.Router();

// Redirect to Google for login
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

// Google OAuth callback
router.get('/google/callback', passport.authenticate('google', {
    failureRedirect: '/login',
    session: true,
  }), (req, res) => {
    // Successful auth
    res.send('✅ Logged in with Google');
});

// GET /me (get user info)
router.get('/me', (req, res) => {
  if (req.user) {
    res.json(req.user); // Send logged-in user's data
  } else {
    res.status(401).json({ message: "Not authenticated" });
  }
});


module.exports = router;
