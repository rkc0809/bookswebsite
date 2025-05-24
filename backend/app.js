import path from 'path';
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const { admin } = require('./firebaseConfig');
const app = express();
const routes = require('./routes');

app.use('/api', routes); // Prefix all routes with /api
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

dotenv.config(); // To use environment variables

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI,).then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});

// Routes will be added here later

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
