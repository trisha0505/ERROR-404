// services/ai.js
const OpenAI = require( 'openai');

const openai = new OpenAI({
  apiKey: 'my api key', // defaults to process.env["OPENAI_API_KEY"]
});


async function chatWithNotes(noteContent, userQuestion) {
  const response = await openai.createCompletion({
    model: "text-davinci-002",
    prompt: `Note: ${noteContent}\n\nQuestion: ${userQuestion}\n\nAnswer:`,
    max_tokens: 150
  });
  return response.data.choices[0].text.trim();
}

async function summarizeNote(noteContent) {
  const response = await openai.createCompletion({
    model: "text-davinci-002",
    prompt: `Summarize the following note:\n\n${noteContent}\n\nSummary:`,
    max_tokens: 100
  });
  return response.data.choices[0].text.trim();
}

function getPersonalizedRecommendations(userProgress) {
  // This is a placeholder for a more complex recommendation system
  // In a real application, you'd use machine learning algorithms here
  const weakTopics = userProgress.filter(progress => progress.score < 0.7)
    .map(progress => progress.quiz.title);
  return weakTopics;
}

module.exports = { chatWithNotes, summarizeNote, getPersonalizedRecommendations };