require('dotenv').config();
const { OpenAI } = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function getEmbedding(text) {
  const embedding = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text,
    encoding_format: "float",
  });

  return embedding.data[0].embedding;
}

function cosineSimilarity(vecA, vecB) {
  let dotProduct = vecA.reduce((sum, val, i) => sum + val * vecB[i], 0);
  let magnitudeA = Math.sqrt(vecA.reduce((sum, val) => sum + val * val, 0));
  let magnitudeB = Math.sqrt(vecB.reduce((sum, val) => sum + val * val, 0));
  return dotProduct / (magnitudeA * magnitudeB);
}

// cosine similarity score ranges from -1 (completely opposite) to 1 (identical
// meaning), with higher values indicating better prediction accuracy
async function score(predicted, actual) {
  let [vecA, vecB] = await Promise.all([getEmbedding(predicted), getEmbedding(actual)]);
  return cosineSimilarity(vecA, vecB);
}

module.exports = { score };