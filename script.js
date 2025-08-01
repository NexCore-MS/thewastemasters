// DOM elements
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav__link');
const estimateForm = document.getElementById('estimate-form');

// SIMPLE MOBILE MENU - COMPLETELY REBUILT
function toggleMobileMenu(e) {
    e.preventDefault();
    e.stopPropagation();
    
    // Get fresh references every time
    const menu = document.getElementById('nav-menu');
    const toggle = document.getElementById('nav-toggle');
    
    if (!menu || !toggle) {
        return;
    }
    
    const isCurrentlyOpen = menu.classList.contains('show-menu');
    
    if (isCurrentlyOpen) {
        // Close menu - FORCE STYLES
        menu.classList.remove('show-menu');
        toggle.classList.remove('active');
        menu.style.left = '-100vw';
        menu.style.opacity = '0';
        menu.style.visibility = 'hidden';
        menu.style.transform = 'translateX(-100%)';
        document.body.style.overflow = '';
    } else {
        // Open menu - FORCE STYLES
        menu.classList.add('show-menu');
        toggle.classList.add('active');
        menu.style.left = '0';
        menu.style.opacity = '1';
        menu.style.visibility = 'visible';
        menu.style.transform = 'translateX(0%)';
        menu.style.display = 'flex';
        menu.style.position = 'fixed';
        menu.style.top = '0';
        menu.style.width = '100vw';
        menu.style.height = '100vh';
        menu.style.background = '#000000';
        menu.style.zIndex = '99999';
        document.body.style.overflow = 'hidden';
    }
    
    // Force a repaint
    menu.offsetHeight;
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
        try {
            const header = document.querySelector('.header');
            const headerHeight = header ? header.offsetHeight : 80; // Default fallback
            const targetPosition = Math.max(0, targetElement.offsetTop - headerHeight - 20); // Add 20px buffer and prevent negative values
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        } catch (error) {
            console.error('Smooth scroll error:', error);
            // Fallback to default browser behavior
            targetElement.scrollIntoView({ behavior: 'smooth' });
        }
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
    
    if (!formData.get('address') || formData.get('address').trim().length < 5) {
        errors.push('Please enter a valid property address');
    }
    
    if (!formData.get('service')) {
        errors.push('Please select a service');
    }
    
    if (!formData.get('urgency')) {
        errors.push('Please select when you need service');
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
    const submitButton = estimateForm.querySelector('#form-submit-btn');
    const btnText = submitButton.querySelector('.btn-text');
    const btnLoading = submitButton.querySelector('.btn-loading');
    
    btnText.style.display = 'none';
    btnLoading.style.display = 'inline-flex';
    submitButton.disabled = true;
    
    // Submit to Formspree
    fetch(estimateForm.action, {
        method: 'POST',
        body: formData,
        headers: {
            'Accept': 'application/json'
        }
    })
    .then(response => {
        if (response.ok) {
            // Success
            showFormMessage('Thank you! We\'ll contact you within 30 minutes with your free estimate.');
            estimateForm.reset();
            
            // Clear saved form data
            const formInputs = estimateForm.querySelectorAll('input, select, textarea');
            formInputs.forEach(input => {
                localStorage.removeItem(`form_${input.id}`);
            });
            
            // Remove active states from form labels
            const labels = estimateForm.querySelectorAll('.form__label');
            labels.forEach(label => {
                label.style.transform = '';
                label.style.color = '';
            });
        } else {
            response.json().then(data => {
                if (data.errors) {
                    const errorMessages = data.errors.map(error => error.message).join('. ');
                    showFormMessage(`Error: ${errorMessages}`, true);
                } else {
                    showFormMessage('There was a problem submitting your form. Please try again or call us directly.', true);
                }
            });
        }
    })
    .catch(error => {
        console.error('Form submission error:', error);
        showFormMessage('There was a problem submitting your form. Please try again or call us directly at (305) 986-0692.', true);
    })
    .finally(() => {
        // Reset button state
        btnText.style.display = 'inline';
        btnLoading.style.display = 'none';
        submitButton.disabled = false;
    });
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

// Interactive Pricing Estimator
function initPricingEstimator() {
    const estimator = document.querySelector('.pricing-estimator');
    if (!estimator) return;

    let currentStep = 1;
    let selectedService = null;
    let selectedAmount = null;
    let selectedLocation = null;
    let basePrice = 0;
    let multiplier = 1;
    let locationFee = 0;

    const steps = estimator.querySelectorAll('.estimator__step');
    const stepIndicators = estimator.querySelectorAll('.estimator__step-indicator');
    const progressBar = estimator.querySelector('.estimator__progress-fill');
    const resultSection = estimator.querySelector('.estimator__result');
    const locationSelect = document.getElementById('location-select');

    // Step 1: Service Selection
    const serviceOptions = estimator.querySelectorAll('[data-step="1"] .estimator__option');
    serviceOptions.forEach(option => {
        option.addEventListener('click', () => {
            // Remove active state from other options
            serviceOptions.forEach(opt => opt.classList.remove('selected'));
            
            // Add active state to selected option
            option.classList.add('selected');
            
            // Get service data
            selectedService = option.dataset.service;
            basePrice = parseInt(option.dataset.basePrice);
            
            // Update breakdown
            document.getElementById('breakdown-service').textContent = option.querySelector('h4').textContent;
            
            // Move to next step
            setTimeout(() => goToStep(2), 500);
        });
    });

    // Step 2: Amount Selection
    const amountOptions = estimator.querySelectorAll('[data-step="2"] .estimator__option');
    amountOptions.forEach(option => {
        option.addEventListener('click', () => {
            // Remove active state from other options
            amountOptions.forEach(opt => opt.classList.remove('selected'));
            
            // Add active state to selected option
            option.classList.add('selected');
            
            // Get amount data
            selectedAmount = option.dataset.amount;
            multiplier = parseFloat(option.dataset.multiplier);
            
            // Update breakdown
            document.getElementById('breakdown-amount').textContent = option.querySelector('h4').textContent;
            
            // Move to next step
            setTimeout(() => goToStep(3), 500);
        });
    });

    // Step 3: Location Selection
    if (locationSelect) {
        locationSelect.addEventListener('change', (e) => {
            const selectedOption = e.target.options[e.target.selectedIndex];
            if (selectedOption.value) {
                selectedLocation = selectedOption.value;
                locationFee = parseInt(selectedOption.dataset.fee);
                
                // Update breakdown
                document.getElementById('breakdown-location').textContent = selectedOption.textContent;
                
                // Calculate and show result
                setTimeout(() => showResult(), 500);
            }
        });
    }

    function goToStep(stepNumber) {
        // Update current step
        currentStep = stepNumber;
        
        // Hide all steps
        steps.forEach(step => step.classList.remove('estimator__step--active'));
        
        // Show target step
        const targetStep = estimator.querySelector(`[data-step="${stepNumber}"]`);
        if (targetStep) {
            targetStep.classList.add('estimator__step--active');
        }
        
        // Update progress bar
        const progress = (stepNumber - 1) / 2 * 100;
        if (progressBar) {
            progressBar.style.width = `${progress}%`;
        }
        
        // Update step indicators
        stepIndicators.forEach((indicator, index) => {
            indicator.classList.toggle('estimator__step-indicator--active', index < stepNumber);
            indicator.classList.toggle('estimator__step-indicator--completed', index < stepNumber - 1);
        });
    }

    function showResult() {
        // Calculate total price
        const subtotal = basePrice * multiplier;
        const total = subtotal + locationFee;
        
        // Update price display
        const priceAmount = estimator.querySelector('.estimator__price-amount');
        if (priceAmount) {
            priceAmount.textContent = `$${total}`;
        }
        
        // Hide all steps and show result
        steps.forEach(step => step.classList.remove('estimator__step--active'));
        if (resultSection) {
            resultSection.classList.add('estimator__result--active');
        }
        
        // Update progress to 100%
        if (progressBar) {
            progressBar.style.width = '100%';
        }
        
        // Mark all indicators as completed
        stepIndicators.forEach(indicator => {
            indicator.classList.add('estimator__step-indicator--completed');
            indicator.classList.remove('estimator__step-indicator--active');
        });
    }

    // Reset functionality
    const resetButton = estimator.querySelector('.estimator__reset');
    if (resetButton) {
        resetButton.addEventListener('click', () => {
            // Reset all variables
            currentStep = 1;
            selectedService = null;
            selectedAmount = null;
            selectedLocation = null;
            basePrice = 0;
            multiplier = 1;
            locationFee = 0;
            
            // Clear selections
            estimator.querySelectorAll('.estimator__option').forEach(opt => {
                opt.classList.remove('selected');
            });
            
            if (locationSelect) {
                locationSelect.value = '';
            }
            
            // Clear breakdown
            document.getElementById('breakdown-service').textContent = '-';
            document.getElementById('breakdown-amount').textContent = '-';
            document.getElementById('breakdown-location').textContent = '-';
            
            // Reset UI
            steps.forEach(step => step.classList.remove('estimator__step--active'));
            steps[0].classList.add('estimator__step--active');
            
            if (resultSection) {
                resultSection.classList.remove('estimator__result--active');
            }
            
            if (progressBar) {
                progressBar.style.width = '0%';
            }
            
            stepIndicators.forEach((indicator, index) => {
                indicator.classList.toggle('estimator__step-indicator--active', index === 0);
                indicator.classList.remove('estimator__step-indicator--completed');
            });
        });
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
    // MOBILE MENU SETUP
    const hamburger = document.getElementById('nav-toggle');
    const menu = document.getElementById('nav-menu');
    
    if (hamburger && menu) {
        // Add click listener
        hamburger.addEventListener('click', toggleMobileMenu);
        hamburger.addEventListener('touchstart', toggleMobileMenu, { passive: false });
        
        // Close menu when clicking menu links
        const menuLinks = menu.querySelectorAll('.nav__link');
        menuLinks.forEach(link => {
            link.addEventListener('click', () => {
                menu.classList.remove('show-menu');
                hamburger.classList.remove('active');
                menu.style.left = '-100vw';
                menu.style.opacity = '0';
                menu.style.visibility = 'hidden';
                document.body.style.overflow = '';
            });
        });
    }
    
    // Navigation links - TEMPORARILY DISABLED FOR DEBUGGING
    /*
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && (href.startsWith('#') || href.includes('#'))) {
            // Only add smooth scroll for same-page links
            if (href.startsWith('#') || href.startsWith(window.location.pathname + '#')) {
                link.addEventListener('click', smoothScroll);
            }
        }
    });
    
    // Apply smooth scrolling to ALL internal anchor links (not just nav links)
    const allAnchorLinks = document.querySelectorAll('a[href^="#"]:not(.nav__link)');
    allAnchorLinks.forEach(link => {
        link.addEventListener('click', smoothScroll);
    });
    */
    
    
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
        
        // Address input improvements
        const addressInput = document.getElementById('address');
        if (addressInput) {
            addressInput.setAttribute('autocomplete', 'street-address');
        }
        
        // Initialize form auto-save
        initFormAutoSave();
    }
    
    // Initialize pricing estimator
    initPricingEstimator();
    
    // TEMPORARILY DISABLED FOR DEBUGGING
    /*
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
    */
});

// Consolidated scroll event listener with throttling
let scrollTimeout;
let ticking = false;

function handleScroll() {
    if (!ticking) {
        requestAnimationFrame(() => {
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
                // Silent error handling
            }
            ticking = false;
        });
        ticking = true;
    }
}

