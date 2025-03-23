// YouTube API Key
const YOUTUBE_API_KEY = 'AIzaSyAkB2OdXYrF47QhtkgDqqjc9mGca3TfAGQ'; // Replace with your YouTube API key

// Mock Article API (Replace with a real API if available)
const ARTICLES_API_URL = '9898f61751134b71a6966eb4b679c56c'; // Mock API for articles

// Local articles as a fallback
const localArticles = [
    {
      id: 1,
      title: "Understanding SDGs",
      body: "The Sustainable Development Goals (SDGs) are a collection of 17 global goals set by the United Nations. They address global challenges such as poverty, inequality, climate change, and environmental degradation.",
      image: "https://tse3.mm.bing.net/th?id=OIP.xW-6d-KKRJmzKDBb-BbYtwHaDw&pid=Api&P=0&h=180" // Add image URL
    },
    {
      id: 2,
      title: "Climate Change Solutions",
      body: "Climate change is one of the most pressing issues of our time. Innovative solutions include renewable energy, sustainable agriculture, and reforestation.",
      image: "https://tse2.mm.bing.net/th?id=OIP.x-FqDP_ktZ_LVwrDDjnWNQHaEO&pid=Api&P=0&h=180" // Add image URL
    }
  ];

// Function to fetch articles
function fetchArticles(query = '') {
  fetch(ARTICLES_API_URL)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      const filteredArticles = data.filter(article =>
        article.title.toLowerCase().includes(query.toLowerCase())
      );
      displayArticles(filteredArticles);
    })
    .catch(error => {
      console.error('Error fetching articles:', error);
      // Use local articles as a fallback
      const filteredArticles = localArticles.filter(article =>
        article.title.toLowerCase().includes(query.toLowerCase())
      );
      displayArticles(filteredArticles);
    });
}

// Function to display articles
function displayArticles(articles) {
    console.log('Articles:', articles); // Debugging line
    const articleContainer = document.querySelector('.articles');
    articleContainer.innerHTML = ''; // Clear existing content
  
    if (articles.length === 0) {
      const noResultsMessage = document.createElement('p');
      noResultsMessage.textContent = 'No articles found.';
      articleContainer.appendChild(noResultsMessage);
      return;
    }
  
    articles.forEach(article => {
      const articleElement = `
        <div class="article-card">
          <img src="${article.image}" alt="${article.title}">
          <h3>${article.title}</h3>
          <p>${article.body.slice(0, 100)}...</p>
          <button class="read-more" data-article='${JSON.stringify(article)}'>Read More</button>
        </div>
      `;
      articleContainer.insertAdjacentHTML('beforeend', articleElement);
    });
  
    // Add event listeners to "Read More" buttons
    document.querySelectorAll('.read-more').forEach(button => {
      button.addEventListener('click', () => {
        const article = JSON.parse(button.getAttribute('data-article'));
        openArticleModal(article);
      });
    });
  }

// Function to open article modal
function openArticleModal(article) {
    const modal = document.getElementById('article-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalImage = document.getElementById('modal-image');
    const modalContent = document.getElementById('modal-content');
  
    modalTitle.textContent = article.title;
    modalImage.src = article.image; // Set the article image
    modalContent.textContent = article.body;
    modal.style.display = 'flex';
  }

// Function to fetch YouTube videos
function fetchVideos(query = 'upcycling tutorials') {
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&maxResults=6&type=video&key=${YOUTUBE_API_KEY}`;

  console.log('Fetching videos from:', url); // Debugging line

  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      console.log('YouTube API Response:', data); // Debugging line
      const videos = data.items;
      displayVideos(videos);
    })
    .catch(error => {
      console.error('Error fetching videos:', error);
      // Display a fallback message
      const fallbackMessage = document.createElement('p');
      fallbackMessage.textContent = 'Failed to load videos. Please try again later.';
      document.querySelector('.youtube-videos').appendChild(fallbackMessage);
    });
}

// Function to display YouTube videos
function displayVideos(videos) {
  console.log('Videos:', videos); // Debugging line
  const videoContainer = document.querySelector('.youtube-videos');
  videoContainer.innerHTML = ''; // Clear existing content

  if (videos.length === 0) {
    const noResultsMessage = document.createElement('p');
    noResultsMessage.textContent = 'No videos found.';
    videoContainer.appendChild(noResultsMessage);
    return;
  }

  videos.forEach(video => {
    const videoId = video.id.videoId;
    const title = video.snippet.title;

    const videoElement = `
      <div class="youtube-video">
        <iframe src="https://www.youtube.com/embed/${videoId}" allowfullscreen></iframe>
        <div class="video-info">
          <h3>${title}</h3>
        </div>
      </div>
    `;
    videoContainer.insertAdjacentHTML('beforeend', videoElement);
  });
}

// Function to handle article search
function handleArticleSearch() {
  const searchInput = document.getElementById('article-search-input');
  const query = searchInput.value.trim();
  fetchArticles(query);
}

// Function to handle video search
function handleVideoSearch() {
  const searchInput = document.getElementById('video-search-input');
  const query = searchInput.value.trim();
  fetchVideos(query);
}

// Add event listeners to search buttons
document.getElementById('article-search-button').addEventListener('click', handleArticleSearch);
document.getElementById('video-search-button').addEventListener('click', handleVideoSearch);

// Add event listeners to search inputs for "Enter" key
document.getElementById('article-search-input').addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {
    handleArticleSearch();
  }
});

document.getElementById('video-search-input').addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {
    handleVideoSearch();
  }
});

// Fetch default articles and videos when the page loads
fetchArticles();
fetchVideos();

// Light/Dark Mode Toggle
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

themeToggle.addEventListener('click', () => {
  body.classList.toggle('dark-mode');
  themeToggle.textContent = body.classList.contains('dark-mode') ? '☀️' : '🌙';
});

// Modal Functionality
const modal = document.getElementById('article-modal');
const closeModal = document.querySelector('.close');

// Close modal when the close button is clicked
closeModal.addEventListener('click', () => {
  modal.style.display = 'none';
});

// Close modal when clicking outside the modal
window.addEventListener('click', (event) => {
  if (event.target === modal) {
    modal.style.display = 'none';
  }
});