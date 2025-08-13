// ===================================
// THE WASTE MASTERS - SERVICE WORKER
// PWA Features & Offline Support
// ===================================

const CACHE_NAME = 'thewastemasters-v1';
const STATIC_CACHE_NAME = 'thewastemasters-static-v1';
const DYNAMIC_CACHE_NAME = 'thewastemasters-dynamic-v1';

// Assets to cache for offline functionality
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/style.css',
    '/script.js',
    '/newlogo.jpg',
    '/residentialjunk.jpg',
    '/toter-professional-placement.jpg',
    '/toter-before-after-1.jpg',
    '/toter-commercial-setup.jpg',
    'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap'
];

// Install event - cache static assets
self.addEventListener('install', event => {
    console.log('[SW] Installing...');
    
    event.waitUntil(
        caches.open(STATIC_CACHE_NAME)
            .then(cache => {
                console.log('[SW] Caching static assets');
                return cache.addAll(STATIC_ASSETS);
            })
            .then(() => {
                console.log('[SW] Static assets cached successfully');
                return self.skipWaiting();
            })
            .catch(error => {
                console.error('[SW] Failed to cache static assets:', error);
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
    console.log('[SW] Activating...');
    
    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames
                        .filter(cacheName => {
                            return cacheName !== STATIC_CACHE_NAME && 
                                   cacheName !== DYNAMIC_CACHE_NAME;
                        })
                        .map(cacheName => {
                            console.log('[SW] Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        })
                );
            })
            .then(() => {
                console.log('[SW] Cache cleanup complete');
                return self.clients.claim();
            })
    );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
    const { request } = event;
    const requestURL = new URL(request.url);
    
    // Skip cross-origin requests
    if (!request.url.startsWith(self.location.origin) && 
        !request.url.includes('googleapis.com') &&
        !request.url.includes('formspree.io')) {
        return;
    }
    
    // Handle form submissions - always go to network
    if (request.url.includes('formspree.io') || 
        (request.method === 'POST' && request.url.includes('contact'))) {
        event.respondWith(
            fetch(request)
                .catch(() => {
                    // Return a custom offline response for form submissions
                    return new Response(
                        JSON.stringify({
                            error: 'Form submission failed. Please try again when online or call (305) 986-0692.'
                        }),
                        {
                            status: 503,
                            statusText: 'Service Unavailable',
                            headers: { 'Content-Type': 'application/json' }
                        }
                    );
                })
        );
        return;
    }
    
    // Cache-first strategy for static assets
    // Use the request pathname for exact matching instead of substring search
    // to avoid '/' matching every request
    if (STATIC_ASSETS.includes(requestURL.pathname)) {
        event.respondWith(
            caches.match(request)
                .then(cachedResponse => {
                    if (cachedResponse) {
                        console.log('[SW] Serving from cache:', request.url);
                        return cachedResponse;
                    }
                    
                    return fetch(request)
                        .then(networkResponse => {
                            // Cache successful responses
                            if (networkResponse.status === 200) {
                                const responseClone = networkResponse.clone();
                                caches.open(STATIC_CACHE_NAME)
                                    .then(cache => {
                                        cache.put(request, responseClone);
                                    });
                            }
                            return networkResponse;
                        });
                })
                .catch(() => {
                    console.log('[SW] Asset not available offline:', request.url);
                    
                    // Return fallback for images
                    if (request.destination === 'image') {
                        return new Response(
                            '<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#1c1c1e"/><text x="50%" y="50%" text-anchor="middle" fill="#30d158" font-family="sans-serif">Image Offline</text></svg>',
                            { headers: { 'Content-Type': 'image/svg+xml' } }
                        );
                    }
                })
        );
        return;
    }
    
    // Network-first strategy for other requests
    event.respondWith(
        fetch(request)
            .then(networkResponse => {
                // Cache successful GET requests
                if (request.method === 'GET' && networkResponse.status === 200) {
                    const responseClone = networkResponse.clone();
                    caches.open(DYNAMIC_CACHE_NAME)
                        .then(cache => {
                            cache.put(request, responseClone);
                        });
                }
                return networkResponse;
            })
            .catch(() => {
                // Try to serve from cache
                return caches.match(request)
                    .then(cachedResponse => {
                        if (cachedResponse) {
                            console.log('[SW] Serving cached version:', request.url);
                            return cachedResponse;
                        }
                        
                        // Return offline page for navigation requests
                        if (request.destination === 'document') {
                            return caches.match('/index.html');
                        }
                        
                        // Return generic offline response
                        return new Response(
                            'You are offline. Please check your internet connection.',
                            {
                                status: 503,
                                statusText: 'Service Unavailable',
                                headers: { 'Content-Type': 'text/plain' }
                            }
                        );
                    });
            })
    );
});

// Background sync for form submissions (if supported)
self.addEventListener('sync', event => {
    console.log('[SW] Background sync:', event.tag);
    
    if (event.tag === 'form-submission') {
        event.waitUntil(
            // Retry failed form submissions
            retryFormSubmissions()
        );
    }
});

async function retryFormSubmissions() {
    // This would implement retry logic for failed form submissions
    // stored in IndexedDB or similar
    console.log('[SW] Retrying form submissions...');
}

// Push notifications (if needed in the future)
self.addEventListener('push', event => {
    console.log('[SW] Push received:', event);
    
    const options = {
        body: event.data ? event.data.text() : 'New message from The Waste Masters',
        icon: '/newlogo.jpg',
        badge: '/newlogo.jpg',
        data: {
            url: '/'
        }
    };
    
    event.waitUntil(
        self.registration.showNotification('The Waste Masters', options)
    );
});

// Notification click handler
self.addEventListener('notificationclick', event => {
    console.log('[SW] Notification click:', event);
    
    event.notification.close();
    
    event.waitUntil(
        self.clients.openWindow(event.notification.data.url || '/')
    );
});

console.log('[SW] Service Worker loaded successfully');