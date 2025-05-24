// frontend/js/dashboard.js
import { auth } from './firebaseConfig.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

onAuthStateChanged(auth, user => {
  if (!user) {
    alert("You must be logged in to upload.");
    window.location.href = "login.html";
    return;
  }

  const uploadForm = document.getElementById('uploadForm');
  const statusDiv = document.getElementById('status');

  uploadForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const title = document.getElementById('title').value.trim();
    const caption = document.getElementById('caption').value.trim();
    const file = document.getElementById('pdfFile').files[0];

    if (!title || !caption || !file) {
      alert("All fields are required.");
      return;
    }

    const username = user.email.split('@')[0];
    const formData = new FormData();
    formData.append('title', title);
    formData.append('caption', caption);
    formData.append('username', username);
    formData.append('pdf', file); // key must match backend's multer.single("pdf")

    try {
      const response = await fetch('https://bookswebsite.onrender.com/api/posts', {
        method: 'POST',
        body: formData // do not set Content-Type manually
      });

      const data = await response.json();
      if (response.ok) {
        statusDiv.innerText = "✅ Book uploaded successfully!";
        uploadForm.reset();
      } else {
        throw new Error(data.message || "Upload failed.");
      }
    } catch (err) {
      console.error("Upload error:", err);
      statusDiv.innerText = `❌ ${err.message}`;
    }
  });
});
