import Carousel from './carousel.js';

// Initialize random facts carousel
const factsContainer = document.querySelector('.facts-container');
if (factsContainer) {
    new Carousel(factsContainer, {
        autoplay: true,
        autoplayInterval: 5000
    });
} 