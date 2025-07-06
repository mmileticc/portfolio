// Generic carousel functionality
class Carousel {
    constructor(container, options = {}) {
        this.container = container;
        this.track = container.querySelector('.facts-track');
        this.cards = Array.from(container.querySelectorAll('.fact-card'));
        this.prevBtn = container.querySelector('.prev-btn');
        this.nextBtn = container.querySelector('.next-btn');
        this.dotsContainer = container.querySelector('.carousel-dots');
        
        this.options = {
            autoplay: options.autoplay || false,
            autoplayInterval: options.autoplayInterval || 5000,
            ...options
        };

        this.currentIndex = 0;
        this.isAnimating = false;
        this.autoplayTimer = null;

        this.init();
    }

    init() {
        if (!this.track || !this.cards.length) return;

        this.setupDots();
        this.setupButtons();
        this.updateCarousel();
        this.setupResizeHandler();
        
        if (this.options.autoplay) {
            this.startAutoplay();
        }
    }

    setupDots() {
        if (!this.dotsContainer) return;

        this.cards.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.classList.add('carousel-dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => this.goToSlide(index));
            this.dotsContainer.appendChild(dot);
        });
    }

    setupButtons() {
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.prev());
        }
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.next());
        }
    }

    setupResizeHandler() {
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                this.updateCarousel();
            }, 250);
        });
    }

    updateCarousel() {
        if (!this.track || !this.cards.length) return;

        const cardWidth = this.cards[0].offsetWidth;
        const offset = -this.currentIndex * cardWidth;
        
        this.track.style.transform = `translateX(${offset}px)`;
        
        // Update dots
        if (this.dotsContainer) {
            const dots = this.dotsContainer.querySelectorAll('.carousel-dot');
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === this.currentIndex);
            });
        }

        // Update button states
        if (this.prevBtn) {
            this.prevBtn.disabled = this.currentIndex === 0;
        }
        if (this.nextBtn) {
            this.nextBtn.disabled = this.currentIndex === this.cards.length - 1;
        }
    }

    goToSlide(index) {
        if (this.isAnimating || index === this.currentIndex) return;
        
        this.isAnimating = true;
        this.currentIndex = index;
        this.updateCarousel();
        
        setTimeout(() => {
            this.isAnimating = false;
        }, 300);
    }

    next() {
        if (this.currentIndex < this.cards.length - 1) {
            this.goToSlide(this.currentIndex + 1);
        }
    }

    prev() {
        if (this.currentIndex > 0) {
            this.goToSlide(this.currentIndex - 1);
        }
    }

    startAutoplay() {
        this.autoplayTimer = setInterval(() => {
            if (this.currentIndex === this.cards.length - 1) {
                this.goToSlide(0);
            } else {
                this.next();
            }
        }, this.options.autoplayInterval);
    }

    stopAutoplay() {
        if (this.autoplayTimer) {
            clearInterval(this.autoplayTimer);
            this.autoplayTimer = null;
        }
    }
}

// Export the Carousel class
export default Carousel; 