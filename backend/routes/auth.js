const express = require('express');
const passport = require('passport');
const router = express.Router();

// Redirect to Google for login
router.get('/google', (req, res, next) => {
  // Add debug log
  console.log('Starting Google auth flow');
  passport.authenticate('google', { 
    scope: ['profile', 'email'],
    prompt: 'select_account' // This ensures the Google login screen appears every time
  })(req, res, next);
});

// Google OAuth callback
router.get('/google/callback', 
  passport.authenticate('google', {
    failureRedirect: process.env.CLIENT_URL,
    session: true
  }), 
  (req, res) => {
    // Debug log
    console.log('Auth successful, redirecting to client');
    res.redirect(`${process.env.CLIENT_URL}/GJFeedPage`);
  }
);

// GET /me (get user info)
router.get('/me', (req, res) => {
  // Debug log
  console.log('ME endpoint called, authenticated:', req.isAuthenticated());
  console.log('Session ID:', req.sessionID);
  
  if (req.isAuthenticated()) {
    res.json(req.user);
  } else {
    res.status(401).json({ message: "Not authenticated" });
  }
});

module.exports = router;