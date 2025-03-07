const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Define the upload directory inside the public folder
const uploadDir = path.join(__dirname, "../public/uploads/");

// Ensure the directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir); // Store files in public/uploads/
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  }
});

// Multer upload middleware (No file size limit)
const upload = multer({ storage });

module.exports = upload;
