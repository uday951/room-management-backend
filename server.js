const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const roomRoutes = require('./routes/rooms');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/roommanagement')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);

app.get('/', (req, res) => {
  res.json({ 
    message: 'Room Management API is running!',
    timestamp: new Date().toISOString(),
    status: 'healthy'
  });
});

app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Self-ping to prevent sleep (only in production)
if (process.env.NODE_ENV === 'production') {
  const https = require('https');
  setInterval(() => {
    https.get('https://room-management-backend-p2ys.onrender.com/health', (res) => {
      console.log(`Self-ping: ${res.statusCode}`);
    }).on('error', (err) => {
      console.log('Self-ping error:', err.message);
    });
  }, 10 * 60 * 1000); // Every 10 minutes
}