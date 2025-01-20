const moviesData = {
    featured: {
        id: 'avatar',
        title: 'Avatar: The Way of Water',
        thumbnail: 'assets/thumbnails/movies/avatar.jpg',
        poster: 'assets/posters/avatar-poster.jpg',
        video: 'assets/videos/featured/avatar.mp4',
        preview: 'assets/videos/previews/avatar-preview.mp4',
        rating: 7.6,
        year: 2022,
        duration: '3h 12m',
        genres: ['Action', 'Adventure', 'Fantasy'],
        description: 'Jake Sully lives with his newfound family formed on the extrasolar moon Pandora. Once a familiar threat returns to finish what was previously started, Jake must work with Neytiri and the army of the Na\'vi race to protect their home.',
    },
    continueWatching: [
        {
            id: 'stranger-things',
            title: 'Stranger Things',
            thumbnail: 'assets/thumbnails/shows/sahas.jpg',
            progress: 45,
            episode: 'S4:E5'
        },
        // Add more shows...
    ],
    trending: [
        {
            id: 'inception',
            title: 'Inception',
            thumbnail: 'assets/thumbnails/movies/inception.jpg',
            rating: 8.8,
            year: 2010
        },
        {
            id: 'dark-knight',
            title: 'The Dark Knight',
            thumbnail: 'assets/thumbnails/movies/dark-knight.jpg',
            rating: 9.0,
            year: 2008
        },
        // Add more movies...
    ],
    allMovies: [
        {
            id: 1,
            title: "Doctor Strange",
            image: "path/to/doctor-strange.jpg",
            genres: ["Action", "Adventure", "Fantasy"],
            rating: 7.5,
            releaseYear: 2022,
            duration: "2h 6m",
            description: "Dr. Stephen Strange casts a forbidden spell that opens the doorway to the multiverse.",
            isSaved: true
        },
        {
            id: 2,
            title: "Avatar: The Way of Water",
            image: "path/to/avatar.jpg",
            genres: ["Action", "Adventure", "Fantasy"],
            rating: 7.6,
            releaseYear: 2023,
            duration: "3h 12m",
            description: "Jake Sully lives with his newfound family formed on the extrasolar moon Pandora.",
            isSaved: true
        },
        // Add more movies...
    ]
}; 