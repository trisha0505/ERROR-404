const { recommendationQueue } = require('./index');
const { User, UserProgress, Quiz } = require('../models/UserProgress');
const logger = require('../utils/logger');

// Function to generate personalized recommendations
async function generateRecommendations(userId) {
  try {
    const user = await User.findById(userId);
    const userProgress = await UserProgress.find({ user: userId }).populate('quiz');
    const allQuizzes = await Quiz.find();

    // Calculate user's strengths and weaknesses
    const topicScores = {};
    userProgress.forEach(progress => {
      const topic = progress.quiz.title.split(' - ')[0]; // Assuming quiz titles are in format "Topic - Specific Quiz Name"
      if (!topicScores[topic]) {
        topicScores[topic] = { totalScore: 0, count: 0 };
      }
      topicScores[topic].totalScore += progress.score;
      topicScores[topic].count += 1;
    });

    // Calculate average scores and find weak topics
    const weakTopics = [];
    Object.entries(topicScores).forEach(([topic, data]) => {
      const avgScore = data.totalScore / data.count;
      if (avgScore < 0.7) { // Consider topics with average score less than 70% as weak
        weakTopics.push(topic);
      }
    });

    // Find quizzes for weak topics that the user hasn't taken yet
    const recommendedQuizzes = allQuizzes.filter(quiz => {
      const quizTopic = quiz.title.split(' - ')[0];
      return weakTopics.includes(quizTopic) && !userProgress.some(progress => progress.quiz._id.equals(quiz._id));
    });

    // Update user's recommendations
    user.recommendations = recommendedQuizzes.map(quiz => quiz._id);
    await user.save();

    logger.info(`Generated recommendations for user ${userId}`);
  } catch (error) {
    logger.error(`Error generating recommendations for user ${userId}:`, error);
    throw error;
  }
}

// Process recommendation generation jobs
recommendationQueue.process(async (job) => {
  await generateRecommendations(job.data.userId);
});

// Function to queue recommendation generation
function queueRecommendationGeneration(userId) {
  recommendationQueue.add({ userId });
}

module.exports = {
  queueRecommendationGeneration
};