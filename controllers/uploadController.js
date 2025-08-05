// Handle uploaded file and respond with its metadata
exports.uploadFile = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  res.json({
    message: 'File uploaded successfully.',
    fileId: req.file.filename,
    originalName: req.file.originalname,
  });
};
