/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ywykaivywtvcucedxnoc.supabase.co',
        pathname: '/storage/v1/object/public/**'
      },
      { protocol: 'https', hostname: '*.supabase.co' },
      { protocol: 'https', hostname: '*.supabase.in' }
    ]
  }
}

export default nextConfig
