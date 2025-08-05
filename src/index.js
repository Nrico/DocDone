const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(express.json());

// Attempt to use the cors package; fall back to manual headers if unavailable
let cors;
try {
  cors = require('cors');
  app.use(cors());
} catch (e) {
  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
  });
}

// Serve static frontend files
app.use(express.static(path.join(__dirname, '..', 'public')));

// API routes handling upload/analyze/generate
const apiRoutes = require('../routes/api');
app.use('/api', apiRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`DocDone backend listening on port ${PORT}`);
});
