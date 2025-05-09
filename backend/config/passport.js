// ./config/passport.js

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/users');

// This determines what data from the user object should be stored in the session
passport.serializeUser((user, done) => {
  // Store just the MongoDB _id in the session
  done(null, user.id); // Using Mongoose's .id virtual property
});

// This is called on every request to recover the full user from the ID stored in the session
passport.deserializeUser(async (id, done) => {
  try {
    console.log('Deserializing user with id:', id);
    // IMPORTANT: Find by _id, not googleId
    const user = await User.findById(id);
    console.log('Deserialized user result:', user ? 'User found' : 'User not found');
    done(null, user);
  } catch (err) {
    console.error('Error in deserializeUser:', err);
    done(err, null);
  }
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/auth/google/callback',
      proxy: true // Important for deployment platforms like Render
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log('Google profile received:', profile.id);
        
        // Find user by googleId
        let user = await User.findOne({ googleId: profile.id });
        
        // Get email safely
        const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
        
        if (!user) {
          // Create new user if not found
          user = new User({
            googleId: profile.id,
            email: email,
            displayName: profile.displayName || 'User'
          });
          await user.save();
          console.log('New user created:', user.id);
        } else {
          console.log('Existing user found:', user.id);
        }
        
        return done(null, user);
      } catch (err) {
        console.error('Error in Google strategy:', err);
        return done(err, null);
      }
    }
  )
);

module.exports = passport;