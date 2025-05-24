// db.js
const { MongoClient } = require('mongodb');

// Replace with your MongoDB connection string
const uri = "mongodb://127.0.0.1:27017/bbookswebsite";

async function connectDB() {
  try {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    console.log("Connected to MongoDB");
    
    // Select the database and collection
    const db = client.db("bbookswebsite");
    const postsCollection = db.collection("posts");

    // Example: Insert a document
    const result = await postsCollection.insertOne({ title: "Sample Book", author: "John Doe" });
    console.log("Document inserted with _id:", result.insertedId);

    return client;  // Keep the connection alive
  } catch (err) {
    console.error("Failed to connect to MongoDB:", err);
  }
}

connectDB();
