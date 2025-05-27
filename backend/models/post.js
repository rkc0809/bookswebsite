// backend/models/post.js
const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: String,
  caption: String,
  username: String,
  pdfUrl: String,
}, { timestamps: true });

module.exports = mongoose.model('Post', postSchema);
