// backend/routes/posts.js
import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import Post from '../models/Post.js';

const router = express.Router();

// Ensure uploads directory exists
const uploadDir = path.join('uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Multer storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Save to uploads/ folder
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

// ✅ POST route to upload post with PDF
router.post("/", upload.single("pdf"), async (req, res) => {
  try {
    if (!req.file) {
      throw new Error("PDF file not provided");
    }

    const { title, caption, username } = req.body;

    const pdfUrl = `/uploads/${req.file.filename}`;
    const post = new Post({ title, caption, username, pdfUrl });
    await post.save();

    res.status(201).json({ message: "Post uploaded", post });
  } catch (err) {
    console.error("❌ Upload Error:", err); // 👈 log full error
    res.status(500).json({ message: err.message });
  }
});

// ✅ GET route to retrieve posts
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    console.error("❌ Fetch Error:", err);
    res.status(500).json({ message: "Failed to fetch posts" });
  }
});

export default router;
