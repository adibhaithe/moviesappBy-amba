class ScrollAnimator {
    constructor() {
        this.observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    if (!entry.target.dataset.persistAnimation) {
                        this.observer.unobserve(entry.target);
                    }
                } else if (entry.target.dataset.persistAnimation) {
                    entry.target.classList.remove('animate-in');
                }
            });
        }, this.observerOptions);
    }

    observe(elements) {
        elements.forEach(element => {
            element.classList.add('animate-prepare');
            this.observer.observe(element);
        });
    }

    observeAll() {
        // Sections
        document.querySelectorAll('section').forEach((section, index) => {
            section.style.setProperty('--animation-delay', `${index * 0.1}s`);
            section.classList.add('animate-prepare', 'fade-up');
            this.observer.observe(section);
        });

        // Individual items within sections
        document.querySelectorAll('.animate-item').forEach((item, index) => {
            item.style.setProperty('--animation-delay', `${index * 0.1}s`);
            item.classList.add('animate-prepare', 'fade-up');
            this.observer.observe(item);
        });

        // Titles and descriptions
        document.querySelectorAll('.title-animate, .desc-animate').forEach((element) => {
            const parent = element.closest('.animate-item') || element.closest('section');
            if (parent) {
                const observer = new MutationObserver((mutations) => {
                    mutations.forEach((mutation) => {
                        if (mutation.target.classList.contains('animate-in')) {
                            element.style.opacity = '1';
                            element.style.transform = 'translateX(0)';
                        }
                    });
                });
                observer.observe(parent, { attributes: true, attributeFilter: ['class'] });
            }
        });
    }
} 