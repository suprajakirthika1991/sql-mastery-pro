/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    // sql.js wasm support
    config.resolve.fallback = { ...config.resolve.fallback, fs: false, path: false, crypto: false };
    return config;
  },
};
export default nextConfig;
