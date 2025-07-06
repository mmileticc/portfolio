// Intersection Observer for scroll animations
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Add animation classes to elements
document.addEventListener('DOMContentLoaded', () => {
    // Add fade-in to sections
    document.querySelectorAll('section').forEach(section => {
        section.classList.add('fade-in');
        observer.observe(section);
    });

    // Add slide-in-left to odd sections
    document.querySelectorAll('section:nth-child(odd)').forEach(section => {
        section.classList.remove('fade-in');
        section.classList.add('slide-in-left');
    });

    // Add slide-in-right to even sections
    document.querySelectorAll('section:nth-child(even)').forEach(section => {
        section.classList.remove('fade-in');
        section.classList.add('slide-in-right');
    });

    // Add fade-in to project cards
    document.querySelectorAll('.project-card').forEach(card => {
        card.classList.add('fade-in');
        observer.observe(card);
    });
});

// Loading animation
window.addEventListener('load', () => {
    const loader = document.querySelector('.loading-overlay');
    if (loader) {
        loader.classList.add('hidden');
        setTimeout(() => {
            loader.style.display = 'none';
        }, 500);
    }
}); 