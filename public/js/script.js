window.onload = function () {
 fetch('https://bookswebsite-backend.onrender.com/api/posts')


    .then(response => response.json())
    .then(posts => {
      console.log(posts);
      displayPosts(posts);
    })
    .catch(err => {
      console.log('Error fetching posts:', err);
    });
};

// Load pdf.js library from CDN
const pdfjsLib = window['pdfjs-dist/build/pdf'];
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';

// Function to render posts on the webpage
function displayPosts(posts) {
  const postsContainer = document.getElementById('postsContainer');

  posts.forEach(async post => {
    const postDiv = document.createElement('div');
    postDiv.classList.add('post-card');

    const sliderId = `bookSlider-${post._id}`;
    postDiv.dataset.zoom = "1"; // default zoom

    postDiv.innerHTML = `
      <div class="post-header">
        <span class="username">@${post.username}</span>
      </div>
      <div class="post-header">
        <span class="book-name">Book Name: ${post.title}</span>
      </div>

      <div class="zoom-controls">
        <button onclick="zoomIn('${sliderId}')">🔍 Zoom In</button>
        <button onclick="zoomOut('${sliderId}')">🔎 Zoom Out</button>
      </div>

      <div class="book-slider-wrapper">
        <div class="book-slider" id="${sliderId}" style="transform: scale(1); transition: transform 0.3s;"></div>
      </div>

      <div class="post-actions">
        <button class="icon-btn"><span class="icon">❤️</span> Like</button>
        <button class="icon-btn"><span class="icon">💬</span> Comment</button>
        <button class="icon-btn"><span class="icon">🔖</span> Save</button>
      </div>

      <div class="post-caption">
        <strong>@${post.username}</strong> ${post.caption}
      </div>
    `;

    postsContainer.appendChild(postDiv);

    // Render first page of PDF into book-slider
   renderPDF(`https://bookswebsite-backend.onrender.com${post.pdfUrl}`, sliderId); // ✅ correct

  });
}

// PDF rendering function
async function renderPDF(pdfUrl, containerId) {
  const container = document.getElementById(containerId);

  try {
    const pdf = await pdfjsLib.getDocument(pdfUrl).promise;
    const page = await pdf.getPage(1); // Only render first page for now

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const viewport = page.getViewport({ scale: 1.5 });

    canvas.height = viewport.height;
    canvas.width = viewport.width;

    await page.render({ canvasContext: context, viewport: viewport }).promise;

    const pageDiv = document.createElement('div');
    pageDiv.className = "book-page";
    pageDiv.appendChild(canvas);
    container.appendChild(pageDiv);
  } catch (error) {
    console.error("❌ Error rendering PDF:", error);
    container.innerHTML = "<p style='color:red;'>Failed to load PDF preview</p>";
  }
}

// Zoom functions
function zoomIn(sliderId) {
  const slider = document.getElementById(sliderId);
  if (!slider) return;

  let scale = parseFloat(slider.parentElement.parentElement.dataset.zoom || "1");
  if (scale < 2) {
    scale = Math.min(scale + 0.1, 2);
    slider.style.transform = `scale(${scale})`;
    slider.parentElement.parentElement.dataset.zoom = scale;
  }
}

function zoomOut(sliderId) {
  const slider = document.getElementById(sliderId);
  if (!slider) return;

  let scale = parseFloat(slider.parentElement.parentElement.dataset.zoom || "1");
  if (scale > 0.5) {
    scale = Math.max(scale - 0.1, 0.5);
    slider.style.transform = `scale(${scale})`;
    slider.parentElement.parentElement.dataset.zoom = scale;
  }
}
