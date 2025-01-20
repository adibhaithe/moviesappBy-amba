document.addEventListener('DOMContentLoaded', () => {
    // Get DOM elements
    const profileImage = document.getElementById('profileImage');
    const changePhotoBtn = document.getElementById('changePhotoBtn');
    const accountForm = document.getElementById('accountForm');
    const signOutBtn = document.getElementById('signOutBtn');

    // Load user data from localStorage or use defaults
    const userData = JSON.parse(localStorage.getItem('userData')) || {
        name: 'User Name',
        email: 'user@email.com',
        isAdmin: false,
        notifications: {
            newReleases: true,
            recommendations: true,
            updates: false
        },
        downloadSettings: {
            quality: 'auto',
            wifiOnly: true,
            storageLocation: 'internal'
        }
    };

    // Initialize form values
    function initializeForm() {
        // Show admin access if user is admin
        const adminAccess = document.getElementById('adminAccess');
        if (userData.isAdmin) {
            adminAccess.classList.remove('hidden');
        }

        document.getElementById('profileName').textContent = userData.name;
        document.getElementById('profileEmail').textContent = userData.email;
        document.getElementById('nameInput').value = userData.name;
        document.getElementById('emailInput').value = userData.email;

        // Notification checkboxes
        document.getElementById('newReleasesNotif').checked = userData.notifications.newReleases;
        document.getElementById('recommendationsNotif').checked = userData.notifications.recommendations;
        document.getElementById('updatesNotif').checked = userData.notifications.updates;

        // Download settings
        document.getElementById('downloadQuality').value = userData.downloadSettings.quality;
        document.getElementById('wifiOnlyDownload').checked = userData.downloadSettings.wifiOnly;
        document.getElementById('storageLocation').value = userData.downloadSettings.storageLocation;
    }

    // Toggle settings sections
    window.toggleSection = function(sectionId) {
        const section = document.getElementById(sectionId);
        const arrow = document.getElementById(sectionId.replace('Settings', 'Arrow'));
        section.classList.toggle('hidden');
        arrow.classList.toggle('rotate-180');
    };

    // Handle profile photo change
    changePhotoBtn.addEventListener('click', () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    profileImage.src = e.target.result;
                    userData.profileImage = e.target.result;
                    saveUserData();
                };
                reader.readAsDataURL(file);
            }
        };
        input.click();
    });

    // Handle account form submission
    accountForm.addEventListener('submit', (e) => {
        e.preventDefault();
        userData.name = document.getElementById('nameInput').value;
        userData.email = document.getElementById('emailInput').value;
        
        // Update display
        document.getElementById('profileName').textContent = userData.name;
        document.getElementById('profileEmail').textContent = userData.email;
        
        saveUserData();
        showToast('Account settings updated!');
    });

    // Handle notification changes
    ['newReleasesNotif', 'recommendationsNotif', 'updatesNotif'].forEach(id => {
        document.getElementById(id).addEventListener('change', (e) => {
            const setting = id.replace('Notif', '');
            userData.notifications[setting] = e.target.checked;
            saveUserData();
            showToast('Notification settings updated!');
        });
    });

    // Handle download setting changes
    ['downloadQuality', 'storageLocation'].forEach(id => {
        document.getElementById(id).addEventListener('change', (e) => {
            userData.downloadSettings[id] = e.target.value;
            saveUserData();
            showToast('Download settings updated!');
        });
    });

    document.getElementById('wifiOnlyDownload').addEventListener('change', (e) => {
        userData.downloadSettings.wifiOnly = e.target.checked;
        saveUserData();
        showToast('Download settings updated!');
    });

    // Handle sign out
    signOutBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to sign out?')) {
            localStorage.removeItem('userData');
            window.location.href = 'index.html'; // Redirect to home page
        }
    });

    // Save user data to localStorage
    function saveUserData() {
        localStorage.setItem('userData', JSON.stringify(userData));
    }

    // Show toast message
    function showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-lg';
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }

    // Initialize the form with user data
    initializeForm();
});

class ProfileManager {
    constructor() {
        this.defaultProfileData = {
            name: 'John Doe',
            email: 'john.doe@example.com',
            avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=7C3AED&color=fff',
            settings: {
                notifications: true,
                autoplay: true,
                videoQuality: 'auto',
                wifiOnly: true,
                language: 'en',
                subtitles: true,
                storageUsed: '2.1 GB'
            }
        };

        this.profileData = JSON.parse(localStorage.getItem('profileData')) || this.defaultProfileData;
        this.initializeUI();
        this.setupEventListeners();
    }

