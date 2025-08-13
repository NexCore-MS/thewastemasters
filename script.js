// ===================================
// THE WASTE MASTERS - PROFESSIONAL TEMPLATE JS
// Mobile-First, Performance-Optimized
// ===================================

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initMobileMenu();
    initSmoothScrolling();
    initBackToTop();
    initContactForm();
    initCallTracking();
    initAnimations();
    initActiveNavigation();
});

// ===================================
// MOBILE MENU
// ===================================
function initMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const nav = document.getElementById('nav');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (!menuToggle || !nav) return;
    
    // Create mobile menu if it doesn't exist
    let mobileMenu = document.querySelector('.mobile-menu');
    if (!mobileMenu) {
        mobileMenu = createMobileMenu(nav);
    }
    
    // Toggle menu
    menuToggle.addEventListener('click', function(e) {
        e.preventDefault();
        toggleMenu();
    });
    
    // Close menu when clicking links
    const mobileNavLinks = mobileMenu.querySelectorAll('.nav-link');
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth < 768) {
                closeMenu();
            }
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (window.innerWidth < 768 && 
            !menuToggle.contains(e.target) && 
            !mobileMenu.contains(e.target) &&
            mobileMenu.classList.contains('active')) {
            closeMenu();
        }
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
            closeMenu();
        }
    });
    
    function createMobileMenu(nav) {
        const mobileMenu = document.createElement('div');
        mobileMenu.className = 'mobile-menu';
        mobileMenu.id = 'mobileMenu';
        
        // Clone navigation links
        const navList = nav.querySelector('.nav-list');
        if (navList) {
            const mobileNavList = navList.cloneNode(true);
            mobileNavList.className = 'mobile-nav-list';
            mobileMenu.appendChild(mobileNavList);
        }
        
        // Add phone link
        const phoneLink = document.createElement('a');
        phoneLink.href = 'tel:+13059860692';
        phoneLink.className = 'btn btn-primary btn-full';
        phoneLink.textContent = 'Call Now: (305) 986-0692';
        mobileMenu.appendChild(phoneLink);
        
        // Insert after header
        const header = document.querySelector('.header');
        header.appendChild(mobileMenu);
        
        return mobileMenu;
    }
    
    function toggleMenu() {
        menuToggle.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        
        // Prevent body scroll when menu is open on mobile
        if (window.innerWidth < 768) {
            document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
        }
    }
    
    function closeMenu() {
        menuToggle.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    // Reset menu state on resize
    window.addEventListener('resize', function() {
        if (window.innerWidth >= 768) {
            closeMenu();
            document.body.style.overflow = '';
        }
    });
}

// ===================================
// SMOOTH SCROLLING
// ===================================
function initSmoothScrolling() {
    const scrollLinks = document.querySelectorAll('a[href^="#"]');
    
    scrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip if it's just "#"
            if (href === '#') return;
            
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                e.preventDefault();
                
                const header = document.querySelector('.header');
                const headerHeight = header ? header.offsetHeight : 0;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                const mobileMenu = document.querySelector('.mobile-menu');
                if (mobileMenu && mobileMenu.classList.contains('active')) {
                    const menuToggle = document.getElementById('menuToggle');
                    if (menuToggle) {
                        menuToggle.classList.remove('active');
                        mobileMenu.classList.remove('active');
                        document.body.style.overflow = '';
                    }
                }
            }
        });
    });
}

