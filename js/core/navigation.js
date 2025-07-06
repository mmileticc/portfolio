// Navigation functionality
class Navigation {
    constructor() {
        this.navToggle = document.querySelector('.nav-toggle');
        this.navLinks = document.querySelector('.nav-links');
        this.navbar = document.querySelector('.navbar');
        this.init();
    }

    init() {
        this.initMobileMenu();
        this.initScrollBehavior();
        this.initActiveLinks();
        this.resetMobileMenu();
    }

    resetMobileMenu() {
        // Reset mobile menu state when page loads
        if (this.navLinks) {
            this.navLinks.classList.remove('active');
        }
        if (this.navToggle) {
            this.navToggle.classList.remove('active');
        }
    }

    initMobileMenu() {
        if (this.navToggle && this.navLinks) {
            this.navToggle.addEventListener('click', () => {
                this.navLinks.classList.toggle('active');
                this.navToggle.classList.toggle('active');
            });

            // Close mobile menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!this.navToggle.contains(e.target) && !this.navLinks.contains(e.target)) {
                    this.navLinks.classList.remove('active');
                    this.navToggle.classList.remove('active');
                }
            });

            // Close mobile menu when clicking on a link
            this.navLinks.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    this.navLinks.classList.remove('active');
                    this.navToggle.classList.remove('active');
                });
            });
        }
    }

    initScrollBehavior() {
        if (this.navbar) {
            let lastScroll = 0;
            window.addEventListener('scroll', () => {
                const currentScroll = window.pageYOffset;
                
                if (currentScroll <= 0) {
                    this.navbar.classList.remove('scroll-up');
                    return;
                }
                
                if (currentScroll > lastScroll && !this.navbar.classList.contains('scroll-down')) {
                    // Scroll Down
                    this.navbar.classList.remove('scroll-up');
                    this.navbar.classList.add('scroll-down');
                } else if (currentScroll < lastScroll && this.navbar.classList.contains('scroll-down')) {
                    // Scroll Up
                    this.navbar.classList.remove('scroll-down');
                    this.navbar.classList.add('scroll-up');
                }
                lastScroll = currentScroll;
            });
        }
    }

    initActiveLinks() {
        const currentPath = window.location.pathname;
        document.querySelectorAll('.nav-links a').forEach(link => {
            if (currentPath.endsWith(link.getAttribute('href'))) {
                link.classList.add('active');
            }
        });
    }
}

// Initialize navigation
new Navigation(); 