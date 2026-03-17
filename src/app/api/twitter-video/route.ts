import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const videoUrl = searchParams.get('url');

    if (!videoUrl) {
      return NextResponse.json(
        { error: 'URL parameter is required' },
        { status: 400 }
      );
    }

    const decodedUrl = decodeURIComponent(videoUrl);

    if (!decodedUrl.startsWith('https://video.twimg.com/')) {
      return NextResponse.json(
        { error: 'Only video.twimg.com URLs are allowed' },
        { status: 403 }
      );
    }

    const response = await fetch(decodedUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; TwitterClone/1.0)',
        'Accept': '*/*',
        'Referer': 'https://twitter.com/',
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Twitter responded with error: ${response.status}` },
        { status: response.status }
      );
    }

    const contentType = response.headers.get('content-type') ||
      (decodedUrl.includes('.m3u8')
        ? 'application/vnd.apple.mpegurl'
        : decodedUrl.includes('.mp4') || decodedUrl.includes('.m4s')
          ? 'video/mp4'
          : 'application/octet-stream');

    if (decodedUrl.includes('.m3u8')) {
      let content = await response.text();

      const lastSlashIndex = decodedUrl.lastIndexOf('/');
      const baseUrl = decodedUrl.substring(0, lastSlashIndex + 1);
      const proxyBase = '/api/twitter-video?url=';

      content = content.replace(/([^\s"']+\.(m3u8|mp4|m4s|ts)[^\s"']*)/g, (match: string) => {
        if (match.startsWith('http')) return match;

        if (match.includes('/ext_tw_video/')) {
          const cleanMatch = match.startsWith('/') ? match.substring(1) : match;
          const fullUrl = `https://video.twimg.com/${cleanMatch}`;
          const encoded = encodeURIComponent(fullUrl);
          return proxyBase + encoded;
        }

        const cleanMatch = match.startsWith('/') ? match.substring(1) : match;
        const fullUrl = baseUrl + cleanMatch;
        const encoded = encodeURIComponent(fullUrl);
        return proxyBase + encoded;
      });

      return new NextResponse(content, {
        status: 200,
        headers: {
          'Content-Type': contentType,
          'Access-Control-Allow-Origin': 'https://twitter-clone-taupe-eight.vercel.app',
          'Cache-Control': 'public, max-age=300',
        },
      });
    }

    const buffer = await response.arrayBuffer();
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': 'https://twitter-clone-taupe-eight.vercel.app',
        'Cache-Control': 'public, max-age=3600',
        'Content-Length': buffer.byteLength.toString(),
      },
    });

  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': 'https://twitter-clone-taupe-eight.vercel.app',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
    },
  });
}