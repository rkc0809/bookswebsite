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
    console.log('Incoming body:', req.body);

    if (!req.file) {
      return res.status(400).json({ message: 'No PDF file uploaded' });
    }

    const filePath = req.file.path;
    console.log('Uploading file at:', filePath);

    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: 'auto',
      public_id: `post/${Date.now()}`,
    });

    console.log('Cloudinary result:', result);

    if (!result.secure_url) {
      fs.unlinkSync(filePath);
      return res.status(500).json({ message: 'Failed to upload PDF to Cloudinary' });
    }

    fs.unlinkSync(filePath);

    const newPost = new Post({
      title,
      caption,
      username,
      pdfUrl: result.secure_url,
    });

    console.log('Saving post:', newPost);

    await newPost.save();

    res.status(201).json({
      message: 'Post uploaded successfully',
      post: newPost,
    });
  } catch (err) {
    console.error('❌ Error uploading post:', err);
    res.status(500).json({
      message: 'Error saving post',
      error: err.message,
    });
  }
});


module.exports = router;
