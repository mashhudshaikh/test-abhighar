/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      // Phase 3: locally-stored uploads served by the API at /static/uploads.
      // Production: add { protocol: "https", hostname: "api.abhighar.com", pathname: "/static/uploads/**" }
      // R2 swap later: add { protocol: "https", hostname: "media.abhighar.com" }
      { protocol: "http", hostname: "localhost", port: "3000", pathname: "/static/uploads/**" },
    ],
  },
};

export default nextConfig;