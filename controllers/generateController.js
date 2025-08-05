const path = require('path');
const fs = require('fs');
const { extractText } = require('../utils/extractText');
const { OpenAI } = require('openai');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Transform the uploaded file into a new output using GPT
exports.generateOutput = async (req, res) => {
  try {
    const { fileId, task, notes } = req.body;
    if (!fileId || !task) {
      return res.status(400).json({ error: 'fileId and task required' });
    }
    const filePath = path.join(__dirname, '..', 'uploads', fileId);
    if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'File not found' });

    const text = await extractText(filePath);
    const prompt = `Create a ${task} from the following document. Extra notes: ${notes || 'none'}\n\n${text}`;

    // OpenAI generates the requested transformation
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
    });
    const result = completion.choices[0].message.content.trim();

    res.json({
      result,
      blurb: `Your ${task} is ready.`,
      cost: 0.05, // fake cost estimate
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Generation failed' });
  }
};
