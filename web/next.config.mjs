/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // disable useEffect twice call

  // config for react-pdf, nextjs without turbopack
  // @see: https://github.com/wojtekmaj/react-pdf?tab=readme-ov-file#nextjs

  webpack: (config) => {
    config.resolve.alias.canvas = false;
    return config;
  },
};

export default nextConfig;
