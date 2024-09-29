// routes/quizzes.js

const express = require('express');
const { Quiz, UserProgress } = require('../models/UserProgress');
const { queueSummaryGeneration } = require('../jobs/index');
const {  generateRecommendations } = require('../jobs/recommendationJobs');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const quiz = new Quiz(req.body);
    await quiz.save();
    res.status(201).send(quiz);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get('/', async (req, res) => {
  try {
    const quizzes = await Quiz.find();
    res.send(quizzes);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post('/:quizId/submit', async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.quizId);
    const score = calculateScore(quiz, req.body.answers);
    const progress = new UserProgress({
      user: req.user._id,
      quiz: quiz._id,
      score
    });
    queueRecommendationGeneration(req.user._id);
    await progress.save();
    res.send({ score });
  } catch (error) {
    res.status(400).send(error);
  }
});

function calculateScore(quiz, userAnswers) {
  let correctAnswers = 0;
  quiz.questions.forEach((question, index) => {
    if (question.correctAnswer === userAnswers[index]) {
      correctAnswers++;
    }
  });
  return correctAnswers / quiz.questions.length;
}

module.exports = router;
//const quizRoutes = require('./routes/quizzes');