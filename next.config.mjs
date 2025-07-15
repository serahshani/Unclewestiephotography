/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.ytimg.com', // Correct hostname for YouTube thumbnails
        port: '',
        pathname: '/vi/**', // Allows any path under /vi/
      },
 ] },
  // Add any other Next.js configurations here if you have them
  // For example, if you're using the new app directory:
  // experimental: {
  //   appDir: true,
  // },
};

// Use 'export default' for ES module syntax (common in newer Next.js setups or when "type": "module" is in package.json)
export default nextConfig;

// If your project explicitly uses CommonJS modules (less common in modern Next.js setups),
// you would use:
// module.exports = nextConfig;
// But based on your error, 'export default' is what you need.