// route/quizRoute.js
import express from 'express';

const router = express.Router();

router.post('/generate', async (req, res) => {
  const { lectureTitle, courseCategory } = req.body;

  if (!lectureTitle?.trim()) {
    return res.status(400).json({ message: 'lectureTitle is required' });
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ message: 'GROQ_API_KEY not set in environment' });
  }

  const prompt = `You are an expert educator creating a quiz specifically about: "${lectureTitle}"${courseCategory ? ` (from a ${courseCategory} course)` : ''}.

IMPORTANT: Every question AND every answer option MUST be directly and specifically about "${lectureTitle}". Do NOT generate generic or unrelated questions.

Generate exactly 4 multiple choice questions. Each question must:
- Be specifically about concepts, syntax, features, or use cases from "${lectureTitle}"
- Have 4 answer options that are all plausible but only one is correct
- Test actual understanding of "${lectureTitle}"

Output ONLY a raw JSON array. Zero markdown. Zero explanation. Zero backticks. Start directly with [ and end with ].

[{"question":"<specific question about ${lectureTitle}>","options":["<wrong answer>","<correct answer>","<wrong answer>","<wrong answer>"],"correctIndex":1},{"question":"...","options":["...","...","...","..."],"correctIndex":0}]`;

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: `You are a precise quiz generator. You ONLY generate questions that are specifically about the exact topic given. You never generate off-topic or generic questions. You always respond with raw JSON only — no markdown, no backticks, no explanation.`
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.4,  // lower = more focused, less random
        max_tokens: 1024,
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Groq API error:', data);
      return res.status(500).json({ message: data?.error?.message || 'Groq API error' });
    }

    const raw = data?.choices?.[0]?.message?.content?.trim() || '[]';

    // Aggressively strip any markdown
    const cleaned = raw
      .replace(/```json/gi, '')
      .replace(/```/g, '')
      .replace(/^[^[]*(\[)/, '$1')   // strip anything before first [
      .replace(/\][^]]*$/, ']')       // strip anything after last ]
      .trim();

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