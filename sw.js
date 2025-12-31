/**
 * Service Worker for Hugo Tech Blog
 * Provides advanced caching, offline support, and performance optimization
 */

const CACHE_NAME = 'hugo-tech-blog-v1.0.0';
const STATIC_CACHE = 'static-cache-v1';
const DYNAMIC_CACHE = 'dynamic-cache-v1';
const IMAGE_CACHE = 'image-cache-v1';

// Cache strategies
const CACHE_STRATEGIES = {
  CACHE_FIRST: 'cache-first',
  NETWORK_FIRST: 'network-first',
  STALE_WHILE_REVALIDATE: 'stale-while-revalidate',
  NETWORK_ONLY: 'network-only',
  CACHE_ONLY: 'cache-only'
};

// Resources to cache immediately
const STATIC_ASSETS = [
  '/',
  '/css/main.css',
  '/js/main.js',
  '/js/performance.js',
  '/js/theme.js',
  '/manifest.json',
  '/offline.html'
];

// Cache configuration for different resource types
const CACHE_CONFIG = {
  // Static assets - cache first
  static: {
    strategy: CACHE_STRATEGIES.CACHE_FIRST,
    cacheName: STATIC_CACHE,
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    maxEntries: 100
  },
  // HTML pages - network first with fallback
  pages: {
    strategy: CACHE_STRATEGIES.NETWORK_FIRST,
    cacheName: DYNAMIC_CACHE,
    maxAge: 24 * 60 * 60 * 1000, // 1 day
    maxEntries: 50
  },
  // Images - stale while revalidate
  images: {
    strategy: CACHE_STRATEGIES.STALE_WHILE_REVALIDATE,
    cacheName: IMAGE_CACHE,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    maxEntries: 200
  },
  // API calls - network first
  api: {
    strategy: CACHE_STRATEGIES.NETWORK_FIRST,
    cacheName: DYNAMIC_CACHE,
    maxAge: 5 * 60 * 1000, // 5 minutes
    maxEntries: 50
  }
};

/**
 * Install event - cache static assets
 */
self.addEventListener('install', event => {
  console.log('Service Worker installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        console.log('Caching static assets...');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('Static assets cached successfully');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('Failed to cache static assets:', error);
      })
  );
});

/**
 * Activate event - clean up old caches
 */
self.addEventListener('activate', event => {
  console.log('Service Worker activating...');
  
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== STATIC_CACHE && 
                cacheName !== DYNAMIC_CACHE && 
                cacheName !== IMAGE_CACHE) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker activated');
        return self.clients.claim();
      })
  );
});

/**
 * Fetch event - handle all network requests
 */
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Skip external requests
  if (url.origin !== location.origin) {
    return;
  }
  
  // Determine cache strategy based on request type
  const strategy = getCacheStrategy(request);
  
  event.respondWith(
    handleRequest(request, strategy)
  );
});

/**
 * Determine cache strategy based on request
 */
function getCacheStrategy(request) {
  const url = new URL(request.url);
  const pathname = url.pathname;
  
  // Images
  if (request.destination === 'image' || 
      /\.(jpg|jpeg|png|gif|webp|avif|svg)$/i.test(pathname)) {
    return CACHE_CONFIG.images;
  }
  
  // Static assets (CSS, JS, fonts)
  if (request.destination === 'style' || 
      request.destination === 'script' || 
      request.destination === 'font' ||
      /\.(css|js|woff|woff2|ttf|eot)$/i.test(pathname)) {
    return CACHE_CONFIG.static;
  }
  
  // API calls
  if (pathname.startsWith('/api/')) {
    return CACHE_CONFIG.api;
  }
  
  // HTML pages
  return CACHE_CONFIG.pages;
}

/**
 * Handle request based on cache strategy
 */
async function handleRequest(request, config) {
  const { strategy, cacheName } = config;
  
  switch (strategy) {
    case CACHE_STRATEGIES.CACHE_FIRST:
      return cacheFirst(request, cacheName, config);
    
    case CACHE_STRATEGIES.NETWORK_FIRST:
      return networkFirst(request, cacheName, config);
    
    case CACHE_STRATEGIES.STALE_WHILE_REVALIDATE:
      return staleWhileRevalidate(request, cacheName, config);
    
    case CACHE_STRATEGIES.NETWORK_ONLY:
      return fetch(request);
    
    case CACHE_STRATEGIES.CACHE_ONLY:
      return caches.match(request);
    
    default:
      return networkFirst(request, cacheName, config);
  }
}

/**
 * Cache first strategy
 */
async function cacheFirst(request, cacheName, config) {
  try {
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      // Check if cache is still valid
      if (isCacheValid(cachedResponse, config.maxAge)) {
        return cachedResponse;
      }
    }
    
    // Fetch from network and cache
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      await cacheResponse(request, networkResponse.clone(), cacheName, config);
    }
    
    return networkResponse;
  } catch (error) {
    console.error('Cache first strategy failed:', error);
    
    // Return cached response as fallback
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline page for HTML requests
    if (request.headers.get('accept').includes('text/html')) {
      return caches.match('/offline.html');
    }
    
    throw error;
  }
}

/**
 * Network first strategy
 */
