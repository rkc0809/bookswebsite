const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cloudinary = require('../cloud'); // your cloud.js file where Cloudinary configuration is stored
const Post = require('../models/post'); // your MongoDB Post model

// Set up Multer storage for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Make sure 'uploads/' folder exists
  },
  filename: function (req, file, cb) {
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext);

    // ✅ Replace spaces with hyphens in the filename
    const sanitizedBaseName = baseName.replace(/\s+/g, '-');

    cb(null, `${timestamp}-${sanitizedBaseName}${ext}`);
  },
});

const upload = multer({ storage: storage });

// POST route to upload PDF, store in Cloudinary, and save post to MongoDB
router.post('/', upload.single('pdf'), async (req, res) => {
  try {
    // Extract data from the request
    const { title, caption, username } = req.body;
    const filePath = req.file.path; // Path of the uploaded file

    // Upload PDF to Cloudinary
    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: 'auto', // Cloudinary automatically detects the file type
      public_id: `post/${Date.now()}`, // Optionally, specify a unique public ID for the file
    });

    // Delete the local file after uploading it to Cloudinary
    fs.unlinkSync(filePath);

    // Create a new post document with the Cloudinary PDF URL
    const newPost = new Post({
      title,
      caption,
      username,
      pdfUrl: result.secure_url, // Store the Cloudinary URL in the MongoDB document
    });

    // Save the new post to MongoDB
    await newPost.save();

    // Respond with success message and the new post data
    res.status(201).json({ message: 'Post uploaded successfully', post: newPost });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong uploading post' });
  }
});

module.exports = router;
