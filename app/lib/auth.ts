import bcrypt from 'bcrypt';
import path from 'path';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { User } from '@ts/users/user';
import { UserAccess } from '@ts/users/user';
import Credentials, { CredentialsInSchema } from '@ts/users/credentials';
import Dashboard from '@ts/users/dashboard';
import Confirmation, { ConfirmationInfo } from '@ts/users/confirmation';

import { CredentialsModel, DashboardsModel, UsersModel } from './models';
import {
  responseWithError,
  isErrorResponse,
  uniteUserData,
  generateErrorResponse
} from './utils';
import { ACCESS_TTL, extractToken, generateToken, REFRESH_TTL } from './token';

export const AVATAR_DIRECTORY = path.join(process.cwd(), 'avatars');

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

  const cookiesStorage = await cookies();
  cookiesStorage.set('accessToken', userAccess.access, {
    httpOnly: true,
    maxAge: ACCESS_TTL
  });
  cookiesStorage.set('refreshToken', userAccess.refresh, {
    httpOnly: true,
    maxAge: REFRESH_TTL
  });

  return NextResponse.json(userAccess, {
    status: 201,
    statusText
  });
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

export const generateConfirmationResponse = (operation: Confirmation) => {
  const operationInfo: ConfirmationInfo = {
    id: operation.id,
    credential: operation.credential,
    action: operation.action,
    isConfirmed: operation.isConfirmed
  };

  return NextResponse.json(operationInfo, {
    status: 202,
    statusText: 'Confirmation operation was accepted'
  });
};
