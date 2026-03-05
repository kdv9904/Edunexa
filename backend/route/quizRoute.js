// route/quizRoute.js
import express from 'express';
import Anthropic from '@anthropic-ai/sdk';

const router = express.Router();

// ✅ Client created INSIDE the handler so process.env is already loaded
router.post('/generate', async (req, res) => {
  const { lectureTitle } = req.body;

  if (!lectureTitle?.trim()) {
    return res.status(400).json({ message: 'lectureTitle is required' });
  }

  try {
    // Instantiate here — dotenv is guaranteed to have run by now
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: `You are a quiz generator for an online learning platform.

Generate exactly 4 multiple choice questions to test understanding of a lecture titled: "${lectureTitle}"

Rules:
- Each question must have exactly 4 options (A, B, C, D)
- Only one option is correct
- Questions should test conceptual understanding, not trivia
- Keep questions concise and clear

Respond ONLY with a valid JSON array. No markdown, no explanation, no backticks, no code fences.

Example output:
[{"question":"What is X?","options":["A","B","C","D"],"correctIndex":0},{"question":"Why Y?","options":["A","B","C","D"],"correctIndex":2}]

correctIndex is 0-based (0 = first option, 1 = second, etc.)`
        }
      ]
    });

    const raw = message.content[0]?.text?.trim() || '[]';
    const cleaned = raw.replace(/```json/gi, '').replace(/```/g, '').trim();

    let questions;
    try {
      questions = JSON.parse(cleaned);
    } catch {
      console.error('Failed to parse quiz JSON:', cleaned);
      return res.status(500).json({ message: 'Failed to parse quiz response' });
    }

    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(500).json({ message: 'Invalid quiz format returned' });
    }

    const valid = questions.filter(q =>
      q.question &&
      Array.isArray(q.options) &&
      q.options.length === 4 &&
      typeof q.correctIndex === 'number'
    );

    if (valid.length === 0) {
      return res.status(500).json({ message: 'No valid questions generated' });
    }

    return res.json({ questions: valid });

  } catch (error) {
    console.error('Quiz generation error:', error.message);
    return res.status(500).json({ message: 'Quiz generation failed', error: error.message });
  }
});

export default router;