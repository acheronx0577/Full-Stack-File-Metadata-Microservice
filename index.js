var express = require('express');
var cors = require('cors');
var multer = require('multer');
var path = require('path');
require('dotenv').config()

var app = express();

// FIX: Use memory storage instead of disk storage for Vercel
var upload = multer({ 
  storage: multer.memoryStorage(), // ← This is the key change
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

app.use(cors());
app.use('/public', express.static(process.cwd() + '/public'));

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

// FIX: Export the app for Vercel instead of using app.listen()
module.exports = app;