//import { connectDB } from './database/connectDB.js';
const dotenv = require('dotenv');
dotenv.config();
console.log(process.env); // Verify that MONGO_URI is being loaded
const express = require('express');
const path = require('path');
const serverPath = path.resolve(__dirname, 'server.js');
require(serverPath);
const mongoose = require('mongoose');

const errorHandler = require('./middlewares/errorHandler');
const authRoutes = require('./routes/auth');
const noteRoutes = require('./routes/Notes');
const quizRoutes = require('./routes/quizzes');
//const progressRoutes = require('./routes/progress');
const aiRoutes = require('./routes/ai');
//const searchRoutes = require('./routes/search');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Database connection


app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/quizzes', quizRoutes);
//app.use('/api/progress', progressRoutes);
app.use('/api/ai', aiRoutes);
//app.use('/api/search', searchRoutes);

//Routes
//const authRoutes = require('./routes/auth');
app.use('/auth', authRoutes);

//const noteRoutes = require('./routes/Notes');
app.use('/notes', noteRoutes);

//const aiRoutes = require('./routes/ai');
app.use('/ai', aiRoutes);

//const quizRoutes = require('./routes/quizzes');
app.use('/quizzes', quizRoutes);

//Error handling
//const errorHandler = require('./middlewares/errorHandler');
app.use(errorHandler);
const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    console.error('MONGO_URI environment variable is not set');
    process.exit(1);
  }
  try {
    const conn =  await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
      console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
      connectDB();
      console.log('MongoDB Connection Failed with', error.message);
      process.exit(1);
  }
};
// Start server
app.listen(PORT, () => {
  connectDB();
    console.log(`Server running on port ${PORT}`);

  });
  
module.exports = app;
