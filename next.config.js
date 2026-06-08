/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  env: {
    GIT_COMMIT_SHA: process.env.GIT_COMMIT_SHA || "unknown",
    BUILD_DATE: new Date().toISOString()
  }
};

export default nextConfig;
