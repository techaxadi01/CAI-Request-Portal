const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();
dotenv.config({ path: path.join(__dirname, '.env') });
dotenv.config({ path: path.join(__dirname, '../.env') });

const { connectDB } = require('./config/db');
const authRoutes = require('./routes/auth');
const requestRoutes = require('./routes/requests');

const app = express();

// Middlewares
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Connect to MongoDB Atlas
connectDB().catch((err) => {
  console.error('Initial MongoDB Atlas connection attempt failed:', err.message);
});

// Middleware to ensure DB connection is ready in serverless environments
app.use(async (req, res, next) => {
  try {
    await connectDB();
  } catch (err) {
    console.error('DB connect middleware error:', err.message);
  }
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/requests', requestRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    portal: 'Centre for Artificial Intelligence - Request Portal',
    institution: 'Christ University',
    serverTime: new Date().toISOString(),
    database: 'MongoDB Atlas',
  });
});

// Serve frontend in local production run if dist exists
const distPath = path.join(__dirname, '../client/dist');
app.use(express.static(distPath));

app.get('*', (req, res, next) => {
  if (req.url.startsWith('/api')) {
    return next();
  }
  const indexPath = path.join(distPath, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      res.status(200).send('CAI Request Portal API Server Running.');
    }
  });
});

// If run directly (node server/server.js)
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 [Server] CAI Request Portal running on http://localhost:${PORT}`);
    console.log(`📡 [API] Endpoints available at http://localhost:${PORT}/api/`);
  });
}

module.exports = app;
