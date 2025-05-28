const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files (PDFs) with CORS headers
app.use('/uploads', (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
}, express.static(path.join(__dirname, 'uploads')));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Mongoose schema and model
const postSchema = new mongoose.Schema({
  username: String,
  caption: String,
  pdfUrl: String,
});

const Post = mongoose.model('Post', postSchema);

// Multer setup for PDF upload
const storage = multer.diskStorage({
  destination: path.join(__dirname, 'uploads'),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

// Route to upload a new post
app.post('/api/posts', upload.single('pdf'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No PDF file uploaded' });
  }

  const pdfUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

  const newPost = new Post({
    username: req.body.username,
    caption: req.body.caption,
    pdfUrl: pdfUrl,
  });

  newPost.save()
    .then(post => res.json(post))
    .catch(err => {
      console.error("Error saving post:", err);
      res.status(500).json({ error: "Error saving post" });
    });
});

// Route to get all posts
app.get('/api/posts', async (req, res) => {
  try {
    const posts = await Post.find().sort({ _id: -1 });
    res.json(posts);
  } catch (err) {
    console.error("Error fetching posts:", err);
    res.status(500).json({ error: "Error fetching posts" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
