// Project filtering functionality
class ProjectFilters {
    constructor() {
        this.categoryButtons = document.querySelectorAll('.filter-btn');
        this.techButtons = document.querySelectorAll('.tech-btn');
        this.projects = document.querySelectorAll('.project-card');
        
        this.init();
    }

    init() {
        if (!this.categoryButtons.length || !this.projects.length) return;

        this.categoryButtons.forEach(button => {
            button.addEventListener('click', () => this.filterByCategory(button));
        });

        this.techButtons.forEach(button => {
            button.addEventListener('click', () => this.filterByTech(button));
        });
    }

    filterByCategory(selectedButton) {
        // Update category buttons
        this.categoryButtons.forEach(button => button.classList.remove('active'));
        selectedButton.classList.add('active');

        const category = selectedButton.dataset.category;
        
        // Reset tech filter
        this.techButtons.forEach(button => button.classList.remove('active'));
        this.techButtons[0].classList.add('active');

        this.filterProjects(category, 'all');
    }

    filterByTech(selectedButton) {
        // Update tech buttons
        this.techButtons.forEach(button => button.classList.remove('active'));
        selectedButton.classList.add('active');

        const tech = selectedButton.dataset.tech;
        const activeCategory = document.querySelector('.filter-btn.active').dataset.category;

        this.filterProjects(activeCategory, tech);
    }

    filterProjects(category, tech) {
        this.projects.forEach(project => {
           /* const projectCategory = project.dataset.category;
            const projectTech = project.dataset.tech;
            
            const categoryMatch = category === 'all' || projectCategory === category;
            const techMatch = tech === 'all' || projectTech === tech;

            if (categoryMatch && techMatch) {
                project.style.display = 'block';
            } else {
                project.style.display = 'none';
            }*/
                const categories = project.dataset.category.split(" ");
                const techs = project.dataset.tech.split(" ");
                
                const categoryMatch = category === "all" || categories.includes(category);
                const techMatch = tech === "all" || techs.includes(tech);
                
                if (categoryMatch && techMatch) {
                    project.style.display = "block";
                } else {
                    project.style.display = "none";
                }
        });
    }
}

// Initialize filters
document.addEventListener('DOMContentLoaded', () => {
    new ProjectFilters();
}); 