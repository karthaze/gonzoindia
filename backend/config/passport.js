const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const dotenv = require("dotenv");
const User = require("../models/users");

dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.BACKEND_URL}/auth/google/callback`,
      proxy:true
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log("Google profile received:", JSON.stringify(profile, null, 2));

      try {
        const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
        if (!email) {
          return done(new Error("Email missing in Google profile"), null);
        }

        let user = await User.findOne({ googleId: profile.id });
        if (!user) {
          user = new User({
            googleId: profile.id,
            email: email,
            displayName: profile.displayName || profile.name || 'User',
          });
          await user.save();
        }
        return done(null, user);
      } catch (error) {
        console.error("Error in Google strategy:", error);
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.googleId || user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findOne({ googleId: id });
    console.log({user})
    if (user) {
      done(null, user);
    } else {
      done(new Error("User not found"), null);
    }
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;
