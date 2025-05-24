const express = require('express');
const Post = require('./model');
const router = express.Router();

// Create a new post
router.post('/create', async (req, res) => {
  const { username, bookName, caption, pdfUrl } = req.body;

  const newPost = new Post({
    username,
    bookName,
    caption,
    pdfUrl,
  });

  try {
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    res.status(500).json({ message: 'Error creating post', error });
  }
});

// Get all posts
router.get('/posts', async (req, res) => {
  try {
    const posts = await Post.find();
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching posts', error });
  }
});

module.exports = router;
