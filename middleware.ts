import { MiddlewareConfig, NextRequest, NextResponse } from 'next/server';

import Token from '@ts/users/token';

import {
  ACCESS_TTL,
  compareTokens,
  decodeToken,
  generateToken
} from '@lib/token';
import { isExpired } from '@lib/utils';

const AUTH_PATHS_REGEX = /(register|login|reset-password)/g;

const isAccessLegit = async (accessToken: Token, refreshToken: Token) => {
  if (!(await compareTokens(accessToken, refreshToken))) {
    throw new Error('Forbidden');
  }

  return isExpired(accessToken.expiresAt);
};

export default async function middleware(req: NextRequest) {
  const pathnames = req.nextUrl.pathname
    .split('/')
    .map((endpoint) => endpoint.trim());

  const isApi = pathnames[1] === 'api';
  const isAuth = AUTH_PATHS_REGEX.test(pathnames[1]);
  const refresh = req.cookies.get('refreshToken');
  const access = req.cookies.get('accessToken');
  let accessValue = access?.value;

  try {
    const refreshToken = await decodeToken(refresh?.value ?? '');
    if (isExpired(refreshToken.expiresAt)) {
      throw new Error('Session is expired');
    }

    const response = isAuth
      ? NextResponse.redirect(new URL('/iam', req.url))
      : NextResponse.next();

    if (
      !accessValue
      || (await isAccessLegit(await decodeToken(accessValue), refreshToken))
    ) {
      accessValue = await generateToken(refreshToken.id);
      response.cookies.set('accessToken', accessValue, {
        httpOnly: true,
        maxAge: ACCESS_TTL
      });
    }

    if (isApi) {
      response.headers.set('Authorization', `bearer ${accessValue}`);
    }

    return response;
  } catch {
    const response =
      isApi || !pathnames[1] || isAuth
        ? NextResponse.next()
        : NextResponse.redirect(new URL('/login', req.url));

    console.log(pathnames[1]);
    console.log(AUTH_PATHS_REGEX.test(pathnames[1]));

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
