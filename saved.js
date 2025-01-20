document.addEventListener('DOMContentLoaded', () => {
    const savedMoviesList = document.getElementById('savedMoviesList');
    const editModal = document.getElementById('editModal');
    const editForm = document.getElementById('editForm');
    const cancelEdit = document.getElementById('cancelEdit');
    const themeToggle = document.getElementById('themeToggle');

    // Theme handling
    function initTheme() {
        if (localStorage.theme === 'dark' || 
            (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }

    themeToggle.addEventListener('click', () => {
        document.documentElement.classList.toggle('dark');
        localStorage.theme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    });

    initTheme();

    function displaySavedMovies() {
        const savedMovies = moviesData.allMovies.filter(movie => movie.isSaved);
        savedMoviesList.innerHTML = '';

        savedMovies.forEach(movie => {
            const movieEl = document.createElement('div');
            movieEl.className = 'bg-gray-100 dark:bg-dark-secondary rounded-lg overflow-hidden shadow-lg transition-transform hover:scale-[1.02]';
            movieEl.innerHTML = `
                <div class="flex flex-col md:flex-row">
                    <img src="${movie.image}" alt="${movie.title}" 
                         class="w-full md:w-48 h-48 object-cover">
                    <div class="flex-1 p-4">
                        <div class="flex justify-between items-start">
                            <h3 class="text-lg font-semibold">${movie.title}</h3>
                            <button class="p-1 text-purple-600 remove-button" data-id="${movie.id}">
                                <svg class="w-5 h-5" fill="currentColor" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                          d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
                                </svg>
                            </button>
                        </div>
                        <div class="flex flex-wrap items-center gap-2 mt-1 text-sm text-gray-500 dark:text-gray-400">
                            <span>${movie.releaseYear}</span>
                            <span>•</span>
                            <span>${movie.duration}</span>
                            <span>•</span>
                            <div class="flex items-center">
                                <span class="text-yellow-400">★</span>
                                <span>${movie.rating}</span>
                            </div>
                        </div>
                        <div class="flex flex-wrap gap-2 mt-2">
                            ${movie.genres.map(genre => 
                                `<span class="px-2 py-1 bg-white dark:bg-dark text-sm rounded-full">${genre}</span>`
                            ).join('')}
                        </div>
                        <p class="mt-2 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">${movie.description}</p>
                        <div class="flex gap-2 mt-4">
                            <button class="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm font-semibold text-white transition-colors">
                                Watch Now
                            </button>
                            <button class="px-4 py-2 bg-gray-200 dark:bg-dark hover:bg-gray-300 dark:hover:bg-opacity-90 rounded-lg text-sm edit-button transition-colors" 
                                    data-id="${movie.id}">
                                Edit
                            </button>
                        </div>
                    </div>
                </div>
            `;
            savedMoviesList.appendChild(movieEl);
        });
    }

    // Edit movie functionality
    function openEditModal(movieId) {
        const movie = moviesData.allMovies.find(m => m.id === movieId);
        if (movie) {
            document.getElementById('editMovieId').value = movie.id;
            document.getElementById('editRating').value = movie.rating;
            document.getElementById('editDuration').value = movie.duration;
            editModal.classList.remove('hidden');
        }
    }

    function closeEditModal() {
        editModal.classList.add('hidden');
    }

    // Event listeners
    savedMoviesList.addEventListener('click', (e) => {
        const removeButton = e.target.closest('.remove-button');
        const editButton = e.target.closest('.edit-button');
        
        if (removeButton) {
            const movieId = parseInt(removeButton.dataset.id);
            const movie = moviesData.allMovies.find(m => m.id === movieId);
            if (movie) {
                movie.isSaved = false;
                displaySavedMovies();
            }
        } else if (editButton) {
            const movieId = parseInt(editButton.dataset.id);
            openEditModal(movieId);
        }
    });

    editForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const movieId = parseInt(document.getElementById('editMovieId').value);
        const movie = moviesData.allMovies.find(m => m.id === movieId);
        if (movie) {
            movie.rating = parseFloat(document.getElementById('editRating').value);
            movie.duration = document.getElementById('editDuration').value;
            closeEditModal();
            displaySavedMovies();
        }
    });

    cancelEdit.addEventListener('click', closeEditModal);

    // Close modal when clicking outside
    editModal.addEventListener('click', (e) => {
        if (e.target === editModal) {
            closeEditModal();
        }
    });

    // Initial display
    displaySavedMovies();
}); 