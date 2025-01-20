document.addEventListener('DOMContentLoaded', () => {
    const loginContainer = document.getElementById('loginContainer');
    const adminContent = document.getElementById('adminContent');
    const adminLoginForm = document.getElementById('adminLoginForm');

    // Admin credentials (in a real app, these would be stored securely on a server)
    const ADMIN_CREDENTIALS = {
        username: 'admin',
        password: 'admin123'
    };

    // Check if admin is already logged in
    function checkAuth() {
        const isAuthenticated = localStorage.getItem('adminAuth');
        if (isAuthenticated) {
            loginContainer.classList.add('hidden');
            adminContent.classList.remove('hidden');
            initializeAdminDashboard();
        } else {
            loginContainer.classList.remove('hidden');
            adminContent.classList.add('hidden');
        }
    }

    // Handle admin login
    adminLoginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('adminUsername').value;
        const password = document.getElementById('adminPassword').value;

        if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
            localStorage.setItem('adminAuth', 'true');
            checkAuth();
            showToast('Login successful!');
        } else {
            showToast('Invalid credentials!', 'error');
        }
    });

    // Show toast message
    function showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `fixed bottom-20 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-lg ${
            type === 'success' ? 'bg-green-500' : 'bg-red-500'
        } text-white`;
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }

    // Initialize admin dashboard functionality
    function initializeAdminDashboard() {
        // DOM Elements
        const movieList = document.getElementById('movieList');
        const addMovieBtn = document.getElementById('addMovieBtn');
        const movieModal = document.getElementById('movieModal');
        const movieForm = document.getElementById('movieForm');
        const closeModal = document.getElementById('closeModal');
        const cancelBtn = document.getElementById('cancelBtn');
        const adminLogout = document.getElementById('adminLogout');

        // Image preview handlers
        ['movieThumbnail', 'movieBackdrop'].forEach(id => {
            const input = document.getElementById(id);
            const preview = document.getElementById(id.replace('movie', '').toLowerCase() + 'Preview');
            
            input.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        preview.src = e.target.result;
                        preview.classList.remove('hidden');
                    };
                    reader.readAsDataURL(file);
                }
            });
        });

        // Load and display movies
        function displayMovies() {
            const movies = JSON.parse(localStorage.getItem('movies')) || [];
            movieList.innerHTML = '';

            movies.forEach(movie => {
                const movieEl = document.createElement('div');
                movieEl.className = 'bg-[#28303D] rounded-lg overflow-hidden';
                movieEl.innerHTML = `
                    <div class="flex">
                        <img src="${movie.thumbnail}" alt="${movie.title}" 
                             class="w-32 h-48 object-cover">
                        <div class="flex-1 p-4">
                            <div class="flex justify-between items-start">
                                <div>
                                    <h3 class="text-lg font-semibold">${movie.title}</h3>
                                    <div class="flex items-center gap-2 mt-1 text-sm text-gray-400">
                                        <span>${movie.releaseYear}</span>
                                        <span>•</span>
                                        <span>${movie.duration}</span>
                                        <span>•</span>
                                        <div class="flex items-center">
                                            <span class="text-yellow-400">★</span>
                                            <span>${movie.rating}</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="flex gap-2">
                                    <button class="p-2 bg-blue-600 rounded edit-movie" data-id="${movie.id}">
                                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                        </svg>
                                    </button>
                                    <button class="p-2 bg-red-600 rounded delete-movie" data-id="${movie.id}">
                                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            <div class="flex flex-wrap gap-2 mt-2">
                                ${movie.genres.map(genre => 
                                    `<span class="px-2 py-1 bg-[#1A1A26] rounded-full text-xs">${genre}</span>`
                                ).join('')}
                            </div>
                            <p class="mt-2 text-sm text-gray-400 line-clamp-2">${movie.description}</p>
                        </div>
                    </div>
                `;
                movieList.appendChild(movieEl);
            });
        }

        // Add/Edit movie handler
        function handleMovieSubmit(e) {
            e.preventDefault();
            const movieId = document.getElementById('movieId').value;
            const movies = JSON.parse(localStorage.getItem('movies')) || [];

            const movieData = {
                id: movieId || Date.now(),
                title: document.getElementById('movieTitle').value,
                releaseYear: parseInt(document.getElementById('movieYear').value),
                rating: parseFloat(document.getElementById('movieRating').value),
                duration: document.getElementById('movieDuration').value,
                genres: document.getElementById('movieGenres').value.split(',').map(g => g.trim()),
                description: document.getElementById('movieDescription').value,
                thumbnail: document.getElementById('thumbnailPreview').src,
                backdrop: document.getElementById('backdropPreview').src
            };

            if (movieId) {
                // Edit existing movie
                const index = movies.findIndex(m => m.id === parseInt(movieId));
                if (index !== -1) {
                    movies[index] = movieData;
                }
            } else {
                // Add new movie
                movies.push(movieData);
            }

            localStorage.setItem('movies', JSON.stringify(movies));
            closeMovieModal();
            displayMovies();
            showToast(movieId ? 'Movie updated successfully!' : 'Movie added successfully!');
        }

        // Modal handlers
        function openMovieModal(movieId = null) {
            const modalTitle = document.getElementById('modalTitle');
            movieModal.classList.remove('hidden');

            if (movieId) {
                modalTitle.textContent = 'Edit Movie';
                const movies = JSON.parse(localStorage.getItem('movies')) || [];
                const movie = movies.find(m => m.id === parseInt(movieId));
                if (movie) {
                    fillMovieForm(movie);
                }
            } else {
                modalTitle.textContent = 'Add New Movie';
                movieForm.reset();
                document.getElementById('movieId').value = '';
                document.getElementById('thumbnailPreview').classList.add('hidden');
                document.getElementById('backdropPreview').classList.add('hidden');
            }
        }

        function closeMovieModal() {
            movieModal.classList.add('hidden');
            movieForm.reset();
        }

        function fillMovieForm(movie) {
            document.getElementById('movieId').value = movie.id;
            document.getElementById('movieTitle').value = movie.title;
            document.getElementById('movieYear').value = movie.releaseYear;
            document.getElementById('movieRating').value = movie.rating;
            document.getElementById('movieDuration').value = movie.duration;
            document.getElementById('movieGenres').value = movie.genres.join(', ');
            document.getElementById('movieDescription').value = movie.description;
            
            const thumbnailPreview = document.getElementById('thumbnailPreview');
            const backdropPreview = document.getElementById('backdropPreview');
            
            thumbnailPreview.src = movie.thumbnail;
            backdropPreview.src = movie.backdrop;
            thumbnailPreview.classList.remove('hidden');
            backdropPreview.classList.remove('hidden');
        }

        // Event Listeners
        addMovieBtn.addEventListener('click', () => openMovieModal());
        closeModal.addEventListener('click', closeMovieModal);
        cancelBtn.addEventListener('click', closeMovieModal);
        movieForm.addEventListener('submit', handleMovieSubmit);

        movieList.addEventListener('click', (e) => {
            const editBtn = e.target.closest('.edit-movie');
            const deleteBtn = e.target.closest('.delete-movie');
            
            if (editBtn) {
                openMovieModal(parseInt(editBtn.dataset.id));
            } else if (deleteBtn) {
                const movieId = parseInt(deleteBtn.dataset.id);
                if (confirm('Are you sure you want to delete this movie?')) {
                    const movies = JSON.parse(localStorage.getItem('movies')) || [];
                    const updatedMovies = movies.filter(m => m.id !== movieId);
                    localStorage.setItem('movies', JSON.stringify(updatedMovies));
                    displayMovies();
                    showToast('Movie deleted successfully!');
                }
            }
        });

        // Update logout handler
        adminLogout.addEventListener('click', () => {
            if (confirm('Are you sure you want to logout?')) {
                localStorage.removeItem('adminAuth');
                checkAuth();
                showToast('Logged out successfully!');
            }
        });

        // Initial display
        displayMovies();
    }

    // Check authentication on page load
    checkAuth();
});

