const path = require('path');
const fs = require('fs');
const { extractText } = require('../utils/extractText');
const { OpenAI } = require('openai');

// Initialize OpenAI client using API key from environment
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Analyze an uploaded file: summarize and suggest possible transformations
exports.analyzeFile = async (req, res) => {
  try {
    const { fileId } = req.body;
    if (!fileId) return res.status(400).json({ error: 'fileId required' });
    const filePath = path.join(__dirname, '..', 'uploads', fileId);
    if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'File not found' });

    const text = await extractText(filePath);
    const prompt = `Summarize the following document in a few sentences:\n\n${text}`;

    // The OpenAI API generates a concise summary of the document
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
    });
    const summary = completion.choices[0].message.content.trim();

    // Static suggestions with fake cost estimates (USD)
    const suggestions = [
      { name: 'Presentation', cost: 0.02 },
      { name: 'Summary', cost: 0.01 },
      { name: 'Calendar', cost: 0.015 },
      { name: 'Social posts', cost: 0.012 },
    ];

    res.json({ summary, suggestions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Analysis failed' });
  }
};
