// Only load dotenv in development
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var todoRouter = require('./routes/todoRoutes');

var connectDB = require('./config/db');

var app = express();

// Connect to MongoDB (with error handling)
connectDB().catch(err => {
  console.error('MongoDB connection error:', err);
});

// Middleware setup
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors({
  origin: '*', // Allow all origins for now, change in production
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api/todos', todoRouter);

// Health check endpoint for Vercel
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// 404 handler
app.use(function(req, res, next) {
  res.status(404).json({
    error: 'Not Found',
    message: 'The requested resource was not found'
  });
});

// Error handler
app.use(function(err, req, res, next) {
  console.error('Error:', err);
  
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  const errorResponse = {
    error: err.message || 'Internal Server Error',
    status: err.status || 500
  };
  
  if (isDevelopment) {
    errorResponse.stack = err.stack;
  }
  
  res.status(err.status || 500);
  
  if (req.accepts('json')) {
    res.json(errorResponse);
  } else {
    res.render('error', { 
      message: err.message,
      error: isDevelopment ? err : {}
    });
  }
});

// Server setup
const PORT = process.env.PORT || 3000;

// Only start server if not in Vercel serverless environment
if (process.env.NODE_ENV !== 'production' || process.env.VERCEL !== '1') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;