// ===================================
// ACTIVE NAVIGATION
// ===================================
function initActiveNavigation() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    
    if (sections.length === 0 || navLinks.length === 0) return;
    
    function updateActiveNav() {
        const scrollPos = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                // Remove active from all links
                navLinks.forEach(link => link.classList.remove('active'));
                
                // Add active to current section link
                const activeLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }
    
    // Throttled scroll event
    let ticking = false;
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(function() {
                updateActiveNav();
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
}

// ===================================
// BACK TO TOP BUTTON
// ===================================
function initBackToTop() {
    const backToTop = document.getElementById('backToTop');
    
    if (!backToTop) return;
    
    // Show/hide button based on scroll position
    function toggleBackToTop() {
        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    }
    
    // Throttled scroll event
    let ticking = false;
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(function() {
                toggleBackToTop();
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
    
    // Click handler
    backToTop.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ===================================
// CONTACT FORM
// ===================================
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const data = {
            name: formData.get('name'),
            phone: formData.get('phone'),
            email: formData.get('email'),
            address: formData.get('address'),
            service: formData.get('service'),
            urgency: formData.get('urgency'),
            details: formData.get('details')
        };
        
        // Basic validation
        if (!validateForm(data)) {
            return;
        }
        
        // Show loading state
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;
        
        // Simulate form submission (replace with actual endpoint)
        setTimeout(() => {
            // Reset form
            contactForm.reset();
            
            // Show success message
            showFormMessage('Thank you! We\'ll contact you within 30 minutes for your free quote.', 'success');
            
            // Reset button
            submitButton.textContent = originalText;
            submitButton.disabled = false;
            
            // Track form submission
            if (typeof gtag !== 'undefined') {
                gtag('event', 'form_submit', {
                    'event_category': 'engagement',
                    'event_label': 'contact_form',
                    'service_type': data.service,
                    'urgency': data.urgency
                });
            }
            
            console.log('Form submitted:', data);
        }, 2000);
    });
    
    function validateForm(data) {
        const errors = [];
        
        if (!data.name || data.name.trim().length < 2) {
            errors.push('Please enter your full name');
        }
        
        if (!data.phone || !isValidPhone(data.phone)) {
            errors.push('Please enter a valid phone number');
        }
        
        if (!data.address || data.address.trim().length < 5) {
            errors.push('Please enter a valid service address');
        }
        
        if (!data.service) {
            errors.push('Please select a service type');
        }
        
        if (!data.urgency) {
            errors.push('Please select when you need service');
        }
        
        if (!data.details || data.details.trim().length < 10) {
            errors.push('Please provide more details about items to be removed');
        }
        
        if (errors.length > 0) {
            showFormMessage(errors.join('<br>'), 'error');
            return false;
        }
        
        return true;
    }
    
    function isValidPhone(phone) {
        const phoneRegex = /^[\+]?[1-9]?[\d\s\-\(\)]{10,}$/;
        return phoneRegex.test(phone.replace(/\s/g, ''));
    }
    
    function showFormMessage(message, type) {
        // Remove existing message
        const existingMessage = contactForm.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Create message element
        const messageEl = document.createElement('div');
        messageEl.className = `form-message form-message-${type}`;
        messageEl.innerHTML = message;
        
        // Insert at top of form
        contactForm.insertBefore(messageEl, contactForm.firstChild);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (messageEl.parentNode) {
                messageEl.remove();
            }
        }, 5000);
        
        // Scroll to message
        messageEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    // Phone number formatting
    const phoneInput = contactForm.querySelector('#phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 6) {
                value = value.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
            } else if (value.length >= 3) {
                value = value.replace(/(\d{3})(\d{0,3})/, '($1) $2');
            }
            e.target.value = value;
        });
    }
}

// ===================================
// CALL TRACKING & ANALYTICS
// ===================================
function initCallTracking() {
    const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
    const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
    
    // Track phone calls
    phoneLinks.forEach(link => {
        link.addEventListener('click', function() {
            console.log('Phone call initiated:', this.href);
            
            // Track with Google Analytics if available
            if (typeof gtag !== 'undefined') {
                gtag('event', 'phone_call', {
                    'event_category': 'engagement',
                    'event_label': 'phone_click',
                    'phone_number': this.href.replace('tel:', '')
                });
            }
            
            // Track location on page
            const section = this.closest('section');
            if (section) {
                console.log('Call initiated from section:', section.id || section.className);
            }
        });
    });
    
    // Track emails
    emailLinks.forEach(link => {
        link.addEventListener('click', function() {
            console.log('Email initiated:', this.href);
            
            if (typeof gtag !== 'undefined') {
                gtag('event', 'email', {
                    'event_category': 'engagement',
                    'event_label': 'email_click'
                });
            }
        });
    });
}

// ===================================
// SCROLL ANIMATIONS
// ===================================
function initAnimations() {
    // Only run animations if user hasn't set reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
    }
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                
                // Add stagger effect for multiple items
                const siblings = entry.target.parentNode.children;
                const index = Array.from(siblings).indexOf(entry.target);
                entry.target.style.transitionDelay = `${index * 100}ms`;
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Elements to animate on scroll
    const animateElements = document.querySelectorAll(`
        .service-card,
        .process-step,
        .stat-item,
        .about-feature,
        .contact-method,
        .pricing-card,
        .hero-feature
    `);
    
    animateElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
    
    // Hero elements animation
    const heroElements = document.querySelectorAll('.hero-title, .hero-subtitle, .hero-actions');
    heroElements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        element.style.transitionDelay = `${index * 200}ms`;
        
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, 500 + (index * 200));
    });
}

