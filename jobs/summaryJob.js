// jobs/summaryJob.js
const Bull = require('bull');
const { Note } = require('../models/Note');
const { summarizeNote } = require('../services/ai');

const summaryQueue = new Bull('note summaries');

summaryQueue.process(async (job) => {
  const note = await Note.findById(job.data.noteId);
  const summary = await summarizeNote(note.content);
  note.summary = summary;
  await note.save();
});

