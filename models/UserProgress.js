
// models/UserProgress.java
const {mongoose} = require('mongoose');
const userProgressSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
    score: { type: Number, required: true },
    completedAt: { type: Date, default: Date.now },
  });
  const Note = require('./Note'); // assuming Note is defined in a separate file
const Quiz = require('./Quiz');
const UserProgress = require('./UserProgress');

  //const UserProgress = mongoose.model('UserProgress', userProgressSchema);
  
  module.exports = { Note, Quiz, UserProgress };