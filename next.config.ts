import type {NextConfig} from 'next'
import { Compiler } from 'webpack';
// import withBundleAnalyzer from '@next/bundle-analyzer';
import path from 'path';
import generateIconsIndex from './src/scripts/svgProcessor'

class WatchIconsPlugin {
  private iconsDir: string;

  constructor(iconsDir: string) {
    this.iconsDir = iconsDir;
  }

  apply(compiler: Compiler) {
    compiler.hooks.afterCompile.tap('WatchIconsPlugin', (compilation) => {
      compilation.contextDependencies.add(this.iconsDir);
    });
  }
}

interface CompilerWithModifiedFiles extends Compiler {
  modifiedFiles?: Set<string>;
}

class SvgChangePlugin {
  apply(compiler: Compiler): void {
    // Cast the compiler to include modifiedFiles
    const compilerWithModifiedFiles = compiler as CompilerWithModifiedFiles;

    compiler.hooks.watchRun.tapAsync(
      'SvgChangePlugin',
      async (compilation, callback) => {
        const modifiedFiles = compilerWithModifiedFiles.modifiedFiles;
        // Check if any of the modified files end with `.svg`
        const hasSvgChanges = modifiedFiles
          ? Array.from(modifiedFiles).some((file) => file.endsWith('svg'))
          : false;

        if (hasSvgChanges) {
          console.log('[SvgChangePlugin] Detected changes in .svg files. Running generateIconsIndex...');
          try {
            await generateIconsIndex();
            console.log('[SvgChangePlugin] generateIconsIndex finished successfully.');
          } catch (err) {
            console.error('[SvgChangePlugin] Error in generateIconsIndex:', err);
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            return callback(err); // Interrupt build if there's an error
          }
        }

        callback(); // Continue build
      }
    );
  }
}

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
  // const VERCEL_URL = process.env.VERCEL_URL
  //
  // if(VERCEL_URL) {
  //   return VERCEL_URL
  // }

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
  webpack: (config, { dev, nextRuntime }) => {

    config.module.rules.push({
      test: /\.svg$/,
      type: 'asset/resource',
      generator: {
        // filename: 'icons/[hash][ext][query]',
        filename: 'static/media/icons/[hash][ext][query]',
      },
    });
    // https://github.com/vercel/next.js/issues/36237#issuecomment-1117694528
    if (nextRuntime !== "nodejs") return config;
    // if(dev) {
    //   config.plugins = config.plugins || [];
    //
    //   config.plugins.push(new WatchIconsPlugin(path.resolve('./src/icons/svg')));
    //
    //   // config.plugins.push(new IconsInvalidPlugin());
    //   config.plugins.push(new SvgChangePlugin());
    // }
    return config;
  },
  reactStrictMode: false,
  async headers() {
    return [
      {
        source: '/_next/static/media/icons/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
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