async function networkFirst(request, cacheName, config) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      await cacheResponse(request, networkResponse.clone(), cacheName, config);
    }
    
    return networkResponse;
  } catch (error) {
    console.error('Network first strategy failed:', error);
    
    // Fallback to cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline page for HTML requests
    if (request.headers.get('accept').includes('text/html')) {
      return caches.match('/offline.html');
    }
    
    throw error;
  }
}

/**
 * Stale while revalidate strategy
 */
async function staleWhileRevalidate(request, cacheName, config) {
  const cachedResponse = await caches.match(request);
  
  // Fetch from network in background
  const networkResponsePromise = fetch(request)
    .then(response => {
      if (response.ok) {
        cacheResponse(request, response.clone(), cacheName, config);
      }
      return response;
    })
    .catch(error => {
      console.error('Background fetch failed:', error);
    });
  
  // Return cached response immediately if available
  if (cachedResponse) {
    return cachedResponse;
  }
  
  // Wait for network response if no cache
  try {
    return await networkResponsePromise;
  } catch (error) {
    // Return offline page for HTML requests
    if (request.headers.get('accept').includes('text/html')) {
      return caches.match('/offline.html');
    }
    throw error;
  }
}

/**
 * Cache response with size and age limits
 */
async function cacheResponse(request, response, cacheName, config) {
  try {
    const cache = await caches.open(cacheName);
    
    // Add timestamp for cache validation
    const responseWithTimestamp = new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: {
        ...response.headers,
        'sw-cache-timestamp': Date.now().toString()
      }
    });
    
    await cache.put(request, responseWithTimestamp);
    
    // Clean up old entries if needed
    await cleanupCache(cacheName, config.maxEntries);
  } catch (error) {
    console.error('Failed to cache response:', error);
  }
}

/**
 * Check if cached response is still valid
 */
function isCacheValid(response, maxAge) {
  const timestamp = response.headers.get('sw-cache-timestamp');
  if (!timestamp) {
    return false;
  }
  
  const age = Date.now() - parseInt(timestamp);
  return age < maxAge;
}

/**
 * Clean up old cache entries
 */
async function cleanupCache(cacheName, maxEntries) {
  try {
    const cache = await caches.open(cacheName);
    const keys = await cache.keys();
    
    if (keys.length > maxEntries) {
      const entriesToDelete = keys.slice(0, keys.length - maxEntries);
      await Promise.all(
        entriesToDelete.map(key => cache.delete(key))
      );
      console.log(`Cleaned up ${entriesToDelete.length} old cache entries from ${cacheName}`);
    }
  } catch (error) {
    console.error('Cache cleanup failed:', error);
  }
}

/**
 * Handle background sync for offline actions
 */
self.addEventListener('sync', event => {
  if (event.tag === 'background-sync') {
    event.waitUntil(
      handleBackgroundSync()
    );
  }
});

/**
 * Handle background sync operations
 */
async function handleBackgroundSync() {
  try {
    // Sync any pending offline actions
    console.log('Background sync triggered');
    
    // Example: sync form submissions, analytics, etc.
    // This would be implemented based on specific needs
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}

/**
 * Handle push notifications
 */
self.addEventListener('push', event => {
  if (!event.data) {
    return;
  }
  
  const data = event.data.json();
  const options = {
    body: data.body,
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [200, 100, 200],
    data: data.data,
    actions: data.actions || []
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

/**
 * Handle notification clicks
 */
self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  if (event.action) {
    // Handle action buttons
    handleNotificationAction(event.action, event.notification.data);
  } else {
    // Handle notification click
    event.waitUntil(
      clients.openWindow(event.notification.data.url || '/')
    );
  }
});

/**
 * Handle notification actions
 */
function handleNotificationAction(action, data) {
  switch (action) {
    case 'view':
      clients.openWindow(data.url || '/');
      break;
    case 'dismiss':
      // Just close the notification
      break;
    default:
      console.log('Unknown notification action:', action);
  }
}

/**
 * Handle messages from main thread
 */
self.addEventListener('message', event => {
  const { type, payload } = event.data;
  
  switch (type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;
    
    case 'GET_CACHE_SIZE':
      getCacheSize().then(size => {
        event.ports[0].postMessage({ type: 'CACHE_SIZE', payload: size });
      });
      break;
    
    case 'CLEAR_CACHE':
      clearAllCaches().then(() => {
        event.ports[0].postMessage({ type: 'CACHE_CLEARED' });
      });
      break;
    
    default:
      console.log('Unknown message type:', type);
  }
});

/**
 * Get total cache size
 */
async function getCacheSize() {
  try {
    const cacheNames = await caches.keys();
    let totalSize = 0;
    
    for (const cacheName of cacheNames) {
      const cache = await caches.open(cacheName);
      const keys = await cache.keys();
      
      for (const key of keys) {
        const response = await cache.match(key);
        if (response) {
          const blob = await response.blob();
          totalSize += blob.size;
        }
      }
    }
    
    return totalSize;
  } catch (error) {
    console.error('Failed to calculate cache size:', error);
    return 0;
  }
}

/**
 * Clear all caches
 */
async function clearAllCaches() {
  try {
    const cacheNames = await caches.keys();
    await Promise.all(
      cacheNames.map(cacheName => caches.delete(cacheName))
    );
    console.log('All caches cleared');
  } catch (error) {
    console.error('Failed to clear caches:', error);
  }
}

// Log service worker version
console.log('Service Worker v1.0.0 loaded');