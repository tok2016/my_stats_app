import bcrypt from 'bcrypt';
import path from 'path';

import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import Credentials, { CredentialsInSchema } from '@ts/users/credentials';
import { ServicesMap } from '@ts/users/service';
import { UserAccess } from '@ts/users/user';

import { CredentialsModel, ServiceCredentialsModel } from './models';
import { ACCESS_TTL, REFRESH_TTL, generateToken } from './token';
import { generateErrorResponse } from './utils';

export const AVATAR_DIRECTORY = path.join(process.cwd(), 'avatars');

/**
 * Forms response object with new refresh and access tokens.
 * @param credentialsId - User's credentials id.
 * @param username
 * @param statusText - Response message.
 * @returns Response object with new refresh and access tokens
 */
export const tryGenerateAccessResponse = async (
  credentialsId: string,
  username: string,
  statusText?: string
) => {
  //Generates tokens.
  const userAccess: UserAccess = {
    access: await generateToken(credentialsId),
    refresh: await generateToken(credentialsId, true),
    username
  };

  //Stores token in cookies.
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

export const tryHashPassword = async (password: string): Promise<string> => {
  if (!process.env.HASH_SALT)
    throw generateErrorResponse(500, 'Internal server error');

  const hashed = await bcrypt.hash(password, parseInt(process.env.HASH_SALT));
  return hashed;
};

/**
 * Finds credentials by id.
 * @param id - Credentials id.
 * @throws 404 if credentials are not found.
 * @returns Credentials of given id.
 */
export const tryGetCredentialsById = async (
  id: string
): Promise<Credentials & CredentialsInSchema> => {
  const credentials = await CredentialsModel.findById(id).lean();
  if (!credentials) throw generateErrorResponse(404, 'User was not found');

  return { ...credentials, id: credentials._id.toString() };
};

/**
 * Finds services credentials by user id.
 * @param userId
 * @returns Services credentials by service type.
 */
export const tryGetServicesByUserId = async (
  userId: string
): Promise<ServicesMap> => {
  const services = await ServiceCredentialsModel.find({
    userId
  }).lean();

  return Object.fromEntries(
    services.map((service) => [
      service.name,
      {
        ...service,
        id: service._id.toString()
      }
    ])
  );
};
