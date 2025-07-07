/**
 * Next.js Configuration for FleetOps Cloud Service
 * 
 * This configuration is for the cloud-first service that connects
 * to AWS IoT Core for fleet telemetry data. Unlike the debug tool,
 * this service does not include PWA functionality as it's designed
 * for always-online cloud operations.
 */

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Strict mode for better React development
  reactStrictMode: true,
  
  // Transpile workspace packages
  transpilePackages: [
    '@repo/ui',
    '@repo/telemetry',
    '@repo/theme'
  ],
  
  // Future: Add domains for AWS CloudFront or S3 assets
  // images: {
  //   domains: ['your-cloudfront-domain.cloudfront.net'],
  // },
};

export default nextConfig;