// TEMPORARILY DISABLED FOR DEBUGGING
// window.addEventListener('scroll', handleScroll, { passive: true });

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

// Add CSS for form messages and pricing estimator
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
    
    /* Pricing Estimator Interactive Styles */
    .estimator__step {
        display: none;
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.3s ease;
    }
    
    .estimator__step--active {
        display: block;
        opacity: 1;
        transform: translateY(0);
    }
    
    .estimator__option {
        transition: all 0.3s ease;
        cursor: pointer;
        border: 2px solid transparent;
    }
    
    .estimator__option:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        border-color: var(--primary-color-light);
    }
    
    .estimator__option.selected {
        border-color: var(--primary-color);
        background: linear-gradient(135deg, var(--primary-color-light), var(--surface-color));
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(34, 197, 94, 0.2);
    }
    
    .estimator__option.selected .estimator__option-content h4 {
        color: var(--primary-color);
    }
    
    .estimator__result {
        display: none;
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.5s ease;
    }
    
    .estimator__result--active {
        display: block;
        opacity: 1;
        transform: translateY(0);
    }
    
    .estimator__progress-fill {
        width: 0%;
        height: 100%;
        background: linear-gradient(90deg, var(--primary-color), var(--primary-color-light));
        border-radius: inherit;
        transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .estimator__step-indicator {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: var(--neutral-200);
        color: var(--text-light);
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 600;
        transition: all 0.3s ease;
    }
    
    .estimator__step-indicator--active {
        background: var(--primary-color);
        color: white;
        transform: scale(1.1);
    }
    
    .estimator__step-indicator--completed {
        background: var(--success);
        color: white;
    }
    
    .estimator__step-indicator--completed::before {
        content: "✓";
        font-size: 18px;
    }
    
    .estimator__price-amount {
        font-size: 3rem;
        font-weight: 700;
        color: var(--primary-color);
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        animation: pricePopIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    }
    
    @keyframes pricePopIn {
        0% {
            opacity: 0;
            transform: scale(0.3);
        }
        50% {
            transform: scale(1.1);
        }
        100% {
            opacity: 1;
            transform: scale(1);
        }
    }
    
    .estimator__select {
        width: 100%;
        padding: 1rem;
        border: 2px solid var(--neutral-200);
        border-radius: var(--border-radius);
        background: var(--surface-color);
        color: var(--text-primary);
        font-size: 1rem;
        transition: all 0.3s ease;
    }
    
    .estimator__select:focus {
        outline: none;
        border-color: var(--primary-color);
        box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.1);
    }
    
    /* Navigation Dropdown Styles */
    .nav__item--dropdown {
        position: relative;
    }
    
    .nav__dropdown-arrow {
        font-size: 0.8rem;
        margin-left: 0.5rem;
        transition: transform 0.3s ease;
    }
    
    .nav__item--dropdown:hover .nav__dropdown-arrow {
        transform: rotate(180deg);
    }
    
    .nav__dropdown {
        position: absolute;
        top: 100%;
        left: 0;
        background: white;
        min-width: 280px;
        border-radius: 12px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
        opacity: 0;
        visibility: hidden;
        transform: translateY(-10px);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        z-index: 1000;
        border: 1px solid rgba(0, 0, 0, 0.1);
        overflow: hidden;
        list-style: none;
        padding: 0;
        margin: 0;
    }
    
    .nav__item--dropdown:hover .nav__dropdown {
        opacity: 1;
        visibility: visible;
        transform: translateY(0);
    }
    
    .nav__dropdown-item {
        list-style: none;
        margin: 0;
        padding: 0;
    }
    
    .nav__dropdown-link {
        display: flex;
        align-items: center;
        padding: 1rem 1.25rem;
        text-decoration: none;
        color: var(--text-primary);
        transition: all 0.2s ease;
        border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    }
    
    .nav__dropdown-link:hover {
        background: var(--primary-color-light);
        color: var(--primary-color);
    }
    
    .nav__dropdown-item:last-child .nav__dropdown-link {
        border-bottom: none;
    }
    
    .nav__service-icon {
        font-size: 1.5rem;
        margin-right: 1rem;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--primary-color-light);
        border-radius: 8px;
        transition: all 0.2s ease;
    }
    
    .nav__dropdown-link:hover .nav__service-icon {
        background: var(--primary-color);
        transform: scale(1.1);
    }
    
    .nav__service-info {
        display: flex;
        flex-direction: column;
    }
    
    .nav__service-title {
        font-weight: 600;
        font-size: 0.95rem;
        margin-bottom: 0.25rem;
    }
    
    .nav__service-desc {
        font-size: 0.8rem;
        color: var(--text-light);
    }
    
    .nav__dropdown-link:hover .nav__service-desc {
        color: var(--primary-color-dark);
    }
    
    /* Mobile dropdown adjustments */
    @media (max-width: 768px) {
        .nav__dropdown {
            position: static;
            opacity: 1;
            visibility: visible;
            transform: none;
            box-shadow: none;
            border: none;
            background: transparent;
            margin-left: 1rem;
        }
        
        .nav__dropdown-arrow {
            display: none;
        }
        
        .nav__dropdown-link {
            padding: 0.75rem 1rem;
            border-radius: 8px;
            margin-bottom: 0.5rem;
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .nav__dropdown-link:hover {
            background: rgba(255, 255, 255, 0.2);
        }
        
        .nav__service-icon {
            background: rgba(34, 197, 94, 0.2);
        }
        
        .nav__service-title,
        .nav__service-desc {
            color: white;
        }
    }
    
    /* Enhanced About Section Styles */
    .about__story {
        margin-bottom: 4rem;
    }
    
    .about__story-content {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 4rem;
        align-items: center;
    }
    
    .story__timeline {
        margin-top: 2rem;
    }
    
    .timeline__item {
        display: flex;
        align-items: flex-start;
        margin-bottom: 2rem;
        position: relative;
    }
    
    .timeline__item:not(:last-child)::after {
        content: '';
        position: absolute;
        left: 30px;
        top: 60px;
        width: 2px;
        height: calc(100% + 1rem);
        background: var(--primary-color-light);
    }
    
    .timeline__year {
        background: var(--primary-color);
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 20px;
        font-weight: 600;
        font-size: 0.9rem;
        margin-right: 1.5rem;
        flex-shrink: 0;
        min-width: 60px;
        text-align: center;
    }
    
    .timeline__content h3 {
        color: var(--text-primary);
        font-size: 1.2rem;
        font-weight: 600;
        margin-bottom: 0.5rem;
    }
    
    .timeline__content p {
        color: var(--text-light);
        line-height: 1.6;
    }
    
    .story__image-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
        height: 400px;
    }
    
    .story__image {
        border-radius: 12px;
        object-fit: cover;
        width: 100%;
        height: 100%;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        transition: transform 0.3s ease;
    }
    
    .story__image:hover {
        transform: scale(1.02);
    }
    
    .story__image--main {
        grid-row: 1 / 3;
    }
    
    .story__image--family {
        grid-column: 2;
        grid-row: 1;
    }
    
    .story__image--fleet {
        grid-column: 2;
        grid-row: 2;
    }
    
    .about__team {
        margin: 4rem 0;
        padding: 3rem 0;
        background: var(--surface-color);
        border-radius: 16px;
    }
    
    .team__grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 2rem;
        margin-top: 2rem;
    }
    
    .team__member {
        background: white;
        border-radius: 16px;
        padding: 1.5rem;
        text-align: center;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
        transition: all 0.3s ease;
    }
    
    .team__member:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
    }
    
    .team__member-image {
        width: 120px;
        height: 120px;
        margin: 0 auto 1.5rem;
        border-radius: 50%;
        overflow: hidden;
        border: 4px solid var(--primary-color-light);
    }
    
    .team__member-image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
    
    .team__member-name {
        font-size: 1.3rem;
        font-weight: 600;
        color: var(--text-primary);
        margin-bottom: 0.5rem;
    }
    
    .team__member-role {
        color: var(--primary-color);
        font-weight: 500;
        margin-bottom: 1rem;
        text-transform: uppercase;
        font-size: 0.9rem;
        letter-spacing: 0.5px;
    }
    
    .team__member-bio {
        color: var(--text-light);
        line-height: 1.6;
        font-size: 0.95rem;
    }
    
    .about__features {
        margin-top: 4rem;
    }
    
    /* Responsive Design */
    @media (max-width: 768px) {
        .about__story-content {
            grid-template-columns: 1fr;
            gap: 2rem;
        }
        
        .story__image-grid {
            height: 300px;
            grid-template-columns: 1fr;
            grid-template-rows: 1fr 1fr 1fr;
        }
        
        .story__image--main {
            grid-row: 1;
        }
        
        .story__image--family {
            grid-column: 1;
            grid-row: 2;
        }
        
        .story__image--fleet {
            grid-column: 1;
            grid-row: 3;
        }
        
        .timeline__item {
            flex-direction: column;
            align-items: flex-start;
        }
        
        .timeline__year {
            margin-bottom: 1rem;
            margin-right: 0;
        }
        
        .timeline__item:not(:last-child)::after {
            display: none;
        }
        
        .team__grid {
            grid-template-columns: 1fr;
        }
        
        .about__team {
            margin: 2rem 0;
            padding: 2rem 1rem;
        }
    }
    
    /* Enhanced Form Styles */
    .btn-loading {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .loading-spinner {
        width: 18px;
        height: 18px;
        border: 2px solid transparent;
        border-top: 2px solid currentColor;
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
        to {
            transform: rotate(360deg);
        }
    }
    
    .form__privacy {
        font-size: 0.8rem;
        color: var(--text-light);
        text-align: center;
        margin-top: 1rem;
        line-height: 1.4;
        padding: 0 1rem;
    }
    
    .form__group {
        position: relative;
        margin-bottom: 1.5rem;
    }
    
    .form__input:focus + .form__label,
    .form__input:not(:placeholder-shown) + .form__label {
        transform: translateY(-12px) scale(0.8);
        color: var(--primary-color);
        background: white;
        padding: 0 0.5rem;
    }
    
    .form__input {
        padding: 1rem;
        border: 2px solid var(--neutral-200);
        border-radius: var(--border-radius);
        font-size: 1rem;
        width: 100%;
        transition: all 0.3s ease;
    }
    
    .form__input:focus {
        outline: none;
        border-color: var(--primary-color);
        box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.1);
    }
    
    .form__input::placeholder {
        color: var(--text-light);
        opacity: 0.7;
    }
    
    .form__label {
        position: absolute;
        left: 1rem;
        top: 1rem;
        color: var(--text-light);
        font-size: 1rem;
        pointer-events: none;
        transition: all 0.3s ease;
        background: transparent;
    }
`;
document.head.appendChild(style);