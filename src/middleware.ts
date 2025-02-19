import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import {cookiesMap, ResponseToken} from "@/utils/config.ts";
import {refresh} from "@/feature/auth/refresh/refresh.ts";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get(cookiesMap.accessToken)?.value;
  const refreshToken = req.cookies.get(cookiesMap.refreshToken)?.value;

  if (token === undefined) {
    if(req.nextUrl.pathname.startsWith('/api/')) {
      // if(refreshToken === undefined) {
      //   return NextResponse.redirect(new URL('loginAction?lang=en', req.url));
      // }
      return NextResponse.next()
    }

    if(refreshToken !== undefined) {
      let refreshResponse: ResponseToken

      try {
        refreshResponse = await refresh(refreshToken);
      } catch {
        const response = NextResponse.redirect(new URL('loginAction?lang=en', req.url))
        response.cookies.delete(cookiesMap.refreshToken)
        return response
      }

      const nextResponse = NextResponse.next()

      nextResponse.cookies.set({
        name: cookiesMap.accessToken,
        value: refreshResponse.access_token,
        secure: true,
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 7200,
      })

      nextResponse.cookies.set({
        name: cookiesMap.refreshToken,
        value: refreshResponse.refresh_token,
        secure: true,
        httpOnly: true,
        sameSite: 'lax',
        // 6 months
        maxAge: 15552000,
      })

      nextResponse.cookies.set({
        name: cookiesMap.authorized,
        value: 'true',
        secure: true,
        sameSite: 'lax',
        // 6 months
        maxAge: 15552000,
      })

      return nextResponse
    }


    if(req.nextUrl.pathname === '/loginAction') {
      return NextResponse.next()
    }

    if(req.nextUrl.pathname === '/redirect') {
      return NextResponse.next()
    }

    return NextResponse.next()


    // const request = NextResponse.redirect(new URL('/loginAction', req.url));
    //
    // const url = req.nextUrl.pathname
    // const maxAge = 60 * 60
    // const state = generateState()
    // const stateWithRoute = await encryptRandomValue(state) + DIVER_STATE + btoa(url)
    //
    // request.cookies.set({
    //   name: cookiesMap.stateWithRoute,
    //   value: stateWithRoute,
    //   secure: true,
    //   httpOnly: true,
    //   sameSite: 'lax',
    //   maxAge,
    // })
    //
    // return request
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|svg).*)'
  ],
}