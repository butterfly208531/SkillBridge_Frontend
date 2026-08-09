import { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },

      // {
      //   protocol: 'https',
      //   hostname: 'skillbridge.s3.amazonaws.com',
      // },
      // {
      //   protocol: 'https',
      //   hostname: 'miro.medium.com',
      // },
      // {
      //   protocol: 'https',
      //   hostname: 'i.ibb.co',
      // },
      // {
      //   protocol: 'https',
      //   hostname: 'img.freepik.com',
      // },
      // {
      //   protocol: 'https',
      //   hostname: 'drive.google.com',
      // }
    ],
  },
  async rewrites() {
    return {
      // beforeFiles: run before filesystem — leave empty
      beforeFiles: [],
      // afterFiles: run after filesystem check, so Route Handlers (app/api/*) win
      afterFiles: [
        {
          source: "/api/:path*",
          destination: "https://skillbridge-backend-w2s4.onrender.com/api/:path*",
        },
      ],
      // fallback: run if nothing else matched
      fallback: [],
    };
  },
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
