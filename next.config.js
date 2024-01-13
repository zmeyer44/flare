/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    swcPlugins: ["next-superjson-plugin"],
  },
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: `*`,
          },
        ],
      },
      {
        source: "/.well-known/:path*",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: `*`,
          },
        ],
      },
      {
        source: "/:path*",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: `*`,
          },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/.well-known/nostr.json",
        destination: "/api/well-known/nostr",
      },
    ];
  },
  images: {
    domains: ["t2.gstatic.com", "www.google.com", "flockstr.s3.amazonaws.com"],
  },
};

module.exports = nextConfig;
