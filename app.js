document.addEventListener('DOMContentLoaded', () => {
    // Load movies data from localStorage or use default
    const savedMoviesData = JSON.parse(localStorage.getItem('moviesData'));
    if (savedMoviesData) {
        window.moviesData = savedMoviesData;
    }

    // Initialize trending movies
    const trendingList = document.querySelector('.trending-list');
    if (trendingList) {
        moviesData.trending.forEach(movie => {
            const movieCard = createMovieCard(movie);
            trendingList.appendChild(movieCard);
        });
    }

    // Initialize continue watching
    const continueWatchingList = document.querySelector('.continue-watching-list');
    if (continueWatchingList) {
        moviesData.continueWatching.forEach(movie => {
            const movieCard = createContinueWatchingCard(movie);
            continueWatchingList.appendChild(movieCard);
        });
    }

    // Initialize featured movie
    initializeFeaturedMovie();

    // Initialize scroll animations
    const scrollAnimator = new ScrollAnimator();
    scrollAnimator.observeAll();

    // Initialize video player
    const videoPlayer = new VideoPlayer();

    // Setup featured teaser
    function setupFeaturedTeaser() {
        const teaserContainer = document.getElementById('featuredTeaser');
        const video = teaserContainer.querySelector('video');
        const fallbackImage = teaserContainer.querySelector('img');

        try {
            // Show video and hide image when video can play
            video.addEventListener('canplay', () => {
                video.classList.add('opacity-100');
                fallbackImage.classList.add('opacity-0');
                video.play().catch(error => {
                    console.log('Autoplay failed:', error);
                    // Show play button or fallback image
                    fallbackImage.classList.remove('opacity-0');
                });
            });

            // Handle video errors
            video.addEventListener('error', () => {
                console.log('Video failed to load, showing fallback image');
                video.classList.add('hidden');
                fallbackImage.classList.remove('opacity-0');
            });

            // Force video load
            video.load();
        } catch (error) {
            console.log('Video setup failed:', error);
            fallbackImage.classList.remove('opacity-0');
        }

        // Pause video when out of viewport
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        video.play().catch(console.log);
                    } else {
                        video.pause();
                    }
                });
            },
            { threshold: 0.5 }
        );
        observer.observe(teaserContainer);
    }

    // Handle play button click
    document.getElementById('playButton').addEventListener('click', () => {
        videoPlayer.playVideo(moviesData.featured);
    });

    // Render Trending section
    function displayTrendingMovies() {
        const trendingList = document.querySelector('.trending-list');
        if (!trendingList) return;

        // Clear existing content
        trendingList.innerHTML = '';

        // Get movies from localStorage or use default
        const savedData = JSON.parse(localStorage.getItem('moviesData'));
        const movies = savedData?.trending || [];

        // Create and append movie cards
        movies.forEach(movie => {
            const movieCard = createMovieCard(movie);
            trendingList.appendChild(movieCard);
        });
    }

    // Toast notification function
    function showToast(message) {
        const toast = document.createElement('div');
        toast.className = `fixed bottom-24 left-1/2 transform -translate-x-1/2 
                          bg-purple-500 text-white px-4 py-2 rounded-lg 
                          toast-enter
                          flex items-center gap-2 shadow-lg`;
        toast.innerHTML = `
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
            </svg>
            ${message}
        `;
        document.body.appendChild(toast);
        
        // Fade in
        requestAnimationFrame(() => {
            toast.style.opacity = '1';
        });
        
        // Updated removal animation
        setTimeout(() => {
            toast.classList.remove('toast-enter');
            toast.classList.add('toast-exit');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    displayTrendingMovies();

    // Initialize teaser
    setupFeaturedTeaser();
});

function createMovieCard(movie) {
    const div = document.createElement('div');
    div.className = 'movie-card animate-item';
    div.innerHTML = `
        <a href="movie-details.html?id=${movie.id}" class="block relative group">
            <img src="${movie.thumbnail}" alt="${movie.title}" 
                 class="w-full aspect-[2/3] object-cover rounded-lg">
            <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity 
                        flex items-center justify-center">
                <span class="text-white font-semibold">${movie.title}</span>
            </div>
        </a>
    `;
    return div;
}

function createContinueWatchingCard(movie) {
    const movieEl = document.createElement('div');
    movieEl.className = 'flex-shrink-0 relative w-48 cursor-pointer animate-item';
    movieEl.innerHTML = `
        <a href="movie-details.html?id=${movie.id}" class="block">
            <img src="${movie.thumbnail}" alt="${movie.title}" class="w-full h-32 object-cover rounded-lg">
            <div class="absolute bottom-0 w-full p-2 bg-gradient-to-t from-black to-transparent">
                <h3 class="text-sm font-semibold">${movie.title}</h3>
                <div class="flex items-center justify-between">
                    <span class="text-xs text-gray-400">${movie.duration}</span>
                    <div class="h-1 w-24 bg-gray-700 rounded">
                        <div class="h-full bg-purple-600 rounded" style="width: ${movie.progress}%"></div>
                    </div>
                </div>
            </div>
        </a>
    `;
    return movieEl;
}

function initializeFeaturedMovie() {
    const featured = moviesData.featured;
    if (!featured) return;

    // Update featured movie details
    document.querySelector('.title-animate').textContent = featured.title;
    
    // Update rating and genres
    const genresEl = document.querySelector('.desc-animate').parentElement;
    if (genresEl) {
        genresEl.innerHTML = `
            <span class="text-yellow-400 desc-animate">★</span>
            <span class="desc-animate">${featured.rating}</span>
            <span>•</span>
            ${featured.genres.map(genre => `
                <span class="text-sm desc-animate">${genre}</span>
            `).join('<span>•</span>')}
        `;
    }

    // Update featured video if available
    const video = document.querySelector('#featuredTeaser video');
    if (video && featured.video) {
        video.src = featured.video;
    }
} 