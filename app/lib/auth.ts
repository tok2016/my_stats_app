import jwt from 'jsonwebtoken';

import Token from '@ts/users/token';

import { CredentialsModel } from './models';

const ACCESS_TTL = 5 * 60 * 1000;
const REFRESH_TTL = 30 * 24 * 60 * 60 * 1000;

export const generateToken = async (
  username: string,
  password: string,
  isRefresh: boolean = false
): Promise<string> => {
  const expireDate = new Date(
    Date.now() + (isRefresh ? REFRESH_TTL : ACCESS_TTL)
  );

  const token: Token = {
    username: username,
    password: password,
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