    initializeUI() {
        // Update profile information
        document.getElementById('profileName').textContent = this.profileData.name;
        document.getElementById('profileEmail').textContent = this.profileData.email;
        document.querySelector('.profile-avatar').src = this.profileData.avatar;

        // Initialize toggle states
        document.querySelectorAll('.setting-toggle').forEach(toggle => {
            const setting = toggle.dataset.setting;
            if (this.profileData.settings[setting] !== undefined) {
                this.updateToggleState(toggle, this.profileData.settings[setting]);
            }
        });

        // Initialize select elements
        document.querySelectorAll('.setting-select').forEach(select => {
            const setting = select.dataset.setting;
            if (this.profileData.settings[setting]) {
                select.value = this.profileData.settings[setting];
                
                // Update labels
                if (setting === 'videoQuality') {
                    document.getElementById('qualityLabel').textContent = 
                        select.options[select.selectedIndex].text;
                } else if (setting === 'language') {
                    document.getElementById('languageLabel').textContent = 
                        select.options[select.selectedIndex].text;
                }
            }
        });

        // Update storage label
        const storageLabel = document.getElementById('storageLabel');
        if (storageLabel) {
            storageLabel.textContent = this.profileData.settings.storageUsed;
        }
    }

    setupEventListeners() {
        // Quick Action Buttons
        document.getElementById('openAccountBtn')?.addEventListener('click', () => this.openAccountSettingsModal());
        document.getElementById('openPreferencesBtn')?.addEventListener('click', () => this.openPreferencesModal());

        // Avatar Edit Button
        document.querySelector('.avatar-edit-btn')?.addEventListener('click', () => this.handleAvatarEdit());

        // Setting Toggles
        document.querySelectorAll('.setting-toggle').forEach(toggle => {
            toggle.addEventListener('click', (e) => this.handleSettingToggle(e));
        });

        // Select elements
        document.querySelectorAll('.setting-select').forEach(select => {
            select.addEventListener('change', (e) => this.handleSettingSelect(e));
        });

        // Clear Data button
        document.getElementById('clearDataBtn')?.addEventListener('click', () => this.handleClearData());
    }

    handleSettingToggle(e) {
        const toggle = e.currentTarget;
        const setting = toggle.dataset.setting;
        const newValue = !this.profileData.settings[setting];
        
        this.profileData.settings[setting] = newValue;
        this.updateToggleState(toggle, newValue);
        this.saveToLocalStorage();
        
        this.showToast(`${setting.charAt(0).toUpperCase() + setting.slice(1)} ${newValue ? 'enabled' : 'disabled'}`);
    }

    updateToggleState(toggle, value) {
        toggle.classList.toggle('bg-purple-600', value);
        toggle.classList.toggle('bg-gray-600', !value);
        const dot = toggle.querySelector('span');
        if (dot) {
            dot.style.transform = value ? 'translateX(24px)' : 'translateX(0)';
        }
    }

    handleSettingSelect(e) {
        const select = e.currentTarget;
        const setting = select.dataset.setting;
        const value = select.value;
        
        this.profileData.settings[setting] = value;
        
        const label = document.getElementById(`${setting}Label`);
        if (label) {
            label.textContent = select.options[select.selectedIndex].text;
        }
        
        this.saveToLocalStorage();
        this.showToast(`${setting.charAt(0).toUpperCase() + setting.slice(1)} updated`);
    }

