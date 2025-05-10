const express = require('express');
const passport = require('passport');
const router = express.Router();

// In routes/auth.js - Enhanced Google OAuth flow

// Redirect to Google for login
router.get('/google', (req, res, next) => {
  // Store intended return URL in session if provided
  if (req.query.returnTo) {
    req.session.returnTo = req.query.returnTo;
  }
  
  console.log('Starting Google auth flow');
  passport.authenticate('google', { 
    scope: ['profile', 'email'],
    prompt: 'select_account', // This ensures the Google login screen appears every time
    accessType: 'offline', // Get refresh token
  })(req, res, next);
});

// Google OAuth callback with better error handling and redirect
router.get('/google/callback', 
  (req, res, next) => {
    passport.authenticate('google', {
      failureRedirect: `${process.env.CLIENT_URL}/login?error=auth_failed`
    })(req, res, next);
  }, 
  (req, res) => {
    // Successful authentication
    console.log('Auth successful, redirecting to client');
    
    // Create a JWT token for extra security (optional enhancement)
    // const token = jwt.sign({ userId: req.user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    
    // Redirect to original intended URL or default page
    const returnTo = req.session.returnTo || '/GJFeedPage';
    delete req.session.returnTo;
    
    res.redirect(`${process.env.CLIENT_URL}${returnTo}`);
  }
);

// Better /me endpoint with proper error handling
router.get('/me', (req, res) => {
  console.log('ME endpoint called, authenticated:', req.isAuthenticated());
  
  if (req.isAuthenticated()) {
    // Only send necessary user data
    const { _id, googleId, displayName, email, photo } = req.user;
    res.json({ _id, googleId, displayName, email, photo });
  } else {
    res.status(401).json({ 
      message: "Not authenticated",
      code: "AUTH_REQUIRED"
    });
  }
});

// Add a proper logout endpoint
router.get('/logout', (req, res) => {
  req.logout(function(err) {
    if (err) { 
      return res.status(500).json({ error: 'Logout failed' }); 
    }
    
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: 'Session destruction failed' });
      }
      
      res.clearCookie('yourAppSessionId'); // Match the name in your session config
      return res.status(200).json({ message: 'Logged out successfully' });
    });
  });
});

module.exports = router;