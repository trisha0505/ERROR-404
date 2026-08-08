// routes/ai.js
const express = require('express');
const { chatWithNotes, summarizeNote, getPersonalizedRecommendations } = require('../services/ai');
const { Note, UserProgress } = require('../models/UserProgress');
const { queueSummaryGeneration } = require('../jobs/index');

const router = express.Router();

router.post('/chat', async (req, res) => {
  try {
    const note = await Note.findById(req.body.noteId);
    const response = await chatWithNotes(note.content, req.body.question);
    res.send({ response });
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get('/summarize/:noteId', async (req, res) => {
  try {
    const note = await Note.findById(req.params.noteId);
    const summary = await summarizeNote(note.content);
    res.send({ summary });
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get('/recommendations', async (req, res) => {
  try {
    const userProgress = await UserProgress.find({ user: req.user._id }).populate('quiz');
    const recommendations = getPersonalizedRecommendations(userProgress);
    res.send({ recommendations });
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;
//const aiRoutes = require('./routes/ai');