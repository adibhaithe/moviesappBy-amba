class VideoPlayer {
    constructor() {
        this.createPlayerModal();
    }

    createPlayerModal() {
        const modal = document.createElement('div');
        modal.id = 'videoPlayerModal';
        modal.className = 'fixed inset-0 bg-black bg-opacity-90 z-50 hidden flex items-center justify-center';
        modal.innerHTML = `
            <div class="relative w-full max-w-4xl mx-4">
                <button id="closePlayer" class="absolute -top-10 right-0 text-white p-2 hover:text-gray-300">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
                <div class="relative pt-[56.25%]">
                    <div id="playerContainer" class="absolute inset-0 bg-black">
                        <div id="videoControls" class="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent hidden">
                            <div class="flex items-center gap-4">
                                <button id="playPauseBtn" class="text-white">
                                    <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M8 5v14l11-7z"/>
                                    </svg>
                                </button>
                                <div class="flex-1 h-1 bg-gray-600 rounded-full">
                                    <div id="progressBar" class="h-full bg-purple-600 rounded-full" style="width: 0%"></div>
                                </div>
                                <span id="timeDisplay" class="text-white text-sm">0:00 / 0:00</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        // Event listeners
        const closeBtn = modal.querySelector('#closePlayer');
        closeBtn.addEventListener('click', () => this.closePlayer());

        // Show/hide controls on hover
        const playerContainer = modal.querySelector('#playerContainer');
        const controls = modal.querySelector('#videoControls');
        playerContainer.addEventListener('mousemove', () => {
            controls.classList.remove('hidden');
            this.hideControlsTimeout();
        });
    }

    hideControlsTimeout() {
        if (this.timeout) clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
            document.querySelector('#videoControls').classList.add('hidden');
        }, 3000);
    }

    playVideo(movieData) {
        const modal = document.getElementById('videoPlayerModal');
        const playerContainer = document.getElementById('playerContainer');
        
        // Create video element
        const video = document.createElement('video');
        video.className = 'w-full h-full';
        video.controls = false; // We'll use custom controls
        
        // For demo purposes, using a sample video URL
        // In production, this would come from your movie data
        video.src = movieData.videoUrl || 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4';
        
        playerContainer.insertBefore(video, playerContainer.firstChild);
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';

        // Setup custom controls
        const playPauseBtn = document.getElementById('playPauseBtn');
        const progressBar = document.getElementById('progressBar');
        const timeDisplay = document.getElementById('timeDisplay');

        playPauseBtn.addEventListener('click', () => {
            if (video.paused) {
                video.play();
                playPauseBtn.innerHTML = `
                    <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                    </svg>
                `;
            } else {
                video.pause();
                playPauseBtn.innerHTML = `
                    <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                    </svg>
                `;
            }
        });

        video.addEventListener('timeupdate', () => {
            const progress = (video.currentTime / video.duration) * 100;
            progressBar.style.width = `${progress}%`;
            timeDisplay.textContent = `${formatTime(video.currentTime)} / ${formatTime(video.duration)}`;
        });

        // Auto-play
        video.play();
        playPauseBtn.innerHTML = `
            <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
            </svg>
        `;
    }

    closePlayer() {
        const modal = document.getElementById('videoPlayerModal');
        const playerContainer = document.getElementById('playerContainer');
        const video = playerContainer.querySelector('video');
        if (video) {
            video.pause();
            video.remove();
        }
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    seconds = Math.floor(seconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

// Export for use in other files
window.VideoPlayer = VideoPlayer; 