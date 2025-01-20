document.addEventListener('DOMContentLoaded', () => {
    // Initialize Swiper
    const swiper = new Swiper('.swiper', {
        slidesPerView: 1,
        spaceBetween: 30,
        loop: true,
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
    });

    // Image zoom functionality
    const imageModal = document.getElementById('imageModal');
    const zoomedImage = document.getElementById('zoomedImage');
    const closeModal = document.getElementById('closeModal');
    const movieImages = document.querySelectorAll('.movie-image');

    movieImages.forEach(img => {
        img.addEventListener('click', () => {
            zoomedImage.src = img.src;
            imageModal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        });
    });

    closeModal.addEventListener('click', () => {
        imageModal.classList.add('hidden');
        document.body.style.overflow = 'auto';
    });

    imageModal.addEventListener('click', (e) => {
        if (e.target === imageModal) {
            imageModal.classList.add('hidden');
            document.body.style.overflow = 'auto';
        }
    });

    // Get movie ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const movieId = urlParams.get('id');

    // Find movie data
    function findMovie(id) {
        const allMovies = [
            ...moviesData.trending,
            ...moviesData.continueWatching,
            moviesData.featured
        ].filter(Boolean);
        
        return allMovies.find(m => m.id === parseInt(id));
    }

    function updateMovieDetails(movie) {
        const movieInfo = document.querySelector('.movie-info');
        movieInfo.classList.add('movie-info-enter');

        // Update page title
        document.title = `${movie.title} - Movie Magic`;

        // Update backdrop
        const backdrop = document.getElementById('movieBackdrop');
        backdrop.src = movie.image;
        backdrop.alt = movie.title;

        // Update basic info
        document.getElementById('movieTitle').textContent = movie.title;
        document.getElementById('movieYear').textContent = movie.year || movie.releaseYear;
        document.getElementById('movieDuration').textContent = movie.duration;
        document.getElementById('movieRating').textContent = movie.rating;
        document.getElementById('movieDescription').textContent = movie.description;

        // Update genres
        const genresList = document.getElementById('genresList');
        genresList.innerHTML = movie.genres.map(genre => 
            `<span class="px-3 py-1 bg-[#28303D] rounded-full text-sm">${genre}</span>`
        ).join('');

        // Update save button state
        const saveButton = document.getElementById('saveButton');
        saveButton.innerHTML = `
            <svg class="w-6 h-6" fill="${movie.isSaved ? 'currentColor' : 'none'}" 
                 stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
            </svg>
        `;
        saveButton.className = `p-2 ${movie.isSaved ? 'text-purple-500' : 'text-gray-400 hover:text-purple-500'}`;

        // Handle save button click
        saveButton.addEventListener('click', () => {
            movie.isSaved = !movie.isSaved;
            updateMovieDetails(movie);
            showToast(movie.isSaved ? 'Added to saved' : 'Removed from saved');
        });
    }

    function showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-lg';
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }

    // Load movie details
    const movie = findMovie(movieId);
    if (movie) {
        updateMovieDetails(movie);
    } else {
        // Handle movie not found
        window.location.href = 'index.html';
    }
});

class MovieDetails {
    constructor() {
        this.initializeMovie();
        this.setupEventListeners();
    }

    initializeMovie() {
        // Get movie ID from URL
        const urlParams = new URLSearchParams(window.location.search);
        const movieId = urlParams.get('id');
        
        // Get movie data
        const moviesData = JSON.parse(localStorage.getItem('moviesData'));
        this.movie = moviesData.allMovies.find(m => m.id === movieId) || 
                     moviesData.trending.find(m => m.id === movieId) ||
                     moviesData.featured;

        if (!this.movie) {
            this.showError('Movie not found');
            return;
        }

        this.displayMovieDetails();
    }

    displayMovieDetails() {
        const container = document.querySelector('.movie-details');
        container.innerHTML = `
            <div class="relative w-full aspect-video rounded-lg overflow-hidden mb-6">
                ${this.movie.streamUrl ? `
                    <video id="moviePlayer" class="w-full h-full object-cover" controls>
                        <source src="${this.movie.streamUrl}" type="video/mp4">
                        Your browser does not support the video tag.
                    </video>
                ` : `
                    <img src="${this.movie.thumbnail}" alt="${this.movie.title}" class="w-full h-full object-cover">
                `}
            </div>

            <div class="space-y-6 p-4">
                <div class="flex items-center justify-between">
                    <h1 class="text-2xl font-bold">${this.movie.title}</h1>
                    <div class="flex items-center gap-4">
                        ${this.movie.downloadUrl ? `
                            <a href="${this.movie.downloadUrl}" download
                               class="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors
                                      flex items-center gap-2 text-sm font-medium">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                                </svg>
                                Download
                            </a>
                        ` : ''}
                        <button id="saveMovie" class="p-2 hover:bg-white/10 rounded-lg transition-colors">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                      d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
                            </svg>
                        </button>
                    </div>
                </div>

                <div class="flex items-center gap-4 text-sm text-gray-300">
                    <span class="flex items-center">
                        <svg class="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                        </svg>
                        ${this.movie.rating}
                    </span>
                    <span>${this.movie.year}</span>
                    <span>${this.movie.duration}</span>
                </div>

                <div class="flex flex-wrap gap-2">
                    ${this.movie.genres?.map(genre => `
                        <span class="px-3 py-1 bg-white/10 rounded-full text-sm">${genre}</span>
                    `).join('') || ''}
                </div>

                <p class="text-gray-300">${this.movie.description}</p>
            </div>
        `;
    }

    setupEventListeners() {
        // Save movie button
        document.addEventListener('click', (e) => {
            if (e.target.closest('#saveMovie')) {
                this.toggleSaveMovie();
            }
        });

        // Video player events
        const video = document.getElementById('moviePlayer');
        if (video) {
            // Save watching progress
            video.addEventListener('timeupdate', () => {
                const progress = (video.currentTime / video.duration) * 100;
                localStorage.setItem(`movie-progress-${this.movie.id}`, progress);
            });

            // Resume from last position
            const savedProgress = localStorage.getItem(`movie-progress-${this.movie.id}`);
            if (savedProgress) {
                video.currentTime = (video.duration * savedProgress) / 100;
            }
        }
    }

    toggleSaveMovie() {
        const savedMovies = JSON.parse(localStorage.getItem('savedMovies') || '[]');
        const isSaved = savedMovies.some(m => m.id === this.movie.id);
        
        if (isSaved) {
            const updatedMovies = savedMovies.filter(m => m.id !== this.movie.id);
            localStorage.setItem('savedMovies', JSON.stringify(updatedMovies));
            this.showToast('Removed from saved movies');
        } else {
            savedMovies.push(this.movie);
            localStorage.setItem('savedMovies', JSON.stringify(savedMovies));
            this.showToast('Added to saved movies');
        }
        
        this.updateSaveButton();
    }

    showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'fixed bottom-20 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-purple-600 text-white rounded-lg';
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }

    showError(message) {
        const container = document.querySelector('.movie-details');
        container.innerHTML = `
            <div class="flex flex-col items-center justify-center h-[50vh] text-center">
                <svg class="w-16 h-16 text-gray-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <h2 class="text-xl font-bold mb-2">Error</h2>
                <p class="text-gray-400">${message}</p>
                <a href="index.html" class="mt-4 px-4 py-2 bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors">
                    Go Back Home
                </a>
            </div>
        `;
    }
}

// Initialize movie details when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new MovieDetails();
}); 