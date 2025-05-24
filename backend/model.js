const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  username: { type: String, required: true },
  bookName: { type: String, required: true },
  caption: String,
  pdfUrl: String, // Store URL or path to the PDF
  likes: { type: Number, default: 0 },
  comments: [
    {
      user: String,
      text: String,
      timestamp: { type: Date, default: Date.now },
    },
  ],
  savedBy: [String], // Array of usernames who saved the post
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
