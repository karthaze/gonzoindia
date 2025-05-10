const express = require("express");
const dotenv = require("dotenv");
const session = require("express-session");
const passport = require("passport");
const postRoutes = require('./routes/post');
const authRoutes = require('./routes/auth');
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

// Configure CORS
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(require("cookie-parser")());
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ limit: '20mb', extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'your_secret_key', 
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      ttl: 24 * 60 * 60,
      autoRemove: 'native'
    }),
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: true, 
      sameSite: 'None', 
    },
  })
);
app.options('*', cors());

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

// Require passport config
require("./config/passport");

// Use the auth routes
app.use('/auth', authRoutes);

// Other routes
app.use('/api/posts', postRoutes);

app.get("/", (req, res) => {
  res.send("✅ GonzoIndia backend is working!");
});

// The /me endpoint - moved to authRoutes but keeping here for compatibility
app.get('/me', (req, res) => {
  console.log('Session ID:', req.sessionID);
  console.log('Session contents:', req.session);
  console.log('User in req:', req.user);
  console.log('Authenticated:', req.isAuthenticated());
  if (req.isAuthenticated()) {
    res.json(req.user);  
  } else {
    res.status(401).json({ message: 'User not logged123 in' });
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

app.get('/logout', (req, res, next) => {
  req.logout(err => {
    if (err) return next(err);
    req.session.destroy(err => {
      if (err) {
        return res.status(500).send('Error logging out');
      }
      res.clearCookie('connect.sid');
      res.status(200).send('Logged out successfully');
    });
  });
});

const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ['GET', 'POST'],
    credentials: true // Add this to ensure cookies are sent with websocket
  }
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

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