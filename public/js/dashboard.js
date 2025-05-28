// dashboard.js
import { auth } from './firebaseConfig.js';

document.addEventListener('DOMContentLoaded', () => {
  const uploadForm = document.getElementById('uploadForm');
  const uploadStatus = document.getElementById('uploadStatus');

  uploadForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const user = auth.currentUser;
    if (!user) {
      alert('Please log in to upload a post.');
      return;
    }

    const title = document.getElementById('title').value.trim();
    const caption = document.getElementById('caption').value.trim();
    const pdfFile = document.getElementById('pdfFile').files[0];

    if (!title || !caption || !pdfFile) {
      alert('All fields are required including a PDF.');
      return;
    }

    const username = user.displayName || user.email || 'Anonymous';

    const formData = new FormData();
    formData.append('title', title);       // ✅ Ensure this matches backend
    formData.append('caption', caption);
    formData.append('username', username);
    formData.append('pdf', pdfFile);       // ✅ Must match 'pdf' in multer.single('pdf')
    console.log('Uploading post with:', {
  title, caption, username, pdfFile
});


    try {
      const res = await fetch('https://bookswebsite-backend.onrender.com/api/posts', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        console.log('Upload successful:', data);
        uploadStatus.innerText = '✅ Upload successful!';
        uploadForm.reset();
      } else {
        console.error('Error response:', data);
        uploadStatus.innerText = `❌ Error: ${data.message || 'Unknown error occurred.'}`;
      }
    } catch (error) {
      console.error('Upload failed:', error);
      uploadStatus.innerText = '❌ Upload failed due to network or server error.';
    }
  });
});
