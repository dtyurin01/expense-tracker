import type { NextConfig } from "next";
import bundleAnalyzer from "@next/bundle-analyzer";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
  transpilePackages: ["geist"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "i.pravatar.cc" },
      {
        protocol: "http",
        hostname: "localhost",
        port: "5072",
        pathname: "/uploads/**",
      },
    ],
  },
};

export default withBundleAnalyzer(nextConfig);
