/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['pg', '@prisma/client'],
  experimental: {
    optimizePackageImports: ['lucide-react', 'date-fns'],
  },
  // Add your phone's IP address here to allow network testing
  allowedDevOrigins: ['192.168.1.219'],
};

export default nextConfig;