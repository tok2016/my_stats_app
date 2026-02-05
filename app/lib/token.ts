import { SignJWT, jwtVerify } from 'jose';

import Token, { TokenPack } from '@ts/users/token';

import { MILLISECONDS, generateErrorResponse, isExpired } from './utils';
import { cookies } from 'next/headers';

export const ACCESS_TTL = 5 * 60;
export const REFRESH_TTL = 30 * 24 * 60 * 60;

const encoder = new TextEncoder();

export const encodeJwt = async (data: object) => {
  if (!process.env.SECRET_KEY || !process.env.ALGORITHM) {
    throw generateErrorResponse(500, 'Internal server error');
  }

  return await new SignJWT({ ...data })
    .setProtectedHeader({ alg: process.env.ALGORITHM })
    .sign(encoder.encode(process.env.SECRET_KEY));
};

export const decodeJwt = async <TokenType>(token: string) => {
  if (!process.env.SECRET_KEY || !process.env.ALGORITHM) {
    throw generateErrorResponse(500, 'Internal server error');
  }

  return await jwtVerify<TokenType>(
    token,
    encoder.encode(process.env.SECRET_KEY),
    {
      algorithms: [process.env.ALGORITHM]
    }
  );
};

export const generateToken = async (
  credentialsId: string,
  isRefresh: boolean = false
): Promise<string> => {
  const expireDate = new Date(
    Date.now() + (isRefresh ? REFRESH_TTL : ACCESS_TTL) * MILLISECONDS
  );

  const token: Token = {
    id: credentialsId,
    expiresAt: expireDate.toISOString()
  };

  return await encodeJwt(token);
};

export const decodeToken = async (token: string): Promise<Token> => {
  const decoded = await decodeJwt<Token>(token);

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
