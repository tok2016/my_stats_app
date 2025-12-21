import { jwtVerify, SignJWT } from 'jose';
import { cookies } from 'next/headers';

import Token, { TokenPack } from '@ts/users/token';

import { generateErrorResponse, isExpired, MILLISECONDS } from './utils';

export const ACCESS_TTL = 5 * 60;
export const REFRESH_TTL = 30 * 24 * 60 * 60;

const encoder = new TextEncoder();

export const generateToken = async (
  credentialsId: string,
  isRefresh: boolean = false
): Promise<string> => {
  if (!process.env.SECRET_KEY || !process.env.ALGORITHM) {
    throw generateErrorResponse(500, 'Internal server error');
  }

  const expireDate = new Date(
    Date.now() + (isRefresh ? REFRESH_TTL : ACCESS_TTL) * MILLISECONDS
  );

  const token: Token = {
    id: credentialsId,
    expiresAt: expireDate.toISOString()
  };

  const encoded = await new SignJWT({ ...token })
    .setProtectedHeader({ alg: process.env.ALGORITHM })
    .sign(encoder.encode(process.env.SECRET_KEY));

  return encoded;
};

export const decodeToken = async (token: string): Promise<Token> => {
  if (!process.env.SECRET_KEY || !process.env.ALGORITHM) {
    throw generateErrorResponse(500, 'Internal server error');
  }

  const decoded = await jwtVerify<Token>(
    token,
    encoder.encode(process.env.SECRET_KEY),
    {
      algorithms: [process.env.ALGORITHM]
    }
  );

  return {
    id: decoded.payload.id,
    expiresAt: decoded.payload.expiresAt
  };
};

export const extractToken = async (tokenRaw: string | null): Promise<Token> => {
  const token = tokenRaw?.split(' ').at(-1);

  if (!token) {
    throw generateErrorResponse(401, 'Unauthorized');
  }

  const decoded = await decodeToken(token);

  if (isExpired(decoded.expiresAt)) {
    throw generateErrorResponse(401, 'Session is expired');
  }

  return decoded;
};

export const compareTokens = async (accessToken: Token, refreshToken: Token) =>
  accessToken.id === refreshToken.id;

export const deleteTokens = async () => {
  const cookiesStorage = await cookies();
  cookiesStorage.delete('accessToken');
  cookiesStorage.delete('refreshToken');
};

const isAccessLegit = async (accessToken: Token, refreshToken: Token) => {
  if (!(await compareTokens(accessToken, refreshToken))) {
    throw new Error('Forbidden');
  }

  return isExpired(accessToken.expiresAt);
};

export const refreshAccessTokens = async (
  defaultRefresh?: string,
  defaultAccess?: string
): Promise<TokenPack> => {
  let accessValue = defaultAccess ?? '';
  let update = false;

  const refreshToken = await decodeToken(defaultRefresh ?? '');
  if (isExpired(refreshToken.expiresAt)) {
    throw new Error('Session is expired');
  }

  if (
    !accessValue
    || (await isAccessLegit(await decodeToken(accessValue), refreshToken))
  ) {
    accessValue = await generateToken(refreshToken.id);
    update = true;
  }

  return { refresh: defaultRefresh ?? '', access: accessValue, update };
};
