// DOM elements
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav__link');
const estimateForm = document.getElementById('estimate-form');

// Mobile menu functionality
function toggleMobileMenu() {
    navMenu.classList.toggle('show-menu');
    navToggle.classList.toggle('active');
}

// Close mobile menu when clicking on a link
function closeMobileMenu() {
    navMenu.classList.remove('show-menu');
    navToggle.classList.remove('active');
}

// Smooth scrolling for navigation links
function smoothScroll(e) {
    e.preventDefault();
    const targetId = this.getAttribute('href').substring(1);
    const targetElement = document.getElementById(targetId);
    
    if (targetElement) {
        const headerHeight = document.querySelector('.header').offsetHeight;
        const targetPosition = targetElement.offsetTop - headerHeight;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
    
    closeMobileMenu();
}


// Update active navigation link based on scroll position
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.scrollY + 100; // Offset for header
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        const correspondingNavLink = document.querySelector(`.nav__link[href="#${sectionId}"]`);
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navLinks.forEach(link => link.classList.remove('active-link'));
            if (correspondingNavLink) {
                correspondingNavLink.classList.add('active-link');
            }
        }
    });
}

// Header background on scroll
function updateHeaderBackground() {
    const header = document.querySelector('.header');
    const scrolled = window.scrollY > 50;
    
    if (scrolled) {
        header.style.setProperty('background-color', 'rgba(0, 0, 0, 0.98)', 'important');
        header.style.setProperty('box-shadow', '0 2px 20px rgba(0, 0, 0, 0.3)', 'important');
    } else {
        header.style.setProperty('background-color', 'rgba(0, 0, 0, 0.95)', 'important');
        header.style.setProperty('box-shadow', 'none', 'important');
    }
}

// Form validation and submission
function validateForm(formData) {
    const errors = [];
    
    if (!formData.get('name') || formData.get('name').trim().length < 2) {
        errors.push('Please enter a valid name (at least 2 characters)');
    }
    
    const phone = formData.get('phone');
    const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    if (!phone || !phoneRegex.test(phone.replace(/\s/g, ''))) {
        errors.push('Please enter a valid phone number');
    }
    
    const email = formData.get('email');
    if (email && email.trim() !== '') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            errors.push('Please enter a valid email address');
        }
    }
    
    if (!formData.get('service')) {
        errors.push('Please select a service');
    }
    
    if (!formData.get('details') || formData.get('details').trim().length < 10) {
        errors.push('Please provide details about what needs to be removed (at least 10 characters)');
    }
    
    return errors;
}

function showFormMessage(message, isError = false) {
    // Remove any existing message
    const existingMessage = document.querySelector('.form__message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create new message element
    const messageElement = document.createElement('div');
    messageElement.className = `form__message ${isError ? 'form__message--error' : 'form__message--success'}`;
    messageElement.textContent = message;
    
    // Insert message at the top of the form
    const form = document.getElementById('estimate-form');
    form.insertBefore(messageElement, form.firstChild);
    
    // Remove message after 5 seconds
    setTimeout(() => {
        messageElement.remove();
    }, 5000);
    
    // Scroll to message
    messageElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function handleFormSubmission(e) {
    e.preventDefault();
    
    const formData = new FormData(estimateForm);
    const errors = validateForm(formData);
    
    if (errors.length > 0) {
        showFormMessage(errors.join('. '), true);
        return;
    }
    
    // Show loading state
    const submitButton = estimateForm.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.textContent;
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;
    
    // Simulate form submission (replace with actual form handling)
    setTimeout(() => {
        // Reset button
        submitButton.textContent = originalButtonText;
        submitButton.disabled = false;
        
        // Show success message
        showFormMessage('Thank you! We\'ll contact you within 30 minutes with your free estimate.');
        
        // Reset form
        estimateForm.reset();
        
        // Remove active states from form labels
        const labels = estimateForm.querySelectorAll('.form__label');
        labels.forEach(label => {
            label.style.transform = '';
            label.style.color = '';
        });
    }, 2000);
}

// Intersection Observer for animations
function createIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.target.classList.contains('process-step')) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateX(0)';
                } else {
                    entry.target.classList.add('fade-in-up');
                }
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const elementsToAnimate = document.querySelectorAll(
        '.service-card, .feature, .step, .process-step, .testimonial, .contact__item'
    );
    
    elementsToAnimate.forEach(element => {
        observer.observe(element);
    });
}

// Phone number formatting
function formatPhoneNumber(input) {
    // Remove all non-digit characters
    const cleaned = input.value.replace(/\D/g, '');
    
    // Format as (XXX) XXX-XXXX
    let formatted = cleaned;
    if (cleaned.length >= 6) {
        formatted = `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
    } else if (cleaned.length >= 3) {
        formatted = `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
    } else if (cleaned.length > 0) {
        formatted = `(${cleaned}`;
    }
    
    input.value = formatted;
}

// Click to call functionality
function initClickToCall() {
    const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
    
    phoneLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // Analytics or tracking could be added here
            console.log('Phone call initiated:', link.href);
        });
    });
}

