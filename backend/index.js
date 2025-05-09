const express = require("express");
const dotenv = require("dotenv");
const session = require("express-session");
const passport = require("passport");
const postRoutes = require('./routes/post');
const MongoStore = require('connect-mongo');
const User = require("./models/users");
const cors = require("cors");
const connectDB = require('./config/db');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');
const { searchSpotify } = require('./utils/spotify');


dotenv.config();
const app = express();

connectDB();

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}));

app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ limit: '20mb', extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/posts', postRoutes);

const server = http.createServer(app); // use http server for Socket.IO
const io = socketIO(server, {
  cors: {
    origin: process.env.CLIENT_URL, // your frontend URL
    methods: ['GET', 'POST']
  }
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// SESSION MIDDLEWARE - MOVE THIS BEFORE PASSPORT INITIALIZATION
app.use(
  session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: false, // Changed to false to save session only when needed
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      ttl: 24 * 60 * 60, // 1 day
      autoRemove: 'native'
    }),
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      httpOnly: false,
      secure: true, // For development (in production set to true with HTTPS)
      sameSite: 'None',
    },
  })
);

// Initialize passport after session middleware
app.use(passport.initialize());
app.use(passport.session()); // ADD THIS LINE for persistent sessions

// Require passport config after initializing passport
require("./config/passport");

app.get("/", (req, res) => {
  res.send("✅ GonzoIndia backend is working!");
});

app.get('/auth/google', (req, res, next) => {
  if (req.isAuthenticated()) {
    console.log("isauthenticated")
    return res.redirect(`${process.env.CLIENT_URL}/GJFeedPage`);

  }
  passport.authenticate('google', { 
    scope: ['profile', 'email'],
    prompt: 'select_account'  // This ensures the Google login screen appears every time
  })(req, res, next);
});

app.get('/me', (req, res) => {
  console.log('meee')
  console.log(req)
  console.log(req.isAuthenticated())
  if (req.isAuthenticated()) {
    res.json(req.user);  
  } else {
    res.status(401).json({ message: 'User not logged in' });
  }
});

app.get('/api/spotify/search', async (req, res) => {
  const q = req.query.q;
  if (!q) return res.status(400).json({ error: 'Missing query param ?q=' });

  try {
    const results = await searchSpotify(q);
    res.json(results);
  } catch (err) {
    console.error('Spotify search error:', err.message);
    res.status(500).json({ error: 'Spotify search failed' });
  }
});



app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: process.env.CLIENT_URL }), async (req, res) => {
  try {
    // Debug log to see what's actually in the user object
    console.log("Google auth callback user:", JSON.stringify(req.user, null, 2));
    
    // Get email safely with fallback
    const email = req.user.emails && req.user.emails[0] ? req.user.emails[0].value : null;
    
    let user = await User.findOne({ googleId: req.user.id });

    if (!user) {
      user = new User({
        googleId: req.user.id,
        email: email,
        displayName: req.user.displayName || req.user.name || 'User',
      });
      await user.save();
    }
    res.redirect(`${process.env.CLIENT_URL}/GJFeedPage`);

  } catch (err) {
    console.error('Error during user save:', err);
    res.status(500).send("Internal Server Error");
  }
});


app.get('/logout', (req, res, next) => {
  req.logout(err => {
    if (err) return next(err);
    req.session.destroy(err => {
      if (err) {
        return res.status(500).send('Error logging out');
      }
      res.clearCookie('connect.sid'); // Important: clears the session cookie
      res.status(200).send('Logged out successfully');
    });
  });
});

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Expose `io` globally if needed in routes
app.set('io', io);


// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});