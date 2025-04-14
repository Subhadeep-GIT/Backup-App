const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Define storage for Multer with external uploads directory
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Path to the external uploads directory (outside the project folder)
    const uploadDir = path.join(__dirname, '..', 'uploads');  // Adjusted to the 'uploads' folder outside the project

    // Create the directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    cb(null, uploadDir);  // Set the destination path
  },
  filename: (req, file, cb) => {
    // Use a unique name for each uploaded file
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({ storage });

// Route to handle file upload
app.post('/upload', upload.array('photo', 10000), (req, res) => {
  if (req.files) {
    res.send('Files uploaded successfully!');
  } else {
    res.status(400).send('Error: No files uploaded');
  }
});

// Serve the upload form
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});