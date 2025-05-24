// backend/server.js
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import postRoutes from './routes/posts.js'; // ✅ Ensure this file exists

const app = express();

// Support for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());

// Serve uploaded PDFs correctly from absolute path
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Test route to avoid 404 on home
app.get('/', (req, res) => {
  res.send('✅ Server is up and running!');
});

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/bookwebsite", {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("✅ Connected to MongoDB");
}).catch(err => {
  console.error("❌ MongoDB connection error:", err);
});

// API routes
app.use('/api/posts', postRoutes);

// Start the server
app.listen(5000, () => {
  console.log("🚀 Server running on http://localhost:5000");
});
