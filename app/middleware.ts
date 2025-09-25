import { MiddlewareConfig, NextRequest, NextResponse } from 'next/server';

import { Token } from '@ts/users/token';

import {
  ACCESS_TTL,
  comapareTokens,
  decodeToken,
  deleteTokens,
  generateToken,
  getCredentialsByToken,
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

  const accessInfo = await decodeToken<Token>(accessToken.value);
  const refreshInfo = await decodeToken<Token>(refreshToken.value);

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

  try {
    const credentials = await getCredentialsByToken(accessInfo);
    if (credentials.username !== accessInfo.username) {
      return new NextResponse('Unauthorized', {
        status: 401,
        statusText: 'Unauthorized'
      });
    }

    const response = NextResponse.next();

    response.cookies.set(
      'accessToken',
      isExpired(accessInfo.expiresAt)
        ? await generateToken(accessInfo)
        : accessToken.value,
      { maxAge: ACCESS_TTL / MILLISECONDS }
    );

    response.cookies.set('refreshToken', refreshToken.value, {
      maxAge: REFRESH_TTL / MILLISECONDS
    });

    return response;
  } catch (err) {
    if (err instanceof Error) {
      return new NextResponse(err.message, {
        status: 401,
        statusText: err.message
      });
    }

    return new NextResponse(null, {
      status: 500,
      statusText: 'Internal server error'
    });
  }
}

export const config: MiddlewareConfig = {
  matcher: [
    '/((?!api/register|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)'
  ]
};
