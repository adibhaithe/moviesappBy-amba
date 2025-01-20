class ThemeManager {
    constructor() {
        this.initialize();
        this.setupListeners();
    }

    initialize() {
        // Get theme from localStorage or default to dark
        const savedTheme = localStorage.getItem('theme') || 'dark';
        this.applyTheme(savedTheme === 'dark');
    }

    applyTheme(isDark) {
        const root = document.documentElement;
        
        // Toggle theme classes
        root.classList.toggle('dark', isDark);
        root.classList.toggle('light', !isDark);
        
        // Update CSS variables
        if (isDark) {
            root.style.setProperty('--bg-primary', '#1A1A26');
            root.style.setProperty('--bg-secondary', '#28303D');
            root.style.setProperty('--text-primary', '#ffffff');
            root.style.setProperty('--text-secondary', '#9ca3af');
            root.style.setProperty('--nav-bg', 'rgba(26, 26, 38, 0.8)');
            root.style.setProperty('--card-bg', '#28303D');
            root.style.setProperty('--input-bg', '#1A1A26');
        } else {
            root.style.setProperty('--bg-primary', '#ffffff');
            root.style.setProperty('--bg-secondary', '#f3f4f6');
            root.style.setProperty('--text-primary', '#111827');
            root.style.setProperty('--text-secondary', '#4b5563');
            root.style.setProperty('--nav-bg', 'rgba(255, 255, 255, 0.8)');
            root.style.setProperty('--card-bg', '#ffffff');
            root.style.setProperty('--input-bg', '#f3f4f6');
        }

        // Update body classes
        document.body.className = isDark 
            ? 'bg-[--bg-primary] text-[--text-primary]'
            : 'bg-[--bg-primary] text-[--text-primary]';
    }

    setupListeners() {
        // Listen for theme changes from profile page
        window.addEventListener('themechange', (e) => {
            this.applyTheme(e.detail.isDark);
        });

        // Listen for storage changes (if theme is changed in another tab)
        window.addEventListener('storage', (e) => {
            if (e.key === 'theme') {
                this.applyTheme(e.newValue === 'dark');
            }
        });
    }
} 