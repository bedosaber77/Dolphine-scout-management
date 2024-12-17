const express = require('express');
require('dotenv').config();
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const db = require('./config/DBmanager');
const app = express();
const apiRouter = require('./routes/api');

const port = process.env.PORT || 3000;

app.use(
  cors({
    origin: [
      'http://127.0.0.1:5174',
      'http://localhost:5174',
      'http://127.0.0.1:5173',
      'http://localhost:5173',
    ], // Allowed origins
    credentials: true, // Allow cookies
  })
);
// app.options('*', cors()); // Preflight handling
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
if (process.env.NODE_ENV === 'dev') app.use(morgan('dev'));
db.connect();

app.use('/api', apiRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
