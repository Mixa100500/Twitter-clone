import type {NextConfig} from 'next'
// import withBundleAnalyzer from '@next/bundle-analyzer';

function getEnvVariable(key: string): string {
  const value = process.env[key]
  if (value === undefined) {
    throw new Error(`Environment variable ${key} is missing.`)
  }
  return value
}

export function checkIsDevelop (): boolean {
  return process.env.NODE_ENV === 'development'
}

function getOrigin (): string {
  if(IS_DEVELOP) {
    return 'http://localhost:3000'
  }

  return getEnvVariable('NEXT_PUBLIC_ORIGIN')
}

export const IS_DEVELOP = checkIsDevelop()
export const TWITTER_CLIENT_ID = getEnvVariable('TWITTER_CLIENT_ID')
export const ENCRYPT_PASSWORD = getEnvVariable('ENCRYPT_PASSWORD')
export const ENCRYPT_SALT_HEX = getEnvVariable('ENCRYPT_SALT_HEX')
export const TWITTER_CLIENT_SECRET = getEnvVariable('TWITTER_CLIENT_SECRET')
export const NEXT_PUBLIC_ORIGIN = getOrigin()
export const AUTHORIZATION = btoa(TWITTER_CLIENT_ID + ':' + TWITTER_CLIENT_SECRET)
export const JWT_SECRET = getEnvVariable('JWT_SECRET')

const nextConfig: NextConfig =
//   withBundleAnalyzer({
//   enabled: process.env.ANALYZE === 'true', // Включить, если ANALYZE=true
// })
({
  reactStrictMode: false,
  // sassOptions: {
  //   implementation: 'sass-embedded',
  // },
  async headers() {
    return [
      {
        source: '/svg/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3156000, immutable'
          }
        ]
      }
    ]
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/home',
        permanent: true,
      },
    ];
  },
});

export default nextConfig;
