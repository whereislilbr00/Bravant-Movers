/** @type {import('next').NextConfig} */
const nextConfig = {
  // Image optimization
  images: {
    remotePatterns: [
      {
      protocol: 'https',
      hostname: '**.fbcdn.net',  // ✅ ANY Facebook CDN subdomain
    },
    {
      protocol: 'https',
      hostname: '**.fna.fbcdn.net',  // ✅ Specifically FNA subdomains
    },
    {
      protocol: 'https',
      hostname: 'media.licdn.com',
    },
    {
      protocol: 'https',
      hostname: '**.githubusercontent.com',
    },
  ],
    unoptimized: process.env.NODE_ENV === 'development',
  },

  // Redirects for SEO
  async redirects() {
    return [
      {
        source: '/quote',
        destination: '/#pricing',
        permanent: true,
      },
      {
        source: '/booking',
        destination: '/#contact',
        permanent: true,
      },
    ];
  },

  // Headers for security and performance
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permission-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },

  // Webpack configuration
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Optimization for server builds
      config.optimization = {
        ...config.optimization,
        concatenateModules: true,
      };
    }
    return config;
  },

  // Environment variables
  env: {
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME || 'Bravant Movers & Cleaners',
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  },

  // Experimental features
  experimental: {
    optimizePackageImports: ['framer-motion'],
  },

  // Compression
  compress: true,

  // Powering by header
  poweredByHeader: false,

  // Production source maps
  productionBrowserSourceMaps: false,
};

module.exports = nextConfig;