class AdminManager {
    constructor() {
        this.initializeMoviesData();
        this.initializeUI();
        this.setupEventListeners();
        this.loadFeaturedMovie();
        this.loadMovieList();
        this.maxImageSize = 800;
        this.thumbnailPath = 'assets/thumbnails/movies/'; // Base path for thumbnails
    }

    initializeMoviesData() {
        // Get saved data or create default structure
        const savedData = JSON.parse(localStorage.getItem('moviesData'));
        
        // Default data structure
        const defaultData = {
            featured: {
                id: 'avatar',
                title: 'Avatar: The Way of Water',
                thumbnail: 'assets/thumbnails/movies/avatar.jpg',
                poster: 'assets/posters/avatar-poster.jpg',
                video: 'assets/videos/featured/avatar.mp4',
                rating: 7.6,
                year: 2022,
                duration: '3h 12m',
                genres: ['Action', 'Adventure', 'Fantasy'],
                description: 'Jake Sully lives with his newfound family formed on the extrasolar moon Pandora.'
            },
            trending: [],
            continueWatching: [],
            allMovies: []
        };

        // Merge saved data with default structure
        this.moviesData = savedData || defaultData;
        
        // Ensure all required arrays exist
        this.moviesData.trending = this.moviesData.trending || [];
        this.moviesData.continueWatching = this.moviesData.continueWatching || [];
        this.moviesData.allMovies = this.moviesData.allMovies || [];

        // Update global moviesData
        window.moviesData = this.moviesData;
        
        // Save initialized structure
        localStorage.setItem('moviesData', JSON.stringify(this.moviesData));
    }

