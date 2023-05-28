const nextConfig = {
  experimental: {
    appDir: true,
  },
  publicRuntimeConfig: {
    // Will be available on both server and client
    staticFolder: '/static',
    // Add your Stripe publishable key here
    stripe: {
      publishableKey:  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'files.stripe.com',
      },
    ],
  },
}

module.exports = nextConfig;
