/** @type {import('next').NextConfig} */
// PUBLIC_INTERFACE
// Next.js configuration for Athera (Notion/Obsidian clone).
// If deployment system reports "no output directory found":
// 1. The Next.js build output folder is always ".next" UNLESS you set "distDir" or use "next export" (then it's "out/").
// 2. You can set distDir below to explicitly force ".next" or any desired directory for diagnostics.
// 3. Most platforms (Vercel, Netlify, etc) expect ".next" for SSR and default exports, "out" for static export.

// Uncomment these if you want to debug further:
// distDir: '.next',
// output: 'standalone', // for Docker/serverless packaging

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  experimental: {
    // missingSuspenseWithCSRBailout: false,
  }
};

module.exports = nextConfig;
