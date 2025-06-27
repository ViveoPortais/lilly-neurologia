/** @type {import('next').NextConfig} */

const nextConfig = {
 reactStrictMode: false,
 env: {
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_PROGRAM_CODE: process.env.NEXT_PUBLIC_PROGRAM_CODE,
 },
 output: "standalone",
 async redirects() {
  return [
   {
    source: "/login",
    destination: "/signin",
    permanent: true,
   },
  ];
 },
 webpack: (config) => {
  config.resolve.alias.canvas = false;

  return config;
 },
};

export default nextConfig;
