// DOM elements
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav__link');
const estimateForm = document.getElementById('estimate-form');

// Mobile menu functionality - FIXED
function toggleMobileMenu() {
    console.log('Toggle menu clicked'); // Debug log
    
    if (navMenu && navToggle) {
        const isOpen = navMenu.classList.contains('show-menu');
        console.log('Menu is currently open:', isOpen); // Debug log
        
        navMenu.classList.toggle('show-menu');
        navToggle.classList.toggle('active');
        
        // Force styles to ensure menu shows
        if (!isOpen) {
            navMenu.style.left = '0';
            navMenu.style.visibility = 'visible';
            navMenu.style.opacity = '1';
            document.body.classList.add('menu-open');
            document.body.style.top = `-${window.scrollY}px`;
        } else {
            navMenu.style.left = '-100%';
            navMenu.style.visibility = 'hidden';
            navMenu.style.opacity = '0';
            const scrollY = document.body.style.top;
            document.body.classList.remove('menu-open');
            document.body.style.top = '';
            if (scrollY) {
                window.scrollTo(0, parseInt(scrollY || '0') * -1);
            }
        }
    } else {
        console.error('Menu elements not found:', { navMenu, navToggle }); // Debug log
    }
}

// Close mobile menu when clicking on a link - FIXED
function closeMobileMenu() {
    if (navMenu && navToggle) {
        navMenu.classList.remove('show-menu');
        navToggle.classList.remove('active');
        
        // Force close styles
        navMenu.style.left = '-100%';
        navMenu.style.visibility = 'hidden';
        navMenu.style.opacity = '0';
        
        // Restore body scroll
        const scrollY = document.body.style.top;
        document.body.classList.remove('menu-open');
        document.body.style.top = '';
        if (scrollY) {
            window.scrollTo(0, parseInt(scrollY || '0') * -1);
        }
    }
}

// Smooth scrolling for navigation links
function smoothScroll(e) {
    e.preventDefault();
    const href = this.getAttribute('href');
    if (!href || !href.includes('#')) return;
    
    const targetId = href.substring(href.indexOf('#') + 1);
    const targetElement = document.getElementById(targetId);
    
    if (targetElement) {
        const header = document.querySelector('.header');
        const headerHeight = header ? header.offsetHeight : 0;
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
    try {
        const sections = document.querySelectorAll('section[id]');
        if (!sections.length) return;
        
        const scrollPosition = window.scrollY + 100; // Offset for header
        
        sections.forEach(section => {
            if (!section) return;
            
            const sectionTop = section.offsetTop || 0;
            const sectionHeight = section.offsetHeight || 0;
            const sectionId = section.getAttribute('id');
            
            if (!sectionId) return;
            
            const correspondingNavLink = document.querySelector(`.nav__link[href="#${sectionId}"], .nav__link[href*="#${sectionId}"]`);
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                // Safely remove active class from all links
                if (navLinks && navLinks.length) {
                    navLinks.forEach(link => {
                        if (link && link.classList) {
                            link.classList.remove('active-link');
                        }
                    });
                }
                
                // Add active class to current link
                if (correspondingNavLink && correspondingNavLink.classList) {
                    correspondingNavLink.classList.add('active-link');
                }
            }
        });
    } catch (error) {
        console.warn('Navigation update error:', error);
    }
}

// Header background on scroll
function updateHeaderBackground() {
    const header = document.querySelector('.header');
    if (!header) return;
    
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
    // Check if IntersectionObserver is supported
    if (!('IntersectionObserver' in window)) {
        // Fallback for older browsers - just show all elements
        const elementsToObserve = document.querySelectorAll('.service-card, .feature, .step, .process-step, .testimonial, .area');
        elementsToObserve.forEach(el => {
            el.classList.add('fade-in-up');
            if (el.classList.contains('process-step')) {
                el.style.opacity = '1';
                el.style.transform = 'translateX(0)';
            }
        });
        return;
    }
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                try {
                    if (entry.target.classList.contains('process-step')) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateX(0)';
                    } else {
                        entry.target.classList.add('fade-in-up');
                    }
                    observer.unobserve(entry.target);
                } catch (error) {
                    console.warn('Animation error:', error);
                }
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