// ===================================
// PRICING CARD INTERACTIONS
// ===================================
function initPricingCards() {
    const pricingCards = document.querySelectorAll('.pricing-card');
    
    pricingCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            // Highlight the featured card effect
            if (!this.classList.contains('pricing-featured')) {
                this.style.transform = 'translateY(-12px) scale(1.02)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            if (!this.classList.contains('pricing-featured')) {
                this.style.transform = '';
            }
        });
    });
}

// ===================================
// UTILITY FUNCTIONS
// ===================================

// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// ===================================
// PERFORMANCE OPTIMIZATIONS
// ===================================

// Preload critical images
function preloadImages() {
    const criticalImages = [
        'newlogo.jpg',
        'toter-professional-placement.jpg'
    ];
    
    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// Initialize preloading after page load
window.addEventListener('load', preloadImages);

// ===================================
// ERROR HANDLING
// ===================================

// Global error handler for JavaScript errors
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    
    // Send to analytics if available
    if (typeof gtag !== 'undefined') {
        gtag('event', 'exception', {
            'description': e.error.message,
            'fatal': false
        });
    }
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled promise rejection:', e.reason);
    
    if (typeof gtag !== 'undefined') {
        gtag('event', 'exception', {
            'description': 'Unhandled promise rejection',
            'fatal': false
        });
    }
});

// ===================================
// PAGE VISIBILITY API
// ===================================

// Track when users leave/return to the page
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        console.log('Page hidden - user switched tabs/apps');
    } else {
        console.log('Page visible - user returned');
    }
    
    // You can pause/resume animations or tracking here
});

// ===================================
// TOUCH DEVICE OPTIMIZATIONS
// ===================================

// Add touch-specific classes for better mobile UX
if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
    document.body.classList.add('touch-device');
    
    // Improve touch response
    document.addEventListener('touchstart', function() {}, { passive: true });
    
    // Handle touch feedback for interactive elements
    const interactiveElements = document.querySelectorAll(`
        .btn,
        .service-card,
        .contact-method,
        .nav-link,
        .pricing-card
    `);
    
    interactiveElements.forEach(element => {
        element.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.98)';
        }, { passive: true });
        
        element.addEventListener('touchend', function() {
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        }, { passive: true });
    });
}

// ===================================
// SERVICE WORKER REGISTRATION
// ===================================

// Register service worker for better performance (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // Only register if you have a service worker file
        // navigator.serviceWorker.register('/sw.js')
        //     .then(registration => console.log('SW registered'))
        //     .catch(error => console.log('SW registration failed'));
    });
}

// ===================================
// INITIALIZATION COMPLETE
// ===================================

// Add CSS for form messages
const style = document.createElement('style');
style.textContent = `
.form-message {
    padding: 1rem;
    border-radius: 0.5rem;
    margin-bottom: 1.5rem;
    font-weight: 500;
}

.form-message-success {
    background: rgba(0, 255, 136, 0.1);
    color: var(--primary);
    border: 1px solid var(--primary);
}

.form-message-error {
    background: rgba(239, 68, 68, 0.1);
    color: #ef4444;
    border: 1px solid #ef4444;
}

.mobile-menu {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: var(--secondary);
    box-shadow: var(--shadow-xl);
    border-radius: 0 0 var(--border-radius-lg) var(--border-radius-lg);
    padding: var(--space-6);
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
    transform: translateY(-100%);
    opacity: 0;
    visibility: hidden;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    border-top: 1px solid var(--primary);
    z-index: 999;
}

.mobile-menu.active {
    transform: translateY(0);
    opacity: 1;
    visibility: visible;
}

.mobile-nav-list {
    display: flex;
    flex-direction: column;
    list-style: none;
    gap: var(--space-2);
    margin: 0 0 var(--space-4) 0;
    padding: 0;
}

.mobile-nav-list .nav-link {
    color: var(--gray-200);
    text-decoration: none;
    font-weight: 500;
    padding: var(--space-3) var(--space-4);
    border-radius: var(--border-radius);
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
}

.mobile-nav-list .nav-link:hover,
.mobile-nav-list .nav-link.active {
    color: var(--primary);
    background: var(--accent);
    transform: translateX(4px);
}

@media (min-width: 768px) {
    .mobile-menu {
        display: none;
    }
    
    .nav-link.active {
        color: var(--primary);
        background: var(--gray-800);
    }
}
`;
document.head.appendChild(style);

console.log(`
The Waste Masters Professional Website
Mobile-first, performance-optimized template
Ready to convert visitors into customers!

Need junk removal? Call (305) 986-0692
`);