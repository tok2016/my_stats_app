import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import Token from '@ts/users/token';
import { User } from '@ts/users/user';
import UserAccess from '@ts/users/user-access';
import Credentials from '@ts/users/credentials';

import { CredentialsModel, UsersModel } from './models';
import { isExpired, MILLISECONDS, uniteUserData } from './utils';

export const ACCESS_TTL = 5 * 60 * MILLISECONDS;
export const REFRESH_TTL = 30 * 24 * 60 * 60 * MILLISECONDS;

export const generateToken = async (
  credentialsId: string,
  isRefresh: boolean = false
): Promise<string> => {
  const expireDate = new Date(
    Date.now() + (isRefresh ? REFRESH_TTL : ACCESS_TTL)
  );

  const token: Token = {
    id: credentialsId,
    expiresAt: expireDate.toISOString()
  };

  return new Promise<string>((resolve) => {
    if (!process.env.SECRET_KEY) {
      throw new Error('Internal server error');
    }

    resolve(jwt.sign(token, process.env.SECRET_KEY, { algorithm: 'HS256' }));
  });
};

export const decodeToken = async (token: string): Promise<Token> => {
  return new Promise<Token>((resolve) => {
    if (!process.env.SECRET_KEY) {
      throw new Error('Internal server error');
    }

    resolve(
      jwt.verify(token, process.env.SECRET_KEY, {
        algorithms: ['HS256']
      }) as Token
    );
  });
};

export const generateAccessResponse = async (
  credentialsId: string,
  username: string
) => {
  const userAccess: UserAccess = {
    access: await generateToken(credentialsId),
    refresh: await generateToken(credentialsId, true),
    username
  };

  const response = NextResponse.json(userAccess, {
    status: 201,
    statusText: 'User account was created successfully'
  });

  response.cookies.set('accessToken', userAccess.access, {
    maxAge: ACCESS_TTL / MILLISECONDS
  });
  response.cookies.set('refreshToken', userAccess.refresh, {
    maxAge: REFRESH_TTL / MILLISECONDS
  });

  return response;
};

export const generateAccessError = (error: unknown) =>
  error instanceof Error
    ? new NextResponse(error.message, {
        status: 404,
        statusText: error.message
      })
    : new NextResponse(null, {
        status: 500,
        statusText: 'Internal server error'
      });

export const checkUserExistance = async (
  username: string,
  email: string
): Promise<string> => {
  const foundUsers = await CredentialsModel.find({
    $or: [{ username }, { email }]
  });

  if (foundUsers[0]?.username === username) {
    return 'User with this username already exits';
  } else if (foundUsers[0]?.email === email) {
    return 'User with this email already exits';
  }

  return '';
};

export const extractToken = async (tokenRaw: string | null): Promise<Token> => {
  const token = tokenRaw?.split(' ').at(-1);

  if (!token) {
    throw new Error('Unauthorized');
  }

  const decoded = await decodeToken(token);

  if (isExpired(decoded.expiresAt)) {
    throw new Error('Session is expired');
  }

  return decoded;
};

export const comapareTokens = (accessToken: Token, refreshToken: Token) =>
  accessToken.id === refreshToken.id;

export const deleteTokens = async () => {
  const cookiesStorage = await cookies();
  cookiesStorage.delete('accessToken');
  cookiesStorage.delete('refreshToken');
};

export const getCredentialsById = async (id: string): Promise<Credentials> => {
  const credentials = await CredentialsModel.findById(id);

  if (!credentials) {
    throw new Error('User was not found');
  }

  return credentials;
};

export const getUserById = async (id: string): Promise<User> => {
  const credentials = await getCredentialsById(id);
  const userInfo = await UsersModel.findById(credentials.userId);

  if (!userInfo) {
    throw new Error('User data was not found');
  }

  return uniteUserData(credentials, userInfo);
};

export const checkUserAuthorRights = async (
  userId: string,
  tokenRaw: string | null
) => {
  const token = await extractToken(tokenRaw);
  const credentials = await getCredentialsById(token.id);
  return credentials.userId === userId;
};
