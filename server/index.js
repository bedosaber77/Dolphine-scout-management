const express = require('express');
require('dotenv').config();
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const db = require('./config/DBmanager');
const app = express();
const apiRouter = require('./routes/api');

const port = process.env.PORT || 3000;

// CORS Middleware
const allowedOrigins = [
  'http://127.0.0.1:5174',
  'http://localhost:5174',
  'http://127.0.0.1:5173',
  'http://localhost:5173',
  'https://dolphine-scout.vercel.app',
];
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'accessToken'],
  })
);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
if (process.env.NODE_ENV === 'dev') app.use(morgan('dev'));

// Database Connection
db.connect();

// API Routes
app.use('/api', apiRouter);

// Server Startup
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
