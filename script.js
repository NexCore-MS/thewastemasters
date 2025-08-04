// ===================================
// THE WASTE MASTERS - MOBILE-FIRST JS
// Clean, minimal, performance-focused
// ===================================

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initMobileMenu();
    initSmoothScrolling();
    initBackToTop();
    initCallTracking();
    initAnimations();
});

// ===================================
// MOBILE MENU
// ===================================
function initMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const menuLinks = document.querySelectorAll('.menu-link');
    
    if (!menuToggle || !mobileMenu) return;
    
    // Toggle menu
    menuToggle.addEventListener('click', function(e) {
        e.preventDefault();
        toggleMenu();
    });
    
    // Close menu when clicking links
    menuLinks.forEach(link => {
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
                
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
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
// CALL TRACKING & ANALYTICS
// ===================================
function initCallTracking() {
    const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
    const smsLinks = document.querySelectorAll('a[href^="sms:"]');
    const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
    
    // Track phone calls
    phoneLinks.forEach(link => {
        link.addEventListener('click', function() {
            // You can add analytics tracking here
            console.log('Phone call initiated:', this.href);
            
            // Example: Google Analytics event
            if (typeof gtag !== 'undefined') {
                gtag('event', 'phone_call', {
                    'event_category': 'engagement',
                    'event_label': 'phone_click'
                });
            }
        });
    });
    
    // Track SMS
    smsLinks.forEach(link => {
        link.addEventListener('click', function() {
            console.log('SMS initiated:', this.href);
            
            if (typeof gtag !== 'undefined') {
                gtag('event', 'sms', {
                    'event_category': 'engagement',
                    'event_label': 'sms_click'
                });
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
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Elements to animate on scroll
    const animateElements = document.querySelectorAll(`
        .service-card,
        .step,
        .stat,
        .about-feature,
        .contact-option
    `);
    
    animateElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
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

// Preload critical images on hover (mobile-friendly)
if (!window.matchMedia('(hover: none)').matches) {
    const preloadImages = [
        'newlogo.jpg'
    ];
    
    preloadImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = src;
        document.head.appendChild(link);
    });
}

// ===================================
// ERROR HANDLING
// ===================================

// Global error handler for JavaScript errors
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    // You can send errors to analytics service here
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled promise rejection:', e.reason);
    // You can send errors to analytics service here
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
    
    // Handle touch feedback for buttons
    const interactiveElements = document.querySelectorAll(`
        .btn,
        .service-card,
        .contact-option,
        .menu-link
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
// CONSOLE MESSAGE
// ===================================

console.log(`
🗑️ The Waste Masters Website
📱 Mobile-first, performance-optimized
🚀 Ready to haul away your junk!

Need junk removal? Call (305) 986-0692
`);