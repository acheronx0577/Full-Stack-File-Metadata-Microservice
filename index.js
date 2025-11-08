var express = require('express');
var cors = require('cors');
var multer = require('multer');

var app = express();
var upload = multer({ storage: multer.memoryStorage() });

app.use(cors());
app.use('/public', express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

app.post('/api/fileanalyse', upload.single('upfile'), (req, res) => {
  if (!req.file) return res.json({ error: 'No file' });
  
  res.json({
    name: req.file.originalname,
    type: req.file.mimetype,
    size: req.file.size
  });
});

module.exports = app;