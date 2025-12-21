import { MiddlewareConfig, NextRequest, NextResponse } from 'next/server';

import { ACCESS_TTL, refreshAccessTokens } from '@lib/token';

const AUTH_PATHS_REGEX = /(register|login|reset-password)/g;

export default async function middleware(req: NextRequest) {
  const pathnames = req.nextUrl.pathname
    .split('/')
    .map((endpoint) => endpoint.trim());

  const isApi = pathnames[1] === 'api';
  //const availableForBoth = pathnames[1] === 'users';
  const isAuth = AUTH_PATHS_REGEX.test(pathnames[1]);

  const defaultRefresh =
    req.cookies.get('refreshToken')?.value
    ?? req.headers.get('MyS-Refresh')
    ?? undefined;

  const defaultAccess =
    req.cookies.get('accessToken')?.value
    ?? req.headers.get('Authorization')?.split(' ').at(-1);

  try {
    const { access, update } = await refreshAccessTokens(
      defaultRefresh,
      defaultAccess
    );

    const response = isAuth
      ? NextResponse.redirect(new URL('/iam', req.url))
      : NextResponse.next();

    if (update) {
      response.cookies.set('accessToken', access, {
        httpOnly: true,
        maxAge: ACCESS_TTL
      });
    }

    if (isApi) response.headers.set('Authorization', `bearer ${access}`);
    response.headers.delete('MyS-Refresh');

    return response;
  } catch {
    console.log(req.nextUrl.pathname);
    console.log(isAuth);
    if (isApi || !pathnames[1] || isAuth) {
      return NextResponse.next();
    }

    const response = NextResponse.redirect(new URL('/login', req.url));

    response.cookies.delete('refreshToken');
    response.cookies.delete('accessToken');

    return response;
  }
}

export const config: MiddlewareConfig = {
  matcher: [
    '/api/:path*',
    '/register',
    '/login',
    '/reset-password',
    '/iam/:path*',

    '/music/:path*',
    '/games/:path*',
    '/admin/:path*'
  ]
};
