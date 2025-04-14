const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Ensure uploads directory exists outside the project folder
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Allowed file extensions (images and videos including iPhone formats)
const allowedTypes = /jpeg|jpg|png|gif|mp4|mov|avi|mkv|hevc|webm/;

// File filter to allow only specific media types
const fileFilter = (req, file, cb) => {
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype.toLowerCase());

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Only image and video files are allowed (e.g. .jpg, .png, .mp4, .mov, .hevc)'));
  }
};

// Configure Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  }
});

const upload = multer({ storage, fileFilter });

// Upload route
app.post('/upload', upload.array('photo', 10000), (req, res) => {
  if (req.files && req.files.length > 0) {
    res.send('Files uploaded successfully!');
  } else {
    res.status(400).send('Error: No files uploaded');
  }
});

// Serve upload form (optional)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Global error handler for Multer
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError || err.message.includes('Only image and video')) {
    return res.status(400).send({ error: err.message });
  }
  next(err);
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});