// Quality of Life Features

// Create and add scroll-to-top button
function createScrollToTopButton() {
    const scrollBtn = document.getElementById('scrollToTop');
    if (scrollBtn) {
        // Remove any existing listeners to prevent duplicates
        scrollBtn.replaceWith(scrollBtn.cloneNode(true));
        const newScrollBtn = document.getElementById('scrollToTop');
        
        newScrollBtn.addEventListener('click', (e) => {
            e.preventDefault();
            try {
                window.scrollTo({ 
                    top: 0, 
                    behavior: 'smooth' 
                });
            } catch (error) {
                // Fallback for older browsers
                window.scrollTo(0, 0);
            }
        });
        
        return newScrollBtn;
    }
    return null;
}

// Toast notification system
function showToast(message, type = 'info', duration = 3000) {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    // Show toast
    setTimeout(() => toast.classList.add('show'), 100);
    
    // Hide and remove toast
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => document.body.removeChild(toast), 300);
    }, duration);
}

// Page loading indicator
function showPageLoader() {
    const loader = document.getElementById('pageLoader');
    if (loader) {
        // Reset all properties to completely hidden state
        loader.classList.remove('loading');
        loader.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 0;
            height: 0;
            background: transparent;
            transform: translateX(-100%);
            z-index: -1;
            display: none !important;
            opacity: 0;
            visibility: hidden;
            pointer-events: none;
        `;
        
        // Start the loading animation after a small delay
        setTimeout(() => {
            loader.classList.add('loading');
            
            // Completely reset after animation
            setTimeout(() => {
                loader.classList.remove('loading');
                loader.style.cssText = `
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 0;
                    height: 0;
                    background: transparent;
                    transform: translateX(-100%);
                    z-index: -1;
                    display: none !important;
                    opacity: 0;
                    visibility: hidden;
                    pointer-events: none;
                `;
            }, 1200);
        }, 100);
    }
}

// Enhanced form interactions
function initEnhancedForms() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        const inputs = form.querySelectorAll('.form__input');
        
        inputs.forEach(input => {
            // Add placeholder for floating label effect
            if (!input.placeholder) {
                input.placeholder = ' ';
            }
            
            // Enhanced validation feedback
            input.addEventListener('blur', () => {
                validateField(input);
            });
            
            // Real-time character count for textareas
            if (input.tagName === 'TEXTAREA') {
                addCharacterCounter(input);
            }
        });
        
        // Form submission with loading state
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            // Show loading state
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            // Simulate form submission (replace with actual logic)
            setTimeout(() => {
                showToast('Your estimate request has been sent successfully!', 'success');
                form.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 2000);
        });
    });
}

// Field validation with visual feedback
function validateField(field) {
    if (!field || !field.checkValidity) return false;
    
    try {
        const isValid = field.checkValidity();
        const formGroup = field.closest('.form__group');
        
        if (formGroup && formGroup.classList) {
            formGroup.classList.toggle('error', !isValid);
            formGroup.classList.toggle('valid', isValid);
        }
        
        return isValid;
    } catch (error) {
        console.warn('Field validation error:', error);
        return false;
    }
}

// Character counter for textareas
function addCharacterCounter(textarea) {
    if (!textarea || !textarea.parentNode) return;
    
    try {
        const maxLength = textarea.getAttribute('maxlength') || 500;
        const counter = document.createElement('div');
        counter.className = 'character-counter';
        counter.style.cssText = 'font-size: 0.75rem; color: var(--text-light); text-align: right; margin-top: 0.25rem;';
        
        const updateCounter = () => {
            try {
                const remaining = maxLength - (textarea.value ? textarea.value.length : 0);
                counter.textContent = `${remaining} characters remaining`;
                counter.style.color = remaining < 50 ? 'var(--warning)' : 'var(--text-light)';
            } catch (error) {
                console.warn('Counter update error:', error);
            }
        };
        
        textarea.setAttribute('maxlength', maxLength);
        textarea.addEventListener('input', updateCounter);
        
        if (textarea.nextSibling) {
            textarea.parentNode.insertBefore(counter, textarea.nextSibling);
        } else {
            textarea.parentNode.appendChild(counter);
        }
        
        updateCounter();
    } catch (error) {
        console.warn('Character counter error:', error);
    }
}

// Keyboard shortcuts
function initKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + / for search or help
        if ((e.ctrlKey || e.metaKey) && e.key === '/') {
            e.preventDefault();
            const contactSection = document.getElementById('contact');
            if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth' });
            }
        }
        
        // Escape to close any open modals or focus traps
        if (e.key === 'Escape') {
            const activeElement = document.activeElement;
            if (activeElement && activeElement.blur) {
                activeElement.blur();
            }
        }
    });
}

// Enhanced accessibility features
function initAccessibilityFeatures() {
    // Skip to main content link - only create if it doesn't exist
    let skipLink = document.querySelector('.skip-link');
    
    if (!skipLink) {
        skipLink = document.createElement('a');
        skipLink.href = '#main';
        skipLink.textContent = 'Skip to main content';
        skipLink.className = 'skip-link';
        
        // Insert at the very beginning of the document
        document.body.insertBefore(skipLink, document.body.firstChild);
    }
    
    // Add main landmark if not present
    const main = document.querySelector('main');
    if (main && !main.id) {
        main.id = 'main';
    }
    
    // Ensure the skip link works properly
    skipLink.addEventListener('click', (e) => {
        e.preventDefault();
        const mainElement = document.getElementById('main') || document.querySelector('main');
        if (mainElement) {
            mainElement.focus();
            mainElement.scrollIntoView({ behavior: 'smooth' });
        }
    });
}

// Performance monitoring
function initPerformanceMonitoring() {
    // Track page load time
    window.addEventListener('load', () => {
        const loadTime = performance.now();
        console.log(`Page loaded in ${Math.round(loadTime)}ms`);
        
        // Show performance feedback for slow loads
        if (loadTime > 3000) {
            showToast('Page loaded slower than expected. Check your connection.', 'warning', 4000);
        }
    });
    
    // Track navigation timing
    if ('performance' in window && 'navigation' in performance) {
        const navigation = performance.navigation;
        if (navigation.type === navigation.TYPE_RELOAD) {
            console.log('Page was reloaded');
        }
    }
}

// Mobile-specific optimizations
function initMobileOptimizations() {
    // Detect if device is mobile
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    if (isMobile || isTouchDevice) {
        document.body.classList.add('mobile-device');
        
        // Handle iOS zoom prevention more carefully
        const viewportMeta = document.querySelector('meta[name="viewport"]');
        if (viewportMeta && /iPhone|iPad|iPod/i.test(navigator.userAgent)) {
            // Only prevent zoom on actual iOS devices for form inputs
            const originalContent = viewportMeta.content;
            
            // Prevent zoom only when focusing on form inputs
            document.addEventListener('focusin', (e) => {
                if (e.target.matches('input, textarea, select')) {
                    viewportMeta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
                }
            });
            
            document.addEventListener('focusout', (e) => {
                if (e.target.matches('input, textarea, select')) {
                    viewportMeta.content = originalContent;
                }
            });
        }
        
        // Handle iOS keyboard appearance
        if (window.visualViewport) {
            const handleViewportChange = () => {
                const currentHeight = window.visualViewport.height;
                const fullHeight = window.screen.height;
                const keyboardHeight = fullHeight - currentHeight;
                
                if (keyboardHeight > 150) {
                    document.body.classList.add('keyboard-open');
                    // Hide scroll-to-top button when keyboard is open
                    const scrollBtn = document.getElementById('scrollToTop');
                    if (scrollBtn) scrollBtn.style.display = 'none';
                } else {
                    document.body.classList.remove('keyboard-open');
                    const scrollBtn = document.getElementById('scrollToTop');
                    if (scrollBtn) scrollBtn.style.display = 'flex';
                }
            };
            
            window.visualViewport.addEventListener('resize', handleViewportChange);
        }
        
        // Improve touch interactions
        document.addEventListener('touchstart', () => {}, { passive: true });
        document.addEventListener('touchmove', () => {}, { passive: true });
        
        // Prevent pull-to-refresh on mobile
        document.addEventListener('touchstart', (e) => {
            if (e.touches.length > 1) return;
            
            const touch = e.touches[0];
            const startY = touch.clientY;
            
            document.addEventListener('touchmove', (moveEvent) => {
                const touch = moveEvent.touches[0];
                const currentY = touch.clientY;
                
                if (currentY > startY && window.scrollY <= 0) {
                    moveEvent.preventDefault();
                }
            }, { passive: false, once: true });
        });
        
        // Enhanced form focus for mobile
        const formInputs = document.querySelectorAll('.form__input');
        formInputs.forEach(input => {
            input.addEventListener('focus', () => {
                // Scroll input into view on mobile
                setTimeout(() => {
                    if (input && input.scrollIntoView) {
                        input.scrollIntoView({ 
                            behavior: 'smooth', 
                            block: 'center' 
                        });
                    }
                }, 300);
            });
            
            // Add better mobile input handling
            input.addEventListener('touchstart', () => {
                input.style.transform = 'scale(0.98)';
            }, { passive: true });
            
            input.addEventListener('touchend', () => {
                input.style.transform = 'scale(1)';
            }, { passive: true });
        });
        
        // Better touch feedback for interactive elements
        const interactiveElements = document.querySelectorAll('.btn, .service-card, .container-card, .nav__link');
        interactiveElements.forEach(element => {
            element.addEventListener('touchstart', () => {
                element.style.transform = 'scale(0.97)';
                element.style.transition = 'transform 0.1s ease';
            }, { passive: true });
            
            element.addEventListener('touchend', () => {
                element.style.transform = 'scale(1)';
            }, { passive: true });
            
            element.addEventListener('touchcancel', () => {
                element.style.transform = 'scale(1)';
            }, { passive: true });
        });
    }
}

// Fix form label positioning for mobile
function fixMobileFormLabels() {
    const formGroups = document.querySelectorAll('.form__group');
    
    formGroups.forEach(group => {
        const input = group.querySelector('.form__input');
        const label = group.querySelector('.form__label');
        
        if (input && label) {
            // Move label after input for proper floating effect
            if (input.nextElementSibling !== label) {
                input.parentNode.insertBefore(label, input.nextSibling);
            }
        }
    });
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
    
    // Initialize quality of life features
    initEnhancedForms();
    initKeyboardShortcuts();
    initAccessibilityFeatures();
    initPerformanceMonitoring();
    initMobileOptimizations();
    fixMobileFormLabels();
    
    // Create scroll-to-top button and get reference
    window.scrollToTopBtn = createScrollToTopButton();
    
    // Show page loader on initial load
    showPageLoader();
});

// Consolidated scroll event listener with throttling
let scrollTimeout;
window.addEventListener('scroll', () => {
    // Throttle scroll events for better performance
    if (scrollTimeout) return;
    
    scrollTimeout = setTimeout(() => {
        try {
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
        } catch (error) {
            console.warn('Scroll handler error:', error);
        } finally {
            scrollTimeout = null;
        }
    }, 10);
}, { passive: true });

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