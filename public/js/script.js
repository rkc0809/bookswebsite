document.addEventListener("DOMContentLoaded", () => {
  const postsContainer = document.getElementById("postsContainer");
  const baseURL = "https://bookswebsite-backend.onrender.com"; // Your backend URL

  // PDF.js worker setup
  pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';

  // Fetch all posts from the backend
  async function fetchPosts() {
    try {
      const response = await fetch(`${baseURL}/api/posts`);
      const posts = await response.json();
      console.log("Posts from API:", posts);

      postsContainer.innerHTML = ""; // Clear previous posts

      posts.forEach(post => {
        console.log("Rendering Post:", post);
        renderPost(post); // Make sure this is AFTER renderPDF is defined
      });
    } catch (error) {
      console.error("Error fetching posts:", error);
      postsContainer.innerHTML = "<p>Error loading posts.</p>"; // Display error on UI
    }
  }

  // Render a single post
  function renderPost(post) {
    const postDiv = document.createElement("div");
    postDiv.classList.add("post");

    const postHeader = `<div class="post-header"><strong>${post.username}</strong></div>`;
    const postCaption = `<div class="post-caption"><strong>${post.username}</strong> ${post.caption}</div>`;

    const pdfContainer = document.createElement("div");
    pdfContainer.classList.add("pdf-container");

    postDiv.innerHTML = postHeader;
    postDiv.appendChild(pdfContainer);
    postDiv.innerHTML += `
      <div class="post-actions">
        <span>❤️</span> <span>💬</span> <span>🔖</span>
      </div>
      ${postCaption}
    `;

    postsContainer.appendChild(postDiv);

    const pdfUrl = post.pdfUrl; // Directly use the Cloudinary URL stored in MongoDB
    console.log("PDF URL:", pdfUrl);

    renderPDF(pdfUrl, pdfContainer); // This function MUST be defined before this call
  }

  // ✅ Define this function BEFORE you call it
  async function renderPDF(url, container) {
    try {
      const pdf = await pdfjsLib.getDocument(url).promise;
      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        const viewport = page.getViewport({ scale: 1.2 });

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({ canvasContext: context, viewport: viewport }).promise;
        container.appendChild(canvas);
      }
    } catch (error) {
      console.error("Error rendering PDF:", error);
      container.innerHTML = "<p>Error rendering PDF.</p>"; // Display error on UI
    }
  }

  // Start everything
  fetchPosts();
});
