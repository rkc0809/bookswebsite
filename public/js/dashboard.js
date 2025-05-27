// dashboard.js
import { auth } from './firebaseConfig.js'; // Import Firebase auth

document.getElementById('uploadForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  // Check if the user is logged in
  const user = auth.currentUser;
  
  if (!user) {
    alert('Please log in to upload a post.');
    return;
  }

  const caption = document.getElementById('caption').value;
  const pdfFile = document.getElementById('pdfFile').files[0];

  if (!pdfFile) {
    alert('Please select a PDF file');
    return;
  }

  const username = user.displayName || user.email || 'Anonymous';
  const formData = new FormData();
  formData.append('caption', caption);
  formData.append('username', username);
  formData.append('pdf', pdfFile);  // Ensure 'pdf' matches the backend multer key

  try {
    const res = await fetch('https://bookswebsite-backend.onrender.com/api/posts', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();

    if (res.ok) {
      document.getElementById('uploadStatus').innerText = '✅ Upload successful!';
      console.log('Post saved:', data.post);
      // Optionally: refresh posts feed
    } else {
      document.getElementById('uploadStatus').innerText = `❌ Error: ${data.error || data.message}`;
    }
  } catch (error) {
    console.error('Upload failed:', error);
    document.getElementById('uploadStatus').innerText = '❌ Upload failed.';
  }
});
