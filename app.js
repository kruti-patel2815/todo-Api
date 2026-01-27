if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const createError = require('http-errors');
const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

// Routes
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const todoRouter = require('./routes/todoRoutes');

// DB
const connectDB = require('./config/db');

const app = express();

/* ======================
   DATABASE CONNECTION
====================== */
connectDB()
  .then(() => {
    console.log('✅ Database connected');
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
  });

/* ======================
   MIDDLEWARES
====================== */
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

/* ======================
   ROUTES
====================== */
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api/todos', todoRouter);

/* ======================
   HEALTH CHECK
====================== */
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
  });
});

/* ======================
   404 HANDLER
====================== */
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'The requested resource was not found',
  });
});

/* ======================
   GLOBAL ERROR HANDLER
   (Vercel SAFE – JSON only)
====================== */
app.use((err, req, res, next) => {
  console.error('🔥 Error:', err);

  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    status: err.status || 500,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
});

module.exports = app;
