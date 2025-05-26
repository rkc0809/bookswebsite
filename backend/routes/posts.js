const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cloudinary = require('../cloud'); // your cloud.js file
const Post = require('../models/post'); // your MongoDB Post model

// Set up Multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Make sure 'uploads/' folder exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

router.post('/', upload.single('pdf'), async (req, res) => {
  try {
    const { title, caption, username } = req.body;
    const filePath = req.file.path;

    // ✅ Upload to Cloudinary
    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: 'auto',
    });

    // Delete local file after upload
    fs.unlinkSync(filePath);

    // ✅ Save to MongoDB
    const newPost = new Post({
      title,
      caption,
      username,
      pdfUrl: result.secure_url, // Store Cloudinary URL
    });

    await newPost.save();

    res.status(201).json({ message: 'Post uploaded successfully', post: newPost });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong uploading post' });
  }
});

module.exports = router;
