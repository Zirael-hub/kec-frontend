import withPWA from 'next-pwa'
import runtimeCaching from 'next-pwa/cache.js'

const customCaching = [
  // Halaman & assets – cepat dan tetap segar
  {
    urlPattern: /^https?:\/\/localhost:3000\/(?!api).*/i,
    handler: 'StaleWhileRevalidate',
    options: { cacheName: 'pages-assets' },
  },
  // Gambar – cache first
  {
    urlPattern: /^https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp|svg)$/i,
    handler: 'CacheFirst',
    options: {
      cacheName: 'images',
      expiration: { maxEntries: 60, maxAgeSeconds: 30 * 24 * 3600 },
    },
  },
  // API GET (Laravel)
  {
    urlPattern: /^https?:\/\/(127\.0\.0\.1|localhost):8000\/api\/.*$/i,
    method: 'GET',
    handler: 'NetworkFirst',
    options: {
      cacheName: 'api-cache',
      networkTimeoutSeconds: 3,
      expiration: { maxEntries: 100, maxAgeSeconds: 600 },
    },
  },
  // Pengaduan (POST) – antre saat offline
  {
    urlPattern: /^https?:\/\/(127\.0\.0\.1|localhost):8000\/api\/pengaduan$/i,
    method: 'POST',
    handler: 'NetworkOnly',
    options: {
      backgroundSync: {
        name: 'pengaduan-queue',
        options: { maxRetentionTime: 24 * 60 }, // menit
      },
    },
  },
]

const withPWAFunc = withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  runtimeCaching: [...customCaching, ...runtimeCaching],
  fallbacks: { document: '/offline' },
  buildExcludes: [/middleware-manifest\.json$/],
  disable: false, // dev juga aktif
})

export default withPWAFunc({
  reactStrictMode: true,
  experimental: { typedRoutes: true },
})
