// server.js - Updated configuration

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Enhanced CORS configuration - this is crucial for cross-domain requests
app.use(cors({
  // If you have a specific frontend origin:
  // origin: process.env.CORS_ORIGIN || '*',
  origin: '*', // Allow all origins (less secure but easier for development)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Basic route to verify server is running
app.get('/', (req, res) => {
  res.json({ message: 'UTutor API is running!' });
});

// IMPORTANT: Your routes need to match what the frontend expects
// If frontend calls /users/register directly (without /api prefix):
app.use('/users', require('./routes/userRoutes'));
app.use('/mentorships', require('./routes/mentorshipRoutes'));
app.use('/sessions', require('./routes/sessionRoutes'));
app.use('/resources', require('./routes/resourceRoutes'));

// If you need to maintain the /api prefix as well (support both):
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/mentorships', require('./routes/mentorshipRoutes'));
app.use('/api/sessions', require('./routes/sessionRoutes'));
app.use('/api/resources', require('./routes/resourceRoutes'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err.stack);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: process.env.NODE_ENV === 'production' ? 'An unexpected error occurred' : err.message,
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Handle 404 - Route not found
app.use((req, res) => {
  console.log(`Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`
  });
});

// Set port
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});