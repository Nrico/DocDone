const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const uploadController = require('../controllers/uploadController');
const analyzeController = require('../controllers/analyzeController');
const generateController = require('../controllers/generateController');

const router = express.Router();

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  }
});

const allowedExt = ['.pdf', '.docx', '.txt', '.xlsx'];
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedExt.includes(ext)) cb(null, true);
    else cb(new Error('DocDone only accepts PDF, DOCX, TXT, or XLSX files.'));
  }
});

router.post('/upload', upload.single('file'), uploadController.uploadFile);
router.post('/analyze', analyzeController.analyzeFile);
router.post('/generate', generateController.generateOutput);

module.exports = router;
