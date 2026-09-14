import type { NextConfig } from 'next';

const supabaseHost = process.env.NEXT_PUBLIC_SUPABASE_URL ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname : undefined;

const nextConfig: NextConfig = {
  images: {
    remotePatterns: supabaseHost ? [{ protocol: 'https', hostname: supabaseHost, pathname: '/storage/v1/object/**' }] : [],
  },
  async redirects() {
    return [
      { source: '/books/:slug/read', destination: '/read/:slug', permanent: false },
      { source: '/activities', destination: '/colouring', permanent: true },
      { source: '/dashboard', destination: '/account', permanent: false },
    ];
  },
};

export default nextConfig;
