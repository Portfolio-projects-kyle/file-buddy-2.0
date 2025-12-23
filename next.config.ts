import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@mui/material", "@mui/icons-material", "@emotion/react", "@emotion/styled"],
  experimental: {
    serverComponentsExternalPackages: ['pdf-parse-fork', 'mammoth'],
  },
};

export default nextConfig;