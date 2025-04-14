const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Upload directory (outside project folder)
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Allowed extensions and MIME types
const allowedExtensions = /\.(jpeg|jpg|png|gif|mp4|mov|avi|mkv|hevc|webm)$/i;
const allowedMimeTypes = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'video/mp4',
  'video/quicktime',    // for .mov (HEVC or H.264)
  'video/x-msvideo',    // for .avi
  'video/x-matroska',   // for .mkv
  'video/webm',
  'video/hevc',         // some platforms may use this
];

// File filter
const fileFilter = (req, file, cb) => {
  const extname = allowedExtensions.test(path.extname(file.originalname).toLowerCase());
  const mimetypeAllowed = allowedMimeTypes.includes(file.mimetype.toLowerCase());

  console.log(`📦 File: ${file.originalname} | MIME: ${file.mimetype}`); // Debug log

  if (extname && mimetypeAllowed) {
    cb(null, true);
  } else {
    cb(new Error(`Unsupported file type: ${file.originalname}`));
  }
};

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

const upload = multer({ storage, fileFilter });

// Upload route
app.post('/upload', upload.array('photo', 10000), (req, res) => {
  if (req.files && req.files.length > 0) {
    return res.status(200).send('Files uploaded successfully!');
  }
  return res.status(400).send('Error: No files uploaded');
});

// Serve HTML upload page (optional)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Global error handler
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError || err.message.includes('Unsupported file type')) {
    return res.status(400).json({ error: err.message });
  }
  console.error('Server Error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});