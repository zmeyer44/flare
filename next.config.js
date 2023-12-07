/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    swcPlugins: ["next-superjson-plugin"],
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
