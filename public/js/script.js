document.addEventListener("DOMContentLoaded", () => {
  const postsContainer = document.getElementById("postsContainer");
  const baseURL = "https://bookswebsite-backend.onrender.com"; // Your backend URL

  // Setup PDF.js worker
  pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js";

  // Fetch posts from backend
  async function fetchPosts() {
    try {
      const response = await fetch(`${baseURL}/api/posts`);
      const posts = await response.json();

      postsContainer.innerHTML = ""; // Clear old posts

      posts.forEach(post => {
        renderPost(post);
      });
    } catch (err) {
      console.error("Failed to fetch posts:", err);
      postsContainer.innerHTML = "<p>Failed to load posts.</p>";
    }
  }

  // Render a single post
  function renderPost(post) {
    const postDiv = document.createElement("div");
    postDiv.classList.add("post");

    const header = `<div class="post-header"><strong>${post.username}</strong></div>`;
    const caption = `<div class="post-caption"><strong>${post.username}</strong> ${post.caption}</div>`;

    const pdfContainer = document.createElement("div");
    pdfContainer.classList.add("pdf-container");

    postDiv.innerHTML = header;
    postDiv.appendChild(pdfContainer);
    postDiv.innerHTML += `
      <div class="post-actions">
        <span>❤️</span> <span>💬</span> <span>🔖</span>
      </div>
      ${caption}
    `;

    postsContainer.appendChild(postDiv);

    renderPDF(post.pdfUrl, pdfContainer);
  }

  // Render PDF pages
  async function renderPDF(url, container) {
    try {
      const loadingTask = pdfjsLib.getDocument(url);
      const pdf = await loadingTask.promise;

      for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
        const page = await pdf.getPage(pageNumber);
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        const viewport = page.getViewport({ scale: 1.2 });
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({ canvasContext: context, viewport }).promise;
        container.appendChild(canvas);
      }
    } catch (err) {
      console.error("Error rendering PDF:", err);
      container.innerHTML = "<p>Failed to render PDF.</p>";
    }
  }

  fetchPosts();
});
