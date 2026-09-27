import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    domains: ['utfs.io', 'images.unsplash.com', 'lh3.googleusercontent.com'],
  },
};

export default withNextIntl(nextConfig);
