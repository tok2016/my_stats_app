import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { cookies } from 'next/headers';

import { Token } from '@ts/users/token';
import Credentials from '@ts/users/credentials';
import { NewCredentials } from '@ts/users/new-credentials';

import { CredentialsModel } from './models';
import { MILLISECONDS } from './utils';

export const ACCESS_TTL = 5 * 60 * MILLISECONDS;
export const REFRESH_TTL = 30 * 24 * 60 * 60 * MILLISECONDS;

export const generateToken = async (
  newCredentials: Omit<NewCredentials, 'email'>,
  isRefresh: boolean = false
): Promise<string> => {
  const expireDate = new Date(
    Date.now() + (isRefresh ? REFRESH_TTL : ACCESS_TTL)
  );

  const token: Token = {
    username: newCredentials.username,
    password: newCredentials.password,
    expiresAt: expireDate.toISOString()
  };

  return new Promise<string>((resolve) => {
    if (!process.env.SECRET_KEY) {
      throw new Error('Internal server error');
    }

    resolve(jwt.sign(token, process.env.SECRET_KEY, { algorithm: 'HS256' }));
  });
};

export const decodeToken = async <T>(token: string): Promise<T> => {
  return new Promise<T>((resolve) => {
    if (!process.env.SECRET_KEY) {
      throw new Error('Internal server error');
    }

    resolve(
      jwt.verify(token, process.env.SECRET_KEY, { algorithms: ['HS256'] }) as T
    );
  });
};

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

export const getCredentialsByToken = async (
  token: Token
): Promise<Credentials> => {
  const credentials = await CredentialsModel.findOne({
    username: token.username
  });

  if (!credentials) {
    throw new Error('User was not found');
  }

  const arePasswordSame = await bcrypt.compare(
    token.password,
    credentials.password
  );
  if (!arePasswordSame) {
    throw new Error(`Passwords don't match`);
  }

  return {
    id: credentials.id,
    password: credentials.password,
    username: credentials.username,
    userId: credentials.userId.toString(),
    email: credentials.email,
    createdAt: credentials.createdAt
  };
};

export const comapareTokens = (accessToken: Token, refreshToken: Token) =>
  accessToken.username === refreshToken.username
  && accessToken.password === refreshToken.password;

export const deleteTokens = async () => {
  const cookiesStorage = await cookies();
  cookiesStorage.delete('accessToken');
  cookiesStorage.delete('refreshToken');
};
