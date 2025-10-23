import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import Token from '@ts/users/token';
import { User } from '@ts/users/user';
import { UserAccess } from '@ts/users/user';
import Credentials, { CredentialsInSchema } from '@ts/users/credentials';
import Dashboard from '@ts/users/dashboard';

import { CredentialsModel, DashboardsModel, UsersModel } from './models';
import {
  responseWithError,
  isErrorResponse,
  isExpired,
  MILLISECONDS,
  uniteUserData,
  generateErrorResponse
} from './utils';

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
      throw generateErrorResponse(500, 'Internal server error');
    }

    resolve(jwt.sign(token, process.env.SECRET_KEY, { algorithm: 'HS256' }));
  });
};

export const decodeToken = async (token: string): Promise<Token> => {
  return new Promise<Token>((resolve) => {
    if (!process.env.SECRET_KEY) {
      throw generateErrorResponse(500, 'Internal server error');
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
  username: string,
  statusText?: string
) => {
  const userAccess: UserAccess = {
    access: await generateToken(credentialsId),
    refresh: await generateToken(credentialsId, true),
    username
  };

  const response = NextResponse.json(userAccess, {
    status: 201,
    statusText
  });

  response.cookies.set('accessToken', userAccess.access, {
    maxAge: ACCESS_TTL / MILLISECONDS
  });
  response.cookies.set('refreshToken', userAccess.refresh, {
    maxAge: REFRESH_TTL / MILLISECONDS
  });

  return response;
};

export const generateAccessError = (error: unknown) => {
  if (isErrorResponse(error)) {
    return responseWithError(error.status, error.message, error.issues);
  }

  return responseWithError(
    500,
    typeof error === 'string' ? error : 'Internal server error'
  );
};

export const hashPassword = async (password: string): Promise<string> => {
  if (!process.env.HASH_SALT) {
    throw generateErrorResponse(500, 'Internal server error');
  }

  const hashed = await bcrypt.hash(password, parseInt(process.env.HASH_SALT));

  return hashed;
};

export const checkUserExistance = async (
  username: string,
  email: string
): Promise<string> => {
  const foundUsers = await CredentialsModel.find({
    $or: [{ username }, { email }]
  }).lean();

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
    throw generateErrorResponse(401, 'Unauthorized');
  }

  const decoded = await decodeToken(token);

  if (isExpired(decoded.expiresAt)) {
    throw generateErrorResponse(401, 'Session is expired');
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

export const getCredentialsById = async (
  id: string
): Promise<Credentials & CredentialsInSchema> => {
  const credentials = await CredentialsModel.findById(id).lean();

  if (!credentials) {
    throw generateErrorResponse(404, 'User was not found');
  }

  return { ...credentials, id: credentials._id.toString() };
};

export const getCredentials = async (
  credential: string
): Promise<Credentials> => {
  const credentials = await CredentialsModel.findOne({
    $or: [{ username: credential }, { email: credential }]
  }).lean();

  if (!credentials) {
    throw generateErrorResponse(404, 'User was not found');
  }

  return { ...credentials, id: credentials._id.toString() };
};

export const getUserById = async (id: string): Promise<User> => {
  const credentials = await getCredentialsById(id);
  const userInfo = await UsersModel.findById(credentials.userId).lean();
  const dashboards = await getDashboards(credentials.userId);

  if (!userInfo) {
    throw generateErrorResponse(404, 'User data was not found');
  }

  return uniteUserData(credentials, userInfo, dashboards);
};

export const checkUserAuthorRights = async (
  userId: string | undefined,
  tokenRaw: string | null
) => {
  if (!userId) {
    throw generateErrorResponse(400, 'User id was not given');
  }

  const token = await extractToken(tokenRaw);
  const credentials = await getCredentialsById(token.id);

  if (credentials.userId !== userId) {
    throw generateErrorResponse(403, 'Forbidden');
  }
};

export const getDashboards = async (userId: string): Promise<Dashboard[]> => {
  const dashboards = await DashboardsModel.find({ userId }).lean();
  return dashboards.map((dashboard) => ({
    ...dashboard,
    id: dashboard._id.toString()
  }));
};
