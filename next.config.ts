import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['api.dicebear.com', 'image.tmdb.org', 'files.edgestore.dev'],
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/,
      loader: 'svg-inline-loader',
    });
    return config;
  },
};

export default nextConfig;
