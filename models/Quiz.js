// models/Quiz.js
const {mongoose} = require('mongoose');
const quizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  questions: [{
    question: { type: String, required: true },
    options: [{ type: String, required: true }],
    correctAnswer: { type: Number, required: true },
  }],
});

const Quiz = mongoose.model('Quiz', quizSchema);