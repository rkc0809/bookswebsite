const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const { admin } = require('./firebaseConfig');
const postsRoute = require('./routes/posts'); // ✅ Import posts route

const app = express();
dotenv.config();

app.use(express.json());
app.use(cors());

// Use /api/posts instead of general /api
app.use('/api/posts', postsRoute); // ✅ This is now the correct route
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB Error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
