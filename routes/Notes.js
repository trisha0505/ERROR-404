// routes/notes.js
const express = require('express');
const { Note } = require('../models/Note');
const upload = require('../middlewares/upload');

const { queueSummaryGeneration } = require('../jobs/index');

const router = express.Router();

router.post('/', upload.array('attachments', 5), async (req, res) => {
  try {
    const { title, content } = req.body;
    const attachments = req.files.map(file => file.path);
    const note = new Note({
      user: req.user._id,
      title,
      content,
      attachments
    });
    await note.save();
    queueSummaryGeneration(note._id);
    res.status(201).send(note);
  } catch (error) {
    res.status(400).send(error);
  }
});
module.exports = router;
//const noteRoutes = require('./routes/Notes');