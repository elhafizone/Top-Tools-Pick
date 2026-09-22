import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 301: redirect www to the canonical non-www origin.
  // Seobility (and Google) flag it as an error when both www and non-www
  // are reachable without a redirect — server score drops to 0%.
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.toptoolspick.com" }],
        destination: "https://toptoolspick.com/:path*",
        permanent: true,
      },
    ];
  },

  // Caching headers — tool review pages change at most once a day, so we
  // tell Hostinger's edge / any CDN to serve a cached copy for 60 s and
  // revalidate in the background.  This cuts TTFB dramatically without
  // sacrificing content freshness for real-world visitors.
  async headers() {
    return [
      {
        source: "/tools/:slug*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, s-maxage=60, stale-while-revalidate=300",
          },
        ],
      },
      {
        source: "/categories/:slug*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, s-maxage=60, stale-while-revalidate=300",
          },
        ],
      },
      {
        source: "/best/:slug*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, s-maxage=60, stale-while-revalidate=300",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
