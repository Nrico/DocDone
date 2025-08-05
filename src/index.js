const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const { OpenAI } = require('openai');
require('dotenv').config();

const app = express();
app.use(express.json());

// basic health check route
app.get('/', (req, res) => {
  res.send('DocDone backend is running. Upload files via POST /upload.');
});

// ensure uploads directory exists
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, unique + ext);
  },
});

const allowedExt = ['.pdf', '.docx', '.txt', '.csv'];
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedExt.includes(ext)) cb(null, true);
    else cb(new Error('DocDone supports only PDF, DOCX, TXT, and CSV files.'));
  },
});

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function extractText(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === '.pdf') {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);
    return data.text;
  }
  if (ext === '.docx') {
    const data = await mammoth.extractRawText({ path: filePath });
    return data.value;
  }
  if (ext === '.txt' || ext === '.csv') {
    return fs.readFileSync(filePath, 'utf8');
  }
  return '';
}

app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  res.json({
    message: 'File uploaded successfully to DocDone.',
    fileId: req.file.filename,
    originalName: req.file.originalname,
  });
});

app.post('/analyze', async (req, res) => {
  try {
    const { fileId } = req.body;
    if (!fileId) return res.status(400).json({ error: 'fileId required' });
    const filePath = path.join(uploadDir, fileId);
    if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'File not found' });
    const text = await extractText(filePath);
    const prompt = `Summarize the following text and suggest possible output formats (e.g., presentation, calendar, summary):\n\n${text}`;
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
    });
    res.json({
      message: 'Analysis complete.',
      analysis: completion.choices[0].message.content,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DocDone could not analyze your file. Please try again later.' });
  }
});

app.post('/generate', async (req, res) => {
  try {
    const { fileId, goal } = req.body;
    if (!fileId || !goal) {
      return res.status(400).json({ error: 'fileId and goal required' });
    }
    const filePath = path.join(uploadDir, fileId);
    if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'File not found' });
    const text = await extractText(filePath);
    const prompt = `Transform the following text into a ${goal}:\n\n${text}`;
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
    });
    res.json({
      message: `Generated ${goal} successfully.`,
      result: completion.choices[0].message.content,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DocDone could not complete this request. Please try again later.' });
  }
});

const PORT = process.env.PORT || 3000;
app.use((err, req, res, next) => {
  if (err) {
    if (err.message && err.message.includes('DocDone supports only')) {
      return res.status(400).json({ error: err.message });
    }
    console.error(err);
    return res.status(500).json({ error: 'Unexpected server error. Please try again later.' });
  }
  next();
});

app.listen(PORT, () => {
  console.log(`DocDone backend listening on port ${PORT}. Submit files via POST /upload.`);
});

