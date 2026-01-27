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

connectDB().catch(err => {
  console.error('MongoDB connection error:', err);
});


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api/todos', todoRouter);


app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});


app.use(function(req, res, next) {
  res.status(404).json({
    error: 'Not Found',
    message: 'The requested resource was not found'
  });
});


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


const PORT = process.env.PORT || 3000;


module.exports = app;


