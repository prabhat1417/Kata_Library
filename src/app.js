const express = require('express');
const mongoose = require('mongoose');
const libraryRoutes = require('./routes/libraryRoutes');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use('/api', libraryRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

module.exports = app;
