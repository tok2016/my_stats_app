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
  const pathnames = req.nextUrl.pathname.split('/');

  const isApi = pathnames[1] === 'api';
  const isAuth = AUTH_PATHS_REGEX.test(pathnames[1]);
  const refresh = req.cookies.get('refreshToken');
  const access = req.cookies.get('accessToken');

  try {
    const refreshToken = await decodeToken(refresh?.value ?? '');
    if (isExpired(refreshToken.expiresAt)) {
      throw new Error('Session is expired');
    }

    const response = isAuth
      ? NextResponse.redirect(new URL('/iam', req.url))
      : NextResponse.next();

    if (
      !access
      || (await isAccessLegit(await decodeToken(access.value), refreshToken))
    ) {
      const newAccess = await generateToken(refreshToken.id);
      response.cookies.set('accessToken', newAccess, {
        httpOnly: true,
        maxAge: ACCESS_TTL
      });
    }

    if (isApi) {
      response.headers.set('Authorization', `bearer ${access?.value}`);
    }

    return response;
  } catch {
    const response =
      isApi || !pathnames[1] || isAuth
        ? NextResponse.next()
        : NextResponse.redirect(new URL('/login', req.url));

    response.cookies.delete('refreshToken');
    response.cookies.delete('accessToken');

    return response;
  }
}

export const config: MiddlewareConfig = {
  matcher: ['/(api|register|login|reset-password|iam|music|games|admin)']
};