    initializeUI() {
        // Initialize form fields
        this.thumbnailUpload = document.getElementById('thumbnailUpload');
        this.thumbnailPreview = document.getElementById('thumbnailPreview');
        this.videoUpload = document.getElementById('videoUpload');
        this.videoPreview = document.getElementById('videoPreview');
        this.featuredMovieForm = document.getElementById('featuredMovieForm');
        this.movieList = document.getElementById('movieList');
    }

    setupEventListeners() {
        // Handle thumbnail upload
        this.thumbnailUpload.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    this.thumbnailPreview.src = e.target.result;
                    this.thumbnailPreview.classList.remove('hidden');
                };
                reader.readAsDataURL(file);
            }
        });

        // Handle video upload
        this.videoUpload.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    this.videoPreview.src = e.target.result;
                    this.videoPreview.classList.remove('hidden');
                };
                reader.readAsDataURL(file);
            }
        });

        // Handle form submission
        this.featuredMovieForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.updateFeaturedMovie();
        });

        // Handle add movie button
        document.getElementById('addMovieBtn').addEventListener('click', () => {
            this.showAddMovieModal();
        });
    }

    loadFeaturedMovie() {
        const featured = this.moviesData.featured;
        document.getElementById('movieTitle').value = featured.title;
        document.getElementById('movieRating').value = featured.rating;
        document.getElementById('movieYear').value = featured.year;
        document.getElementById('movieDuration').value = featured.duration;
        document.getElementById('movieGenres').value = featured.genres.join(', ');
        document.getElementById('movieDescription').value = featured.description;

        // Show existing thumbnails
        if (featured.thumbnail) {
            this.thumbnailPreview.src = featured.thumbnail;
            this.thumbnailPreview.classList.remove('hidden');
        }
    }

    loadMovieList() {
        const movies = this.moviesData.trending || [];
        this.movieList.innerHTML = `
            <div class="mb-6">
                <h2 class="text-xl font-semibold mb-4">Featured Movie</h2>
                <div class="bg-[--card-bg] rounded-lg p-4 flex gap-4">
                    <img src="${this.moviesData.featured.thumbnail}" alt="${this.moviesData.featured.title}" 
                         class="w-32 h-44 object-cover rounded-lg">
                    <div class="flex-1">
                        <h3 class="font-semibold">${this.moviesData.featured.title}</h3>
                        <button onclick="adminManager.editFeaturedMovie()" 
                                class="mt-2 px-4 py-2 bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors">
                            Edit Featured Movie
                        </button>
                    </div>
                </div>
            </div>
            <h2 class="text-xl font-semibold mb-4">Trending Movies</h2>
        `;

        movies.forEach(movie => {
            const movieEl = document.createElement('div');
            movieEl.className = 'bg-[--card-bg] rounded-lg p-4 flex gap-4 mb-4';
            movieEl.innerHTML = `
                <img src="${movie.thumbnail}" alt="${movie.title}" class="w-24 h-36 object-cover rounded-lg">
                <div class="flex-1">
                    <div class="flex justify-between items-start">
                        <div>
                            <h3 class="font-semibold">${movie.title}</h3>
                            <div class="flex items-center gap-2 text-sm text-[--text-secondary]">
                                <span>${movie.year}</span>
                                <span>•</span>
                                <span>${movie.duration}</span>
                                <span>•</span>
                                <span>★ ${movie.rating}</span>
                            </div>
                        </div>
                        <div class="flex gap-2">
                            <button onclick="adminManager.editMovie('${movie.id}')" 
                                    class="p-2 hover:bg-[--bg-primary] rounded-lg transition-colors">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
                                </svg>
                            </button>
                            <button onclick="adminManager.deleteMovie('${movie.id}')"
                                    class="p-2 hover:bg-red-500/10 text-red-500 rounded-lg transition-colors">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            `;
            this.movieList.appendChild(movieEl);
        });
    }

    showAddMovieModal() {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50';
        modal.innerHTML = `
            <div class="bg-[--card-bg] rounded-lg p-6 w-[90%] max-w-2xl mx-4 space-y-4 max-h-[90vh] overflow-y-auto">
                <h3 class="text-xl font-bold mb-4">Add New Movie</h3>
                <form id="addMovieForm" class="space-y-6">
                    <!-- Basic Info -->
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-[--text-secondary] mb-2">Movie Title</label>
                            <input type="text" name="title" required class="w-full bg-[--input-bg] rounded-lg px-4 py-2">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-[--text-secondary] mb-2">Rating</label>
                            <input type="number" name="rating" step="0.1" min="0" max="10" required class="w-full bg-[--input-bg] rounded-lg px-4 py-2">
                        </div>
                    </div>

                    <!-- Media URLs -->
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-[--text-secondary] mb-2">Streaming URL</label>
                            <input type="url" name="streamUrl" 
                                   class="w-full bg-[--input-bg] rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500"
                                   placeholder="https://example.com/movie-stream">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-[--text-secondary] mb-2">Download URL</label>
                            <input type="url" name="downloadUrl" 
                                   class="w-full bg-[--input-bg] rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500"
                                   placeholder="https://example.com/movie-download">
                        </div>
                    </div>

                    <!-- Thumbnail Upload -->
                    <div>
                        <label class="block text-sm font-medium text-[--text-secondary] mb-2">Movie Thumbnail</label>
                        <div class="flex items-center gap-4">
                            <div class="w-32 h-44 bg-[--bg-primary] rounded-lg overflow-hidden">
                                <img id="newThumbnailPreview" src="#" alt="" class="w-full h-full object-cover hidden">
                            </div>
                            <div class="flex-1 space-y-2">
                                <input type="file" id="newThumbnailUpload" name="thumbnail" accept="image/*" class="hidden">
                                <button type="button" onclick="document.getElementById('newThumbnailUpload').click()" 
                                        class="w-full py-4 border-2 border-dashed border-[--text-secondary] rounded-lg hover:border-purple-500 transition-colors">
                                    <span class="text-[--text-secondary]">Upload Thumbnail</span>
                                </button>
                                <input type="url" name="thumbnailUrl" class="w-full bg-[--input-bg] rounded-lg px-4 py-2" 
                                       placeholder="Or enter thumbnail URL">
                            </div>
                        </div>
                    </div>

                    <!-- Other details -->
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-[--text-secondary] mb-2">Year</label>
                            <input type="number" name="year" required min="1900" max="2099" class="w-full bg-[--input-bg] rounded-lg px-4 py-2">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-[--text-secondary] mb-2">Duration</label>
                            <input type="text" name="duration" required class="w-full bg-[--input-bg] rounded-lg px-4 py-2">
                        </div>
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-[--text-secondary] mb-2">Genres</label>
                        <input type="text" name="genres" required class="w-full bg-[--input-bg] rounded-lg px-4 py-2">
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-[--text-secondary] mb-2">Description</label>
                        <textarea name="description" rows="4" required class="w-full bg-[--input-bg] rounded-lg px-4 py-2"></textarea>
                    </div>

                    <!-- Featured Movie Option -->
                    <div class="flex items-center gap-2">
                        <input type="checkbox" id="setAsFeatured" name="setAsFeatured" class="rounded text-purple-600">
                        <label for="setAsFeatured" class="text-sm font-medium text-[--text-secondary]">
                            Set as Featured Movie
                        </label>
                    </div>

                    <div class="flex justify-end gap-4 pt-4">
                        <button type="button" class="px-6 py-2 rounded-lg hover:bg-[--bg-primary] transition-colors" 
                                onclick="this.closest('.fixed').remove()">Cancel</button>
                        <button type="submit" class="px-6 py-2 bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors">
                            Add Movie
                        </button>
                    </div>
                </form>
            </div>
        `;

        document.body.appendChild(modal);

        // Updated form submission handler
        modal.querySelector('form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const form = e.target;
            
            try {
                const thumbnailFile = form.querySelector('#newThumbnailUpload').files[0];
                const thumbnailUrl = form.querySelector('[name="thumbnailUrl"]').value;
                
                const movieData = {
                    id: Date.now().toString(),
                    title: form.querySelector('[name="title"]').value,
                    rating: parseFloat(form.querySelector('[name="rating"]').value),
                    year: parseInt(form.querySelector('[name="year"]').value),
                    duration: form.querySelector('[name="duration"]').value,
                    genres: form.querySelector('[name="genres"]').value.split(',').map(g => g.trim()),
                    description: form.querySelector('[name="description"]').value,
                    streamUrl: form.querySelector('[name="streamUrl"]').value,
                    downloadUrl: form.querySelector('[name="downloadUrl"]').value,
                    thumbnail: thumbnailUrl || (thumbnailFile ? await this.getFileDataUrl(thumbnailFile) : '')
                };

                // Add to appropriate arrays
                this.moviesData.allMovies.push(movieData);
                this.moviesData.trending.push(movieData);

                // Handle featured movie setting
                if (form.querySelector('#setAsFeatured').checked) {
                    this.moviesData.featured = { ...movieData };
                }

                // Save to localStorage
                localStorage.setItem('moviesData', JSON.stringify(this.moviesData));

                this.showToast('Movie added successfully');
                modal.remove();
                window.location.reload();
            } catch (error) {
                this.showToast(error.message || 'Error adding movie', true);
                console.error(error);
            }
        });
    }

    editMovie(movieId) {
        const movie = this.moviesData.allMovies.find(m => m.id === movieId);
        if (!movie) return;

        // Show edit modal with movie data
        this.showToast('Edit functionality coming soon');
    }

    deleteMovie(movieId) {
        if (confirm('Are you sure you want to delete this movie?')) {
            // Remove from all arrays
            this.moviesData.trending = this.moviesData.trending.filter(m => m.id !== movieId);
            this.moviesData.allMovies = this.moviesData.allMovies.filter(m => m.id !== movieId);
            
            // Save to localStorage
            localStorage.setItem('moviesData', JSON.stringify(this.moviesData));
            
            // Update global moviesData
            window.moviesData = this.moviesData;
            
            // Refresh the list
            this.loadMovieList();
            this.showToast('Movie deleted successfully');
        }
    }

    async updateFeaturedMovie() {
        try {
            const formData = new FormData(this.featuredMovieForm);
            
            // Update basic movie data
            const updatedMovie = {
                ...this.moviesData.featured,
                title: formData.get('title'),
                rating: parseFloat(formData.get('rating')),
                year: parseInt(formData.get('year')),
                duration: formData.get('duration'),
                genres: formData.get('genres').split(',').map(g => g.trim()),
                description: formData.get('description')
            };

            // Handle thumbnail
            if (this.thumbnailUpload.files[0]) {
                const compressedImage = await this.compressImage(this.thumbnailUpload.files[0]);
                updatedMovie.thumbnail = compressedImage;
            }

            // Update storage
            this.moviesData.featured = updatedMovie;
            this.saveToStorage('moviesData', this.moviesData);
            
            window.moviesData = this.moviesData;
            this.showToast('Featured movie updated successfully');
        } catch (error) {
            this.showToast('Error updating featured movie: ' + error.message, true);
            console.error(error);
        }
    }

    getFileDataUrl(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = (e) => reject(e);
            reader.readAsDataURL(file);
        });
    }

    async compressImage(file) {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    // Set fixed dimensions for trending thumbnails
                    const width = 300;  // Fixed width
                    const height = 450; // Fixed height (3:2 aspect ratio)

                    const canvas = document.createElement('canvas');
                    canvas.width = width;
                    canvas.height = height;
                    
                    const ctx = canvas.getContext('2d');
                    // Use object-fit: cover behavior
                    const scale = Math.max(width / img.width, height / img.height);
                    const x = (width - img.width * scale) * 0.5;
                    const y = (height - img.height * scale) * 0.5;
                    
                    ctx.fillStyle = '#000'; // Black background
                    ctx.fillRect(0, 0, width, height);
                    ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
                    
                    // Convert to WebP format with compression
                    resolve(canvas.toDataURL('image/webp', 0.8));
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        });
    }

    saveToStorage(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
        } catch (e) {
            console.error('Storage quota exceeded, cleaning up...');
            // Remove old data if needed
            localStorage.clear();
            try {
                localStorage.setItem(key, JSON.stringify(data));
            } catch (e) {
                console.error('Still cannot save data after cleanup');
                this.showToast('Error: Storage full. Try smaller images.', true);
            }
        }
    }

    async addMovie(movieData, thumbnailFile) {
        try {
            const newMovie = {
                id: Date.now().toString(),
                ...movieData
            };

            if (thumbnailFile) {
                // Save thumbnail with a proper filename
                const filename = `${newMovie.id}-${thumbnailFile.name}`;
                newMovie.thumbnail = await this.saveImageToFolder(thumbnailFile, filename);
            }

            // Add to both trending and allMovies arrays
            this.moviesData.trending.push(newMovie);
            this.moviesData.allMovies.push(newMovie);

            // Save updated data
            this.saveToStorage('moviesData', this.moviesData);
            
            return true;
        } catch (error) {
            console.error('Error adding movie:', error);
            return false;
        }
    }

    async saveImageToFolder(file, filename) {
        try {
            const compressedImage = await this.compressImage(file);
            // In a real app, you would upload this to a server
            // For now, we'll store in localStorage with a reference path
            const path = this.thumbnailPath + filename;
            localStorage.setItem(path, compressedImage);
            return path;
        } catch (error) {
            console.error('Error saving image:', error);
            throw error;
        }
    }

    showToast(message, isError = false) {
        const toast = document.createElement('div');
        toast.className = `fixed bottom-24 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-lg z-50 animate-fade-in ${
            isError ? 'bg-red-500' : 'bg-purple-500'
        } text-white`;
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.classList.add('animate-fade-out');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    editFeaturedMovie() {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50';
        modal.innerHTML = `
            <div class="bg-[--card-bg] rounded-lg p-6 w-[90%] max-w-2xl mx-4 space-y-4 max-h-[90vh] overflow-y-auto">
                <h3 class="text-xl font-semibold">Edit Featured Movie</h3>
                <form id="editFeaturedForm" class="space-y-4">
                    <!-- Same fields as your existing form -->
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm text-[--text-secondary] mb-1">Title</label>
                            <input type="text" name="title" value="${this.moviesData.featured.title}" 
                                   required class="w-full bg-[--input-bg] rounded-lg px-4 py-2">
                        </div>
                        <div>
                            <label class="block text-sm text-[--text-secondary] mb-1">Rating</label>
                            <input type="number" name="rating" value="${this.moviesData.featured.rating}" 
                                   step="0.1" required class="w-full bg-[--input-bg] rounded-lg px-4 py-2">
                        </div>
                    </div>

                    <!-- Thumbnail Upload -->
                    <div>
                        <label class="block text-sm text-[--text-secondary] mb-1">Thumbnail</label>
                        <div class="flex items-center gap-4">
                            <img id="editThumbnailPreview" src="${this.moviesData.featured.thumbnail}" 
                                 class="w-32 h-44 object-cover rounded-lg">
                            <div class="flex-1">
                                <input type="file" id="editThumbnailUpload" accept="image/*" class="hidden">
                                <button type="button" onclick="document.getElementById('editThumbnailUpload').click()" 
                                        class="w-full py-8 border-2 border-dashed border-[--text-secondary] rounded-lg hover:border-purple-500 transition-colors">
                                    <span class="text-[--text-secondary]">Click to change thumbnail</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm text-[--text-secondary] mb-1">Year</label>
                            <input type="number" name="year" value="${this.moviesData.featured.year}" 
                                   required class="w-full bg-[--input-bg] rounded-lg px-4 py-2">
                        </div>
                        <div>
                            <label class="block text-sm text-[--text-secondary] mb-1">Duration</label>
                            <input type="text" name="duration" value="${this.moviesData.featured.duration}" 
                                   required class="w-full bg-[--input-bg] rounded-lg px-4 py-2">
                        </div>
                    </div>

                    <div>
                        <label class="block text-sm text-[--text-secondary] mb-1">Genres</label>
                        <input type="text" name="genres" value="${this.moviesData.featured.genres.join(', ')}" 
                               required class="w-full bg-[--input-bg] rounded-lg px-4 py-2">
                    </div>

                    <div>
                        <label class="block text-sm text-[--text-secondary] mb-1">Description</label>
                        <textarea name="description" rows="4" required 
                                  class="w-full bg-[--input-bg] rounded-lg px-4 py-2">${this.moviesData.featured.description}</textarea>
                    </div>

                    <div class="flex justify-end gap-4">
                        <button type="button" class="px-4 py-2 rounded-lg hover:bg-[--bg-primary] transition-colors" 
                                onclick="this.closest('.fixed').remove()">Cancel</button>
                        <button type="submit" class="px-4 py-2 bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors">
                            Update Featured Movie
                        </button>
                    </div>
                </form>
            </div>
        `;

        document.body.appendChild(modal);

        // Setup thumbnail preview
        const thumbnailUpload = modal.querySelector('#editThumbnailUpload');
        const thumbnailPreview = modal.querySelector('#editThumbnailPreview');

        thumbnailUpload.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (file) {
                const dataUrl = await this.getFileDataUrl(file);
                thumbnailPreview.src = dataUrl;
            }
        });

        // Handle form submission
        modal.querySelector('form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const form = e.target;
            
            try {
                const thumbnailFile = form.querySelector('#editThumbnailUpload').files[0];
                
                // Update featured movie data
                this.moviesData.featured = {
                    ...this.moviesData.featured,
                    title: form.querySelector('[name="title"]').value,
                    rating: parseFloat(form.querySelector('[name="rating"]').value),
                    year: parseInt(form.querySelector('[name="year"]').value),
                    duration: form.querySelector('[name="duration"]').value,
                    genres: form.querySelector('[name="genres"]').value.split(',').map(g => g.trim()),
                    description: form.querySelector('[name="description"]').value
                };

                if (thumbnailFile) {
                    this.moviesData.featured.thumbnail = await this.getFileDataUrl(thumbnailFile);
                }

                // Save to localStorage
                localStorage.setItem('moviesData', JSON.stringify(this.moviesData));

                // Update global moviesData
                window.moviesData = this.moviesData;

                // Refresh the list
                this.loadMovieList();
                
                // Show success message and close modal
                this.showToast('Featured movie updated successfully');
                modal.remove();

                // Reload the page
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            } catch (error) {
                this.showToast(error.message || 'Error updating featured movie', true);
                console.error(error);
            }
        });
    }

    createMovieCard(movie) {
        const div = document.createElement('div');
        div.className = 'relative bg-[--card-bg] rounded-xl overflow-hidden group';
        div.innerHTML = `
            <div class="relative aspect-video">
                <img src="${movie.thumbnail}" alt="${movie.title}" class="w-full h-full object-cover">
                <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div class="absolute top-2 right-2 flex gap-2">
                        <a href="admin-movie-details.html?id=${movie.id}" 
                           class="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors duration-300"
                           title="Edit">
                            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                            </svg>
                        </a>
                        <button onclick="adminManager.deleteMovie('${movie.id}')"
                                class="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors duration-300"
                                title="Delete">
                            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
            <div class="p-4">
                <h3 class="font-semibold mb-1">${movie.title}</h3>
                <div class="flex items-center text-sm text-[--text-secondary]">
                    <span>${movie.year}</span>
                    <span class="mx-2">•</span>
                    <span>${movie.duration}</span>
                </div>
            </div>
        `;
        return div;
    }
}

