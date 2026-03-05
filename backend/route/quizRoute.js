// route/quizRoute.js
// Uses Google Gemini API — completely FREE tier available
// Get your key at: https://aistudio.google.com/app/apikey (no credit card)
import express from 'express';

const router = express.Router();

router.post('/generate', async (req, res) => {
  const { lectureTitle } = req.body;

  if (!lectureTitle?.trim()) {
    return res.status(400).json({ message: 'lectureTitle is required' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ message: 'GEMINI_API_KEY not set in environment' });
  }

  const prompt = `You are a quiz generator for an online learning platform.

Generate exactly 4 multiple choice questions to test understanding of a lecture titled: "${lectureTitle}"

Rules:
- Each question must have exactly 4 options
- Only one option is correct
- Questions should test conceptual understanding, not trivia
- Keep questions concise and clear

Respond ONLY with a valid JSON array. No markdown, no explanation, no backticks, no code fences. Just raw JSON.

Example:
[{"question":"What is X?","options":["A","B","C","D"],"correctIndex":0},{"question":"Why Y?","options":["A","B","C","D"],"correctIndex":2}]

correctIndex is 0-based.`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1024,
          }
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error('Gemini API error:', data);
      return res.status(500).json({
        message: data?.error?.message || 'Gemini API error',
      });
    }

    const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '[]';
    const cleaned = raw.replace(/```json/gi, '').replace(/```/g, '').trim();

    let questions;
    try {
      questions = JSON.parse(cleaned);
    } catch {
      console.error('JSON parse failed:', cleaned);
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

    return res.json({ questions: valid });

  } catch (error) {
    console.error('Quiz route error:', error.message);
    return res.status(500).json({ message: 'Quiz generation failed', error: error.message });
  }
});

export default router;