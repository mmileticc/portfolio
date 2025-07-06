// Initialize EmailJS
emailjs.init("OSz2IRCJ4LTLo9usf");

// Rate Limiting
const rateLimiter = {
    attempts: 0,
    lastAttempt: 0,
    maxAttempts: 5,
    timeWindow: 3600000, // 1 hour in milliseconds

    canMakeRequest() {
        const now = Date.now();
        if (now - this.lastAttempt > this.timeWindow) {
            this.attempts = 0;
            this.lastAttempt = now;
        }
        return this.attempts < this.maxAttempts;
    },

    recordAttempt() {
        this.attempts++;
        this.lastAttempt = Date.now();
    }
};

// Form Validation
const validators = {
    name: (value) => {
        if (!value) return 'Name is required';
        if (value.length < 2) return 'Name must be at least 2 characters';
        if (value.length > 50) return 'Name must be less than 50 characters';
        return null;
    },
    email: (value) => {
        if (!value) return 'Email is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Invalid email format';
        return null;
    },
    subject: (value) => {
        if (!value) return 'Subject is required';
        if (value.length < 3) return 'Subject must be at least 3 characters';
        if (value.length > 100) return 'Subject must be less than 100 characters';
        return null;
    },
    message: (value) => {
        if (!value) return 'Message is required';
        if (value.length < 10) return 'Message must be at least 10 characters';
        if (value.length > 1000) return 'Message must be less than 1000 characters';
        return null;
    }
};

// Form Status Display
function showFormStatus(message, type) {
    const statusElement = document.getElementById('form-status');
    statusElement.textContent = message;
    statusElement.className = type;
    statusElement.style.display = 'block';
    
    if (type === 'success') {
        setTimeout(() => {
            statusElement.style.display = 'none';
        }, 5000);
    }
}

// Initialize form handling
function initializeContactForm() {
    const form = document.getElementById('contact-form');
    
    if (!form) {
        console.error('Contact form not found!');
        return;
    }

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        console.log('Form submitted'); // Debug log

        // Check rate limit
        if (!rateLimiter.canMakeRequest()) {
            showFormStatus('Too many attempts. Please try again later.', 'error');
            return;
        }

        // Get form data
        const formData = {
            name: this.name.value.trim(),
            email: this.email.value.trim(),
            subject: this.subject.value.trim(),
            message: this.message.value.trim()
        };

        console.log('Form data:', formData); // Debug log

        // Validate all fields
        let hasError = false;
        for (const [field, value] of Object.entries(formData)) {
            const error = validators[field](value);
            if (error) {
                showFormStatus(error, 'error');
                hasError = true;
                break;
            }
        }

        if (hasError) return;

        // Show loading state
        const submitButton = this.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.innerHTML;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitButton.disabled = true;

        try {
            console.log('Sending email...'); // Debug log
            const response = await emailjs.send(
                "service_ujzxbu7",
                "template_cakjsn6",
                formData
            );

            console.log('EmailJS Response:', response); // Debug log

            if (response.status === 200) {
                showFormStatus('Message sent successfully!', 'success');
                this.reset();
            } else {
                throw new Error('Failed to send message');
            }
        } catch (error) {
            console.error('Error sending email:', error);
            showFormStatus('Failed to send message. Please try again later.', 'error');
        } finally {
            // Reset button state
            submitButton.innerHTML = originalButtonText;
            submitButton.disabled = false;
            rateLimiter.recordAttempt();
        }
    });

    // Real-time validation
    form.querySelectorAll('input, textarea').forEach(input => {
        input.addEventListener('blur', function() {
            const error = validators[this.name](this.value.trim());
            if (error) {
                showFormStatus(error, 'error');
            } else {
                document.getElementById('form-status').style.display = 'none';
            }
        });
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeContactForm); 