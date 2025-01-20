class MovieDetailsAdmin {
    constructor() {
        this.currentMovieId = null;
        this.initializeElements();
        this.setupEventListeners();
    }

    initializeElements() {
        // Form elements
        this.form = document.getElementById('movieDetailsForm');
        this.backdropImg = document.getElementById('movieBackdrop');
        this.backdropUpload = document.getElementById('backdropUpload');
        this.editBackdropBtn = document.getElementById('editBackdrop');
        this.saveChangesBtn = document.getElementById('saveChanges');
    }

    setupEventListeners() {
        // Handle backdrop upload
        this.editBackdropBtn.addEventListener('click', () => {
            this.backdropUpload.click();
        });

        this.backdropUpload.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                this.handleImageUpload(file);
            }
        });

        // Handle form submission
        this.saveChangesBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.saveMovieDetails();
        });
    }

    async handleImageUpload(file) {
        try {
            // Show loading state
            this.editBackdropBtn.innerHTML = `
                <svg class="w-5 h-5 animate-spin" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            `;

            // Process image
            const resizedImage = await this.resizeImage(file);
            const imageUrl = URL.createObjectURL(resizedImage);
            
            // Update preview
            this.backdropImg.src = imageUrl;
            
            // Store the file for later upload
            this.newBackdropFile = resizedImage;

            // Reset button
            this.editBackdropBtn.innerHTML = `
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
                </svg>
            `;

            this.showToast('Image updated successfully');
        } catch (error) {
            console.error('Error uploading image:', error);
            this.showToast('Error uploading image', 'error');
        }
    }

    async resizeImage(file) {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const maxSize = 1200; // Max width/height
                    let width = img.width;
                    let height = img.height;

                    if (width > height && width > maxSize) {
                        height = (height * maxSize) / width;
                        width = maxSize;
                    } else if (height > maxSize) {
                        width = (width * maxSize) / height;
                        height = maxSize;
                    }

                    canvas.width = width;
                    canvas.height = height;

                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);

                    canvas.toBlob((blob) => {
                        resolve(blob);
                    }, 'image/jpeg', 0.85);
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        });
    }

    async saveMovieDetails() {
        try {
            const formData = new FormData(this.form);
            const movieData = {
                streamUrl: formData.get('streamUrl'),
                downloadUrl: formData.get('downloadUrl'),
                trailerUrl: formData.get('trailerUrl'),
                videoQuality: formData.get('videoQuality'),
                fileSize: formData.get('fileSize'),
                audioLanguages: formData.get('audioLanguages').split(',').map(lang => lang.trim()),
                subtitleLanguages: formData.get('subtitleLanguages').split(',').map(lang => lang.trim()),
                hasSubtitles: formData.get('hasSubtitles') === 'on',
                isDubbed: formData.get('isDubbed') === 'on',
                isFeatured: formData.get('isFeatured') === 'on'
            };

            // If there's a new backdrop image
            if (this.newBackdropFile) {
                const backdropUrl = await this.uploadImage(this.newBackdropFile);
                movieData.backdrop = backdropUrl;
            }

            // Update movie in localStorage
            const movies = JSON.parse(localStorage.getItem('moviesData'));
            const movieIndex = movies.allMovies.findIndex(m => m.id === this.currentMovieId);
            if (movieIndex !== -1) {
                movies.allMovies[movieIndex] = { 
                    ...movies.allMovies[movieIndex], 
                    ...movieData 
                };
                localStorage.setItem('moviesData', JSON.stringify(movies));
            }

            this.showToast('Movie details saved successfully');
            setTimeout(() => {
                window.location.href = 'admin.html';
            }, 1500);
        } catch (error) {
            console.error('Error saving movie details:', error);
            this.showToast('Error saving movie details', 'error');
        }
    }

    async uploadImage(file) {
        // In a real app, you would upload to a server
        // For now, we'll convert to base64 and store locally
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                resolve(reader.result);
            };
            reader.readAsDataURL(file);
        });
    }

    showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `fixed bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-lg text-white
                          ${type === 'success' ? 'bg-green-500' : 'bg-red-500'}`;
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const movieDetailsAdmin = new MovieDetailsAdmin();
    
    // Load movie data
    const urlParams = new URLSearchParams(window.location.search);
    const movieId = urlParams.get('id');
    if (movieId) {
        movieDetailsAdmin.currentMovieId = movieId;
        loadMovieDetails(movieId);
    }
});

function loadMovieDetails(movieId) {
    const movie = findMovie(movieId);
    if (!movie) {
        showToast('Movie not found', 'error');
        setTimeout(() => {
            window.location.href = 'admin.html';
        }, 1500);
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