// Initialize AdminManager when DOM is loaded
let adminManager;
document.addEventListener('DOMContentLoaded', () => {
    // Load movies data from localStorage or use default
    const savedMoviesData = JSON.parse(localStorage.getItem('moviesData'));
    if (savedMoviesData) {
        window.moviesData = savedMoviesData;
    } else {
        // Initialize with default structure if no saved data
        window.moviesData = {
            featured: {
                id: 'avatar',
                title: 'Avatar: The Way of Water',
                thumbnail: 'assets/thumbnails/movies/avatar.jpg',
                poster: 'assets/posters/avatar-poster.jpg',
                video: 'assets/videos/featured/avatar.mp4',
                rating: 7.6,
                year: 2022,
                duration: '3h 12m',
                genres: ['Action', 'Adventure', 'Fantasy'],
                description: 'Jake Sully lives with his newfound family formed on the extrasolar moon Pandora.'
            },
            trending: [],
            continueWatching: [],
            allMovies: []
        };
        localStorage.setItem('moviesData', JSON.stringify(window.moviesData));
    }

    // Initialize AdminManager
    adminManager = new AdminManager();
});

function showMovieDetails(movieId) {
    // Hide other sections and show movie details section
    document.querySelectorAll('section').forEach(section => section.classList.add('hidden'));
    document.getElementById('movieDetailsSection').classList.remove('hidden');

    // Get movie data
    const movie = findMovie(movieId);
    if (movie) {
        populateMovieDetailsForm(movie);
    }
}