    handleAvatarEdit() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.style.display = 'none';
        
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    this.profileData.avatar = e.target.result;
                    document.querySelector('.profile-avatar').src = e.target.result;
                    this.saveToLocalStorage();
                    this.showToast('Profile picture updated');
                };
                reader.readAsDataURL(file);
            }
        };
        
        input.click();
    }

    openAccountSettingsModal() {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50';
        modal.innerHTML = `
            <div class="bg-[#28303D] rounded-lg p-6 w-[90%] max-w-md mx-4 space-y-6 max-h-[90vh] overflow-y-auto">
                <div class="flex justify-between items-center">
                    <h3 class="text-xl font-semibold">Account Settings</h3>
                    <button class="close-modal p-2 hover:bg-white/10 rounded-full">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                    </button>
                </div>

                <div class="space-y-4">
                    <div>
                        <label class="text-sm text-gray-400">Name</label>
                        <input type="text" id="nameInput" value="${this.profileData.name}"
                               class="w-full bg-[#1A1A26] rounded-lg p-3 mt-1 focus:outline-none focus:ring-2 focus:ring-purple-500">
                    </div>
                    <div>
                        <label class="text-sm text-gray-400">Email</label>
                        <input type="email" id="emailInput" value="${this.profileData.email}"
                               class="w-full bg-[#1A1A26] rounded-lg p-3 mt-1 focus:outline-none focus:ring-2 focus:ring-purple-500">
                    </div>

                    <div class="pt-4 border-t border-gray-700">
                        <h4 class="text-lg font-semibold mb-4">Change Password</h4>
                        <div class="space-y-4">
                            <div>
                                <label class="text-sm text-gray-400">Current Password</label>
                                <input type="password" id="currentPassword" placeholder="Enter current password"
                                       class="w-full bg-[#1A1A26] rounded-lg p-3 mt-1 focus:outline-none focus:ring-2 focus:ring-purple-500">
                            </div>
                            <div>
                                <label class="text-sm text-gray-400">New Password</label>
                                <input type="password" id="newPassword" placeholder="Enter new password"
                                       class="w-full bg-[#1A1A26] rounded-lg p-3 mt-1 focus:outline-none focus:ring-2 focus:ring-purple-500">
                            </div>
                            <div>
                                <label class="text-sm text-gray-400">Confirm Password</label>
                                <input type="password" id="confirmPassword" placeholder="Confirm new password"
                                       class="w-full bg-[#1A1A26] rounded-lg p-3 mt-1 focus:outline-none focus:ring-2 focus:ring-purple-500">
                            </div>
                        </div>
                    </div>

                    <div class="pt-4 border-t border-gray-700">
                        <button class="text-red-500 hover:text-red-400 text-sm flex items-center gap-2" id="deleteAccountBtn">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                            </svg>
                            Delete Account
                        </button>
                    </div>
                </div>

                <div class="flex gap-3 pt-4">
                    <button class="flex-1 px-4 py-2 bg-gray-600 rounded-lg hover:bg-gray-700 transition-colors close-modal">
                        Cancel
                    </button>
                    <button class="flex-1 px-4 py-2 bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors" id="saveAccountBtn">
                        Save Changes
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Handle modal close
        modal.querySelectorAll('.close-modal').forEach(btn => {
            btn.addEventListener('click', () => modal.remove());
        });

        // Handle save changes
        modal.querySelector('#saveAccountBtn').addEventListener('click', () => {
            const newName = document.getElementById('nameInput').value.trim();
            const newEmail = document.getElementById('emailInput').value.trim();
            const currentPassword = document.getElementById('currentPassword').value;
            const newPassword = document.getElementById('newPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

            if (!newName || !newEmail) {
                this.showToast('Please fill in name and email', 'error');
                return;
            }

            if (!this.isValidEmail(newEmail)) {
                this.showToast('Please enter a valid email', 'error');
                return;
            }

            if (currentPassword || newPassword || confirmPassword) {
                if (!currentPassword || !newPassword || !confirmPassword) {
                    this.showToast('Please fill in all password fields', 'error');
                    return;
                }

                if (newPassword !== confirmPassword) {
                    this.showToast('New passwords do not match', 'error');
                    return;
                }

                if (newPassword.length < 8) {
                    this.showToast('Password must be at least 8 characters', 'error');
                    return;
                }
            }

            this.profileData.name = newName;
            this.profileData.email = newEmail;
            this.saveToLocalStorage();
            this.initializeUI();
            modal.remove();
            this.showToast('Profile updated successfully');
        });

        // Handle delete account
        modal.querySelector('#deleteAccountBtn').addEventListener('click', () => {
            this.showDeleteAccountConfirmation();
            modal.remove();
        });

        // Close modal when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    showDeleteAccountConfirmation() {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50';
        modal.innerHTML = `
            <div class="bg-[#28303D] rounded-lg p-6 w-[90%] max-w-md mx-4">
                <h3 class="text-xl font-semibold text-red-500 mb-4">Delete Account</h3>
                <p class="text-gray-300 mb-6">This action cannot be undone. All your data will be permanently deleted.</p>
                <div class="space-y-4 mb-6">
                    <input type="password" placeholder="Enter your password to confirm" 
                           class="w-full bg-[#1A1A26] rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-500"
                           id="deleteConfirmPassword">
                </div>
                <div class="flex gap-3">
                    <button class="flex-1 px-4 py-2 bg-gray-600 rounded-lg hover:bg-gray-700 transition-colors cancel-delete">
                        Cancel
                    </button>
                    <button class="flex-1 px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700 transition-colors confirm-delete">
                        Delete Account
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        modal.querySelector('.cancel-delete').addEventListener('click', () => modal.remove());
        modal.querySelector('.confirm-delete').addEventListener('click', () => {
            const password = document.getElementById('deleteConfirmPassword').value;
            if (!password) {
                this.showToast('Please enter your password', 'error');
                return;
            }

            localStorage.removeItem('profileData');
            this.showToast('Account deleted successfully');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
        });
    }

    isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    saveToLocalStorage() {
        localStorage.setItem('profileData', JSON.stringify(this.profileData));
    }

    showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `fixed bottom-24 left-1/2 transform -translate-x-1/2 
                          ${type === 'success' ? 'bg-purple-500' : 'bg-red-500'} 
                          text-white px-4 py-2 rounded-lg z-50
                          flex items-center gap-2 shadow-lg`;
        toast.innerHTML = `
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                ${type === 'success' 
                    ? '<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>'
                    : '<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>'}
            </svg>
            ${message}
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translate(-50%, 20px)';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    handleClearData() {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50';
        modal.innerHTML = `
            <div class="bg-[#28303D] rounded-lg p-6 w-[90%] max-w-md mx-4">
                <h3 class="text-xl font-semibold mb-4">Clear App Data</h3>
                <p class="text-gray-300 mb-6">This will clear all cached data and downloaded content. This action cannot be undone.</p>
                <div class="flex gap-3">
                    <button class="flex-1 px-4 py-2 bg-gray-600 rounded-lg hover:bg-gray-700 transition-colors cancel-clear">
                        Cancel
                    </button>
                    <button class="flex-1 px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700 transition-colors confirm-clear">
                        Clear Data
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        modal.querySelector('.cancel-clear').addEventListener('click', () => modal.remove());
        modal.querySelector('.confirm-clear').addEventListener('click', () => {
            this.profileData.settings.storageUsed = '0 B';
            document.getElementById('storageLabel').textContent = '0 B';
            this.saveToLocalStorage();
            this.showToast('App data cleared');
            modal.remove();
        });
    }

    openPreferencesModal() {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-modal-fade-in';
        modal.innerHTML = `
            <div class="bg-[#28303D] rounded-lg p-6 w-[90%] max-w-md mx-4 space-y-6 animate-modal-slide-up">
                <div class="flex justify-between items-center">
                    <h3 class="text-xl font-semibold">Preferences</h3>
                    <button class="close-modal p-2 hover:bg-white/10 rounded-full">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                    </button>
                </div>
                
                <div class="space-y-4">
                    <!-- Video Quality -->
                    <div class="flex items-center justify-between p-3">
                        <div class="flex items-center gap-3">
                            <svg class="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                      d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                            </svg>
                            <div class="flex flex-col">
                                <span>Video Quality</span>
                                <span class="text-sm text-gray-400" id="qualityLabel">Auto</span>
                            </div>
                        </div>
                        <select class="bg-[#1A1A26] rounded-lg px-3 py-1 setting-select" data-setting="videoQuality">
                            <option value="auto">Auto</option>
                            <option value="4k">4K</option>
                            <option value="1080p">1080p</option>
                            <option value="720p">720p</option>
                            <option value="480p">480p</option>
                        </select>
                    </div>

                    <!-- Add other preference options here -->
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Handle modal animations
        requestAnimationFrame(() => {
            modal.querySelector('div').classList.add('modal-active');
        });

        // Close modal with animation
        const closeModal = () => {
            modal.classList.add('animate-modal-fade-out');
            modal.querySelector('div').classList.add('animate-modal-slide-down');
            setTimeout(() => modal.remove(), 300);
        };

        modal.querySelectorAll('.close-modal').forEach(btn => {
            btn.addEventListener('click', closeModal);
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    }
}

// Initialize ProfileManager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const scrollAnimator = new ScrollAnimator();
    scrollAnimator.observeAll();
    new ProfileManager();
}); 