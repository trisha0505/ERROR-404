const Bull = require('bull');
const Redis = require('ioredis');
const { summarizeNote } = require('../services/ai');
const { Note } = require('../models/Note');
const logger = require('../utils/logger');

// Create a new Redis client
const redisClient = new Redis(process.env.REDIS_URL);


// Create queues
const summaryQueue = new Bull('note summaries', { redis: redisClient });
const recommendationQueue = new Bull('user recommendations', { redis: redisClient });

// Process summary generation jobs
summaryQueue.process(async (job) => {
  try {
    const note = await Note.findById(job.data.noteId);
    const summary = await summarizeNote(note.content);
    note.summary = summary;
    await note.save();
    logger.info(`Summary generated for note ${note._id}`);
  } catch (error) {
    logger.error(`Error generating summary for note ${job.data.noteId}:`, error);
    throw error;
  }
});

// Function to queue summary generation
// Enqueue a job to generate a summary
function queueSummaryGeneration(noteId) {
  summaryQueue.add({ noteId });
}

module.exports = {
  summaryQueue,
  recommendationQueue,
  queueSummaryGeneration
};