function closeMovieDetails() {
    document.getElementById('movieDetailsSection').classList.add('hidden');
    // Show the previous section (you might want to track which section was active before)
    document.getElementById('moviesSection').classList.remove('hidden');
}

function populateMovieDetailsForm(movie) {
    const form = document.getElementById('movieDetailsForm');
    
    // Populate URLs
    form.querySelector('[name="streamUrl"]').value = movie.streamUrl || '';
    form.querySelector('[name="downloadUrl"]').value = movie.downloadUrl || '';
    form.querySelector('[name="trailerUrl"]').value = movie.trailerUrl || '';
    
    // Populate languages
    form.querySelector('[name="audioLanguages"]').value = movie.audioLanguages?.join(', ') || '';
    form.querySelector('[name="subtitleLanguages"]').value = movie.subtitleLanguages?.join(', ') || '';
    
    // Populate quality options
    form.querySelector('[name="videoQuality"]').value = movie.videoQuality || '1080p';
    form.querySelector('[name="fileSize"]').value = movie.fileSize || '';
    
    // Set checkboxes
    form.querySelector('[name="hasSubtitles"]').checked = movie.hasSubtitles || false;
    form.querySelector('[name="isDubbed"]').checked = movie.isDubbed || false;
    form.querySelector('[name="isFeatured"]').checked = movie.isFeatured || false;
}

