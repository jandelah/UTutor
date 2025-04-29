// server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Basic rate limiter implementation (inline for simplicity)
const rateLimit = (maxRequests, timeWindow) => {
  const requests = new Map();
  
  return (req, res, next) => {
    const identifier = req.ip;
    const now = Date.now();
    const userRequests = requests.get(identifier) || [];
    const recentRequests = userRequests.filter(
      requestTime => requestTime > now - timeWindow
    );
    
    if (recentRequests.length >= maxRequests) {
      return res.status(429).json({
        success: false,
        message: 'Too many requests, please try again later'
      });
    }
    
    recentRequests.push(now);
    requests.set(identifier, recentRequests);
    next();
  };
};

// Basic route to verify server is running
app.get('/', (req, res) => {
  res.send('UTutor API is running!');
});

// Add route files
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/mentorships', require('./routes/mentorshipRoutes'));
app.use('/api/sessions', require('./routes/sessionRoutes'));
app.use('/api/resources', require('./routes/resourceRoutes'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'An unexpected error occurred',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Set port
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});