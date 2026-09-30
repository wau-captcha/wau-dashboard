import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // .next/standalone: server.js plus only the node_modules it uses, for the Docker image.
  output: "standalone",
};

export default nextConfig;
