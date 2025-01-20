class DownloadManager {
    constructor() {
        // Initialize with some example downloads
        const exampleDownloads = {
            active: [
                {
                    id: 'avatar-download',
                    title: 'Avatar: The Way of Water',
                    thumbnail: 'assets/thumbnails/movies/avatar.jpg',
                    size: '4.2 GB',
                    progress: 45,
                    speed: '2.1 MB',
                    paused: false
                }
            ],
            completed: [
                {
                    id: 'inception-download',
                    title: 'Inception',
                    thumbnail: 'assets/thumbnails/movies/inception.jpg',
                    size: '2.8 GB'
                }
            ]
        };

        this.downloads = JSON.parse(localStorage.getItem('downloads')) || exampleDownloads;
        this.initializeUI();
        this.setupEventListeners();
        this.updateStorageInfo();
    }

    initializeUI() {
        this.renderActiveDownloads();
        this.renderCompletedDownloads();
    }

    setupEventListeners() {
        document.getElementById('clearAllBtn').addEventListener('click', () => this.handleClearAll());
    }

    renderActiveDownloads() {
        const container = document.getElementById('activeDownloads');
        const downloadsList = document.createElement('div');
        downloadsList.className = 'space-y-3';

        this.downloads.active.forEach(download => {
            const downloadEl = this.createDownloadElement(download, true);
            downloadsList.appendChild(downloadEl);
        });

        // Clear and update container
        container.innerHTML = '<h2 class="text-lg font-semibold mb-3">Downloading</h2>';
        if (this.downloads.active.length === 0) {
            container.innerHTML += '<p class="text-[--text-secondary] text-sm">No active downloads</p>';
        } else {
            container.appendChild(downloadsList);
        }
    }

    renderCompletedDownloads() {
        const container = document.getElementById('completedDownloads');
        const downloadsList = document.createElement('div');
        downloadsList.className = 'space-y-3';

        this.downloads.completed.forEach(download => {
            const downloadEl = this.createDownloadElement(download, false);
            downloadsList.appendChild(downloadEl);
        });

        // Clear and update container
        container.innerHTML = '<h2 class="text-lg font-semibold mb-3">Downloaded</h2>';
        if (this.downloads.completed.length === 0) {
            container.innerHTML += '<p class="text-[--text-secondary] text-sm">No downloaded videos</p>';
        } else {
            container.appendChild(downloadsList);
        }
    }

    createDownloadElement(download, isActive) {
        const el = document.createElement('div');
        el.className = 'bg-[--card-bg] rounded-lg p-4 animate-fade-in';
        el.innerHTML = `
            <div class="flex items-center gap-4">
                <img src="${download.thumbnail}" alt="${download.title}" 
                     class="w-20 h-28 object-cover rounded-lg">
                <div class="flex-1">
                    <h3 class="font-semibold mb-1">${download.title}</h3>
                    <p class="text-sm text-[--text-secondary] mb-2">${download.size}</p>
                    ${isActive ? `
                        <div class="w-full bg-[--bg-primary] rounded-full h-1.5 mb-2">
                            <div class="bg-purple-600 h-1.5 rounded-full" style="width: ${download.progress}%"></div>
                        </div>
                        <div class="flex items-center justify-between text-sm">
                            <span class="text-[--text-secondary]">${download.progress}%</span>
                            <span class="text-[--text-secondary]">${download.speed}/s</span>
                        </div>
                    ` : ''}
                </div>
                <div class="flex flex-col gap-2">
                    ${isActive ? `
                        <button class="p-2 hover:bg-white/10 rounded-full transition-colors" 
                                onclick="downloadManager.toggleDownload('${download.id}')">
                            ${download.paused ? `
                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/>
                                </svg>
                            ` : `
                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6"/>
                                </svg>
                            `}
                        </button>
                    ` : ''}
                    <button class="p-2 hover:bg-white/10 rounded-full transition-colors text-red-500" 
                            onclick="downloadManager.deleteDownload('${download.id}', ${isActive})">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                        </svg>
                    </button>
                </div>
            </div>
        `;
        return el;
    }

    toggleDownload(id) {
        const download = this.downloads.active.find(d => d.id === id);
        if (download) {
            download.paused = !download.paused;
            this.saveDownloads();
            this.renderActiveDownloads();
        }
    }

    deleteDownload(id, isActive) {
        if (isActive) {
            this.downloads.active = this.downloads.active.filter(d => d.id !== id);
        } else {
            this.downloads.completed = this.downloads.completed.filter(d => d.id !== id);
        }
        this.saveDownloads();
        this.updateStorageInfo();
        this.initializeUI();
    }

    handleClearAll() {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50';
        modal.innerHTML = `
            <div class="bg-[--card-bg] rounded-lg p-6 w-[90%] max-w-md mx-4">
                <h3 class="text-xl font-semibold mb-4">Clear All Downloads</h3>
                <p class="text-[--text-secondary] mb-6">This will remove all downloaded videos. This action cannot be undone.</p>
                <div class="flex gap-3">
                    <button class="flex-1 px-4 py-2 bg-[--bg-primary] rounded-lg hover:bg-opacity-80 transition-colors cancel">
                        Cancel
                    </button>
                    <button class="flex-1 px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700 transition-colors confirm">
                        Clear All
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        modal.querySelector('.cancel').addEventListener('click', () => modal.remove());
        modal.querySelector('.confirm').addEventListener('click', () => {
            this.downloads.active = [];
            this.downloads.completed = [];
            this.saveDownloads();
            this.updateStorageInfo();
            this.initializeUI();
            modal.remove();
            this.showToast('All downloads cleared');
        });
    }

    updateStorageInfo() {
        const totalSize = [...this.downloads.active, ...this.downloads.completed]
            .reduce((acc, curr) => acc + this.parseSize(curr.size), 0);
        
        const storageUsed = document.getElementById('storageUsed');
        const storageBar = document.getElementById('storageBar');
        
        const maxStorage = 32; // GB
        const usedGB = totalSize / 1024; // Convert MB to GB
        const percentage = (usedGB / maxStorage) * 100;
        
        storageUsed.textContent = `${usedGB.toFixed(1)} GB / ${maxStorage} GB`;
        storageBar.style.width = `${percentage}%`;
    }

    parseSize(sizeStr) {
        const size = parseFloat(sizeStr);
        if (sizeStr.includes('GB')) return size * 1024;
        if (sizeStr.includes('MB')) return size;
        return 0;
    }

    saveDownloads() {
        localStorage.setItem('downloads', JSON.stringify(this.downloads));
    }

    showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'fixed bottom-24 left-1/2 transform -translate-x-1/2 bg-purple-500 text-white px-4 py-2 rounded-lg z-50 animate-fade-in';
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.classList.add('animate-fade-out');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
}

// Initialize DownloadManager when DOM is loaded
const downloadManager = new DownloadManager(); 