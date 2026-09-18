import { SignJWT, jwtVerify } from 'jose';

import Token, { TokenPack } from '@ts/users/token';

import { MILLISECONDS, generateErrorResponse, isExpired } from './utils';

export const ACCESS_TTL = 5 * 60;
export const REFRESH_TTL = 30 * 24 * 60 * 60;

const encoder = new TextEncoder();

/**
 * Encodes data by JWT.
 * @param data - Data to encode.
 * @returns JWT-encoded data.
 */
export const encodeJwt = async (data: object) => {
  if (!process.env.SECRET_KEY || !process.env.ALGORITHM) {
    throw generateErrorResponse(500, 'Internal server error');
  }

  return await new SignJWT({ ...data })
    .setProtectedHeader({ alg: process.env.ALGORITHM })
    .sign(encoder.encode(process.env.SECRET_KEY));
};

/**
 * Decodes token by JWT.
 * @param token - JWT-encoded data.
 * @returns Decoded data.
 */
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

/**
 * Generates and encodes token object.
 * @param credentialsId - User credentials id to encode.
 * @param isRefresh - If true, generates refresh token. Genereates access token otherwise.
 * @returns Encoded token.
 */
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

/**
 * Decodes token.
 * @param token - Encoded token.
 * @returns Token object.
 */
export const decodeToken = async (token: string): Promise<Token> => {
  const decoded = await decodeJwt<Token>(token);

  return {
    id: decoded.payload.id,
    expiresAt: decoded.payload.expiresAt
  };
};

/**
 * Extracts token from header and decodes.
 * @param headerWithToken - Header content with token.
 * @throws 401 if token is not set or expired.
 * @returns Token object.
 */
export const tryExtractTokenFromHeader = async (
  headerWithToken: string | null
): Promise<Token> => {
  const token = headerWithToken?.split(' ').at(-1);

  if (!token) {
    throw generateErrorResponse(401, 'Unauthorized');
  }

  const decoded = await decodeToken(token);

  if (isExpired(decoded.expiresAt)) {
    throw generateErrorResponse(401, 'Session is expired');
  }

  return decoded;
};

/**
 * Checks if access and refresh tokens authorized same user.
 * @param accessToken
 * @param refreshToken
 * @throws 403 if tokens authorizes different users.
 * @returns True if access token is expired.
 */
const checkAccessLegalityAndExpiration = (
  accessToken: Token,
  refreshToken: Token
) => {
  if (accessToken.id !== refreshToken.id)
    throw generateErrorResponse(403, 'Forbidden');

  return isExpired(accessToken.expiresAt);
};

/**
 * Refreshes access token.
 * @param defaultRefresh - Encoded refresh token
 * @param defaultAccess - Encoded access token.
 * @returns Relevant refresh and access tokens with update flag. Update flag means that token was refreshed.
 */
export const refreshAccessTokens = async (
  defaultRefresh?: string,
  defaultAccess?: string
): Promise<TokenPack> => {
  let accessValue = defaultAccess ?? '';
  let update = false;

  //Checks refresh token existance and expiration.
  const refreshToken = await decodeToken(defaultRefresh ?? '');
  if (isExpired(refreshToken.expiresAt))
    throw generateErrorResponse(401, 'Session is expired');

  //Check access token legality. Allows to update access token if both tokens belong to the same user.
  if (
    !accessValue
    || checkAccessLegalityAndExpiration(
      await decodeToken(accessValue),
      refreshToken
    )
  ) {
    accessValue = await generateToken(refreshToken.id);
    update = true;
  }

  return { refresh: defaultRefresh ?? '', access: accessValue, update };
};
