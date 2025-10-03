import { MiddlewareConfig, NextRequest, NextResponse } from 'next/server';

import {
  ACCESS_TTL,
  comapareTokens,
  decodeToken,
  deleteTokens,
  generateToken,
  REFRESH_TTL
} from '@lib/auth';
import { isExpired, MILLISECONDS } from '@lib/utils';

export async function Middleware(req: NextRequest) {
  const accessToken = req.cookies.get('accessToken');
  const refreshToken = req.cookies.get('refreshToken');

  if (!accessToken || !refreshToken) {
    return new NextResponse('Unauthorized', {
      status: 401,
      statusText: 'Unauthorized'
    });
  }

  const accessInfo = await decodeToken(accessToken.value);
  const refreshInfo = await decodeToken(refreshToken.value);

  if (
    isExpired(refreshInfo.expiresAt)
    || !comapareTokens(accessInfo, refreshInfo)
  ) {
    await deleteTokens();
    return new NextResponse('Unauthorized', {
      status: 401,
      statusText: 'Unauthorized'
    });
  }

  const response = NextResponse.next();

  response.cookies.set(
    'accessToken',
    isExpired(accessInfo.expiresAt)
      ? await generateToken(accessInfo.id)
      : accessToken.value,
    { maxAge: ACCESS_TTL / MILLISECONDS }
  );

  response.cookies.set('refreshToken', refreshToken.value, {
    maxAge: REFRESH_TTL / MILLISECONDS
  });

  return response;
}

export const config: MiddlewareConfig = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)']
};