// Lazy loading for images (when added)
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Local storage for form data (auto-save)
function initFormAutoSave() {
    const formInputs = estimateForm.querySelectorAll('input, select, textarea');
    
    // Load saved data
    formInputs.forEach(input => {
        const savedValue = localStorage.getItem(`form_${input.id}`);
        if (savedValue && input.type !== 'submit') {
            input.value = savedValue;
            // Trigger label animation for filled inputs
            if (input.value) {
                const label = input.previousElementSibling;
                if (label && label.classList.contains('form__label')) {
                    label.style.transform = 'translateY(-12px) scale(0.8)';
                    label.style.color = 'var(--primary-color)';
                    label.style.backgroundColor = 'var(--surface-color)';
                    label.style.padding = '0 var(--space-2)';
                }
            }
        }
    });
    
    // Save data on input
    formInputs.forEach(input => {
        input.addEventListener('input', () => {
            if (input.type !== 'submit') {
                localStorage.setItem(`form_${input.id}`, input.value);
            }
        });
    });
    
    // Clear saved data on successful submission
    estimateForm.addEventListener('submit', () => {
        formInputs.forEach(input => {
            localStorage.removeItem(`form_${input.id}`);
        });
    });
}

// Create and add scroll-to-top button
function createScrollToTopButton() {
    const scrollBtn = document.createElement('button');
    scrollBtn.className = 'scroll-to-top';
    scrollBtn.setAttribute('aria-label', 'Scroll to top');
    scrollBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    document.body.appendChild(scrollBtn);
    return scrollBtn; // Return button reference for main scroll handler
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu toggle
    if (navToggle) {
        navToggle.addEventListener('click', toggleMobileMenu);
    }
    
    // Navigation links
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && (href.startsWith('#') || href.includes('#'))) {
            // Only add smooth scroll for same-page links
            if (href.startsWith('#') || href.startsWith(window.location.pathname + '#')) {
                link.addEventListener('click', smoothScroll);
            }
        }
    });
    
    
    // Form submission with error handling
    if (estimateForm) {
        estimateForm.addEventListener('submit', handleFormSubmission);
        
        // Phone number formatting
        const phoneInput = document.getElementById('phone');
        if (phoneInput) {
            phoneInput.addEventListener('input', () => formatPhoneNumber(phoneInput));
            // Add mobile-specific input improvements
            phoneInput.setAttribute('inputmode', 'tel');
            phoneInput.setAttribute('autocomplete', 'tel');
        }
        
        // Email input improvements
        const emailInput = document.getElementById('email');
        if (emailInput) {
            emailInput.setAttribute('inputmode', 'email');
            emailInput.setAttribute('autocomplete', 'email');
        }
        
        // Name input improvements
        const nameInput = document.getElementById('name');
        if (nameInput) {
            nameInput.setAttribute('autocomplete', 'name');
        }
        
        // Initialize form auto-save
        initFormAutoSave();
    }
    
    // Initialize other features
    createIntersectionObserver();
    initClickToCall();
    initLazyLoading();
    
    // Create scroll-to-top button and get reference
    window.scrollToTopBtn = createScrollToTopButton();
});

// Consolidated scroll event listener
window.addEventListener('scroll', () => {
    updateActiveNavLink();
    updateHeaderBackground();
    
    // Handle scroll-to-top button visibility
    if (window.scrollToTopBtn) {
        if (window.scrollY > 300) {
            window.scrollToTopBtn.classList.add('visible');
        } else {
            window.scrollToTopBtn.classList.remove('visible');
        }
    }
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (navMenu && navToggle && !navMenu.contains(e.target) && !navToggle.contains(e.target)) {
        closeMobileMenu();
    }
});

// Handle escape key for mobile menu
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeMobileMenu();
    }
});

// Resize event listener with mobile optimizations
window.addEventListener('resize', () => {
    // Close mobile menu on resize to desktop
    if (window.innerWidth > 768) {
        closeMobileMenu();
    }
    
    // Handle mobile keyboard appearance
    const viewportHeight = window.visualViewport ? window.visualViewport.height : window.innerHeight;
    document.documentElement.style.setProperty('--viewport-height', `${viewportHeight}px`);
});

// Handle mobile keyboard with visual viewport API
if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', () => {
        const viewportHeight = window.visualViewport.height;
        document.documentElement.style.setProperty('--viewport-height', `${viewportHeight}px`);
    });
}

// Page visibility API for analytics
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        console.log('Page hidden - user likely switched tabs');
    } else {
        console.log('Page visible - user returned to tab');
    }
});

// Add CSS for form messages
const style = document.createElement('style');
style.textContent = `
    .form__message {
        padding: var(--space-4);
        border-radius: var(--border-radius);
        margin-bottom: var(--space-6);
        font-weight: 500;
        text-align: center;
        animation: slideInDown 0.3s ease-out;
    }
    
    .form__message--success {
        background-color: #d1fae5;
        color: #065f46;
        border: 1px solid #10b981;
    }
    
    .form__message--error {
        background-color: #fee2e2;
        color: #991b1b;
        border: 1px solid #ef4444;
    }
    
    @keyframes slideInDown {
        from {
            opacity: 0;
            transform: translateY(-20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .lazy {
        opacity: 0;
        transition: opacity 0.3s;
    }
    
    .lazy.loaded {
        opacity: 1;
    }
`;
document.head.appendChild(style);