// Add form submission handler
document.getElementById('movieDetailsForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    
    try {
        const movieData = {
            streamUrl: formData.get('streamUrl'),
            downloadUrl: formData.get('downloadUrl'),
            trailerUrl: formData.get('trailerUrl'),
            audioLanguages: formData.get('audioLanguages').split(',').map(lang => lang.trim()),
            subtitleLanguages: formData.get('subtitleLanguages').split(',').map(lang => lang.trim()),
            videoQuality: formData.get('videoQuality'),
            fileSize: formData.get('fileSize'),
            hasSubtitles: formData.get('hasSubtitles') === 'on',
            isDubbed: formData.get('isDubbed') === 'on',
            isFeatured: formData.get('isFeatured') === 'on'
        };

        // Update movie in localStorage
        const movies = JSON.parse(localStorage.getItem('moviesData'));
        const movieIndex = movies.allMovies.findIndex(m => m.id === currentMovieId);
        if (movieIndex !== -1) {
            movies.allMovies[movieIndex] = { ...movies.allMovies[movieIndex], ...movieData };
            localStorage.setItem('moviesData', JSON.stringify(movies));
        }

        showToast('Movie details updated successfully');
        closeMovieDetails();
    } catch (error) {
        showToast('Error updating movie details', 'error');
        console.error(error);
    }
});

