var express = require('express');
var cors = require('cors');
var multer = require('multer');
var path = require('path');
require('dotenv').config()

var app = express();

// Configure multer for file uploads - use memory storage
var upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

app.use(cors());
// Serve static files from public folder at root URL
app.use(express.static(process.cwd() + '/public'));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// File upload endpoint
app.post('/api/fileanalyse', upload.single('upfile'), function (req, res) {
  try {
    if (!req.file) {
      return res.json({ error: 'No file uploaded' });
    }

    const { originalname, mimetype, size } = req.file;
    
    res.json({
      name: originalname,
      type: mimetype,
      size: size
    });
  } catch (error) {
    res.json({ error: 'Error processing file' });
  }
});

const port = process.env.PORT || 3000;

// Check if we're running on Vercel or locally
if (process.env.VERCEL) {
  // Export for Vercel
  module.exports = app;
} else {
  // Start server for local development
  app.listen(port, function () {
    console.log('Your app is listening on port ' + port);
    console.log('Visit: http://localhost:' + port);
  });
}