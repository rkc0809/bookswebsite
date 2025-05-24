// backend/server.js
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import postRoutes from './routes/posts.js'; // ✅ Ensure this file exists

// Load environment variables
dotenv.config();

const app = express();

// Support for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());

// Serve uploaded PDFs correctly
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Home test route
app.get('/', (req, res) => {
  res.send('✅ Server is up and running!');
});

// ✅ Connect to MongoDB Atlas using environment variable
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("✅ Connected to MongoDB Atlas");
}).catch(err => {
  console.error("❌ MongoDB connection error:", err);
});

// API routes
app.use('/api/posts', postRoutes);

// Start the server
app.listen(5000, () => {
  console.log("🚀 Server running on http://localhost:5000");
});
