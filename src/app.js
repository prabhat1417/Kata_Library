const express = require('express');
const mongoose = require('mongoose');
const logger = require('morgan');
const libraryRoutes = require('./routes/libraryRoutes');
require('dotenv').config();

const app = express();

app.use(express.json());

logger.token('req-body', (req, res) => JSON.stringify(req.body));
app.use(logger(':method :url :status - :response-time ms :req-body'));

app.use('/api', libraryRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

module.exports = app;
