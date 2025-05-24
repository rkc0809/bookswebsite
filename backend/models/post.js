// backend/models/Post.js
import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  title: String,
  caption: String,
  username: String,
  pdfUrl: String,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Post", postSchema);
