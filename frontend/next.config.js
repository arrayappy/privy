/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@privy/sdk'],
  webpack: (config, { isServer }) => {
    // Add TypeScript loader for files in node_modules/@privy/sdk
    config.module.rules.push({
      test: /\.ts?$/,
      include: /node_modules\/@privy\/sdk/,
      use: [
        {
          loader: 'ts-loader',
          options: {
            transpileOnly: true,
          },
        },
      ],
    });

    return config;
  },
}

module.exports = nextConfig 