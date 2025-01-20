document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.querySelector('input[type="search"]');
    const recentSearchesSection = document.getElementById('recentSearches');
    const searchResultsSection = document.getElementById('searchResults');
    const resultsGrid = document.getElementById('resultsGrid');
    const noResults = document.getElementById('noResults');

    // Load recent searches from localStorage
    function loadRecentSearches() {
        const recentSearches = JSON.parse(localStorage.getItem('recentSearches') || '[]');
        const recentSearchesContainer = recentSearchesSection.querySelector('.space-y-4');
        
        if (recentSearches.length === 0) {
            recentSearchesContainer.innerHTML = `
                <p class="text-gray-400 text-center py-4">No recent searches</p>
            `;
            return;
        }

        recentSearchesContainer.innerHTML = recentSearches.map(search => `
            <div class="flex items-center justify-between bg-[#28303D] p-3 rounded-lg">
                <div class="flex items-center gap-3">
                    <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span class="text-sm">${search}</span>
                </div>
                <button class="p-1 hover:bg-white/10 rounded-full" onclick="removeRecentSearch('${search}')">
                    <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>
        `).join('');
    }

    // Search functionality
    function performSearch(query) {
        const results = searchMovies(query);
        
        if (results.length === 0) {
            searchResultsSection.classList.add('hidden');
            noResults.classList.remove('hidden');
            return;
        }

        displaySearchResults(results);
        
        // Save to recent searches
        saveRecentSearch(query);
    }

    function displaySearchResults(results) {
        resultsGrid.innerHTML = results.map((movie, index) => `
            <a href="movie-details.html?id=${movie.id}" 
               class="group search-result" 
               style="animation-delay: ${index * 0.1}s">
                <div class="relative rounded-lg overflow-hidden">
                    <img src="${movie.thumbnail || movie.image}" alt="${movie.title}" 
                         class="w-full aspect-[2/3] object-cover transform group-hover:scale-110 transition-transform duration-300">
                    <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent">
                        <div class="absolute bottom-0 w-full p-3 space-y-1">
                            <h3 class="text-sm font-semibold line-clamp-1">${movie.title}</h3>
                            <div class="flex items-center gap-2 text-xs text-gray-300">
                                <span>${movie.year || movie.releaseYear}</span>
                                <span>•</span>
                                <div class="flex items-center">
                                    <span class="text-yellow-400">★</span>
                                    <span>${movie.rating}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </a>
        `).join('');

        searchResultsSection.classList.remove('hidden');
        noResults.classList.add('hidden');
    }

    function searchMovies(query) {
        query = query.toLowerCase();
        const allMovies = [
            ...moviesData.trending,
            ...moviesData.continueWatching,
            moviesData.featured,
            ...moviesData.allMovies
        ].filter(Boolean);

        return allMovies.filter(movie => 
            movie.title.toLowerCase().includes(query) ||
            movie.genres?.some(genre => genre.toLowerCase().includes(query))
        );
    }

    // Event listeners
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.trim();
        
        if (query.length === 0) {
            searchResultsSection.classList.add('hidden');
            noResults.classList.add('hidden');
            recentSearchesSection.classList.remove('hidden');
            return;
        }

        if (query.length >= 2) {
            recentSearchesSection.classList.add('hidden');
            performSearch(query);
        }
    });

    // Initialize
    loadRecentSearches();
});

// Recent searches management
function saveRecentSearch(query) {
    if (!query) return;
    
    const recentSearches = JSON.parse(localStorage.getItem('recentSearches') || '[]');
    if (!recentSearches.includes(query)) {
        recentSearches.unshift(query);
        if (recentSearches.length > 5) recentSearches.pop();
        localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
    }
}

function removeRecentSearch(query) {
    const recentSearches = JSON.parse(localStorage.getItem('recentSearches') || '[]');
    const index = recentSearches.indexOf(query);
    if (index > -1) {
        recentSearches.splice(index, 1);
        localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
        loadRecentSearches();
    }
} 