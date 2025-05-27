// routes/posts.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cloudinary = require('../cloud'); // Cloudinary config
const Post = require('../models/post'); // Post model

const router = express.Router();

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    const sanitized = path.basename(file.originalname, ext).replace(/\s+/g, '-');
    cb(null, `${timestamp}-${sanitized}${ext}`);
  },
});

const upload = multer({ storage });

router.post('/', upload.single('pdf'), async (req, res) => {
  try {
    const { title, caption, username } = req.body;
    const filePath = req.file.path;

    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: 'auto',
      public_id: `post/${Date.now()}`,
    });

    fs.unlinkSync(filePath); // Delete local file

    const newPost = new Post({
      title,
      caption,
      username,
      pdfUrl: result.secure_url,
    });

    await newPost.save();

    res.status(201).json({
      message: 'Post uploaded successfully',
      post: newPost,
    });
  } catch (err) {
    console.error('Error uploading post:', err);
    res.status(500).json({
      message: 'Something went wrong uploading the post',
      error: err.message,
    });
  }
});

module.exports = router;