// Add this function to handle loading movie details
function loadMovieDetails(movieId) {
    const movie = findMovie(movieId);
    if (!movie) {
        alert('Movie not found');
        window.location.href = 'admin.html';
        return;
    }

    // Update preview section
    document.getElementById('movieTitle').textContent = movie.title;
    document.getElementById('movieYear').textContent = movie.year;
    document.getElementById('movieDuration').textContent = movie.duration;
    document.getElementById('movieRating').textContent = movie.rating;
    document.getElementById('movieBackdrop').src = movie.backdrop || movie.thumbnail;

    // Populate form
    const form = document.getElementById('movieDetailsForm');
    form.querySelector('[name="streamUrl"]').value = movie.streamUrl || '';
    form.querySelector('[name="downloadUrl"]').value = movie.downloadUrl || '';
    form.querySelector('[name="trailerUrl"]').value = movie.trailerUrl || '';
    form.querySelector('[name="videoQuality"]').value = movie.videoQuality || '1080p';
    form.querySelector('[name="fileSize"]').value = movie.fileSize || '';
    form.querySelector('[name="audioLanguages"]').value = movie.audioLanguages?.join(', ') || '';
    form.querySelector('[name="subtitleLanguages"]').value = movie.subtitleLanguages?.join(', ') || '';
    form.querySelector('[name="hasSubtitles"]').checked = movie.hasSubtitles || false;
    form.querySelector('[name="isDubbed"]').checked = movie.isDubbed || false;
    form.querySelector('[name="isFeatured"]').checked = movie.isFeatured || false;
}

// Add this helper function to find a movie by ID
function findMovie(movieId) {
    const moviesData = JSON.parse(localStorage.getItem('moviesData'));
    if (!moviesData) return null;

    // Check in all possible locations
    if (moviesData.featured && moviesData.featured.id === movieId) {
        return moviesData.featured;
    }

    const movie = moviesData.allMovies.find(m => m.id === movieId) ||
                 moviesData.trending.find(m => m.id === movieId);
    
    return movie || null;
} 