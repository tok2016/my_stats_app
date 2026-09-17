import { unlink } from 'fs/promises';
import path from 'path';

import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

import { GeneralEndpointAction, ProtectedEndpointAction } from '@ts/requests';
import { NewCredentials } from '@ts/users/credentials';
import { UserUpdate } from '@ts/users/user';

import {
  AVATAR_DIRECTORY,
  checkUserExistance,
  generateAccessResponse,
  tryGetUserById,
  tryHashPassword
} from '@lib/auth';
import { generalEndpoint, protectedEndpoint } from '@lib/endpoint-generators';
import {
  ConfirmationsModel,
  CredentialsModel,
  GamesModel,
  ServiceCredentialsModel,
  UsersModel
} from '@lib/models';
import { generateErrorResponse, uniteUserData } from '@lib/utils';
import {
  CredentialsValidator,
  UserUpdateValidator,
  validateData
} from '@lib/validation-schemas';

/**
 * Protected method. Finds user by token.
 * @param _req - Request object.
 * @param _params - Route params.
 * @param token - Token object.
 * @throws 404 if user is not found.
 * @returns User with credentials from given token.
 */
const getCurrentUser: ProtectedEndpointAction<'/api/user'> = async (
  _req,
  _params,
  token
) => {
  const user = await tryGetUserById(token.id);

  return NextResponse.json(user, {
    status: 200,
    statusText: 'User was found'
  });
};

/**
 * Public method. Creates new user account.
 * @param req - Request object with new user data.
 * @throws 400 if given data is invalid or user with given data already exists.
 * @returns Refresh and access tokens.
 */
const postNewUser: GeneralEndpointAction<'/api/user'> = async (
  req: NextRequest
) => {
  //Checks new user's data for errors.
  const newCredentials = await validateData<NewCredentials>(
    CredentialsValidator,
    await req.json()
  );

  //Checks if user with given email or username already exists.
  const userExistance = await checkUserExistance(
    newCredentials.username,
    newCredentials.email
  );

  if (userExistance) throw generateErrorResponse(400, userExistance);

  //Hashes password and stores user and credentials data.
  const hashedPassword = await tryHashPassword(newCredentials.password);
  const user = await UsersModel.create({
    isPublic: false
  });

  const credentials = await CredentialsModel.create({
    ...newCredentials,
    password: hashedPassword,
    createdAt: new Date().toISOString(),
    userId: user._id.toString()
  });

  return await generateAccessResponse(
    credentials.id,
    credentials.username,
    'User account was created successfully'
  );
};

/**
 * Protected method. Updates data of user identified by token.
 * @param req - Request object with updated data.
 * @param _params - Route params.
 * @param token - Token object.
 * @throws 400 if given data is invalid.
 * @throws 404 if user is not found.
 * @returns User with updated data.
 */
const putCurrentUser: ProtectedEndpointAction<'/api/user'> = async (
  req,
  _params,
  token
) => {
  //Checks updated data for errors.
  const userUpdate = await validateData<UserUpdate>(
    UserUpdateValidator,
    await req.json()
  );

  //Finds user credentials. If email is changed, updates credentials data.
  const credentials = userUpdate.email
    ? await CredentialsModel.findByIdAndUpdate(
        token.id,
        { email: userUpdate.email },
        { new: true }
      ).lean()
    : await CredentialsModel.findById(token.id).lean();

  if (!credentials) throw generateErrorResponse(404, 'User was not found');

  //Stores updated user data.
  delete userUpdate.email;
  const userInfo = await UsersModel.findByIdAndUpdate(
    credentials.userId,
    userUpdate,
    { new: true }
  ).lean();

  if (!userInfo) throw generateErrorResponse(404, 'User data was not found');

  return NextResponse.json(uniteUserData(credentials, userInfo), {
    status: 200,
    statusText: 'User data was updated successfully'
  });
};

/**
 * Protected method. Deletes user by token if they confirm it.
 * @param req - Request object with confirmation operation id.
 * @param _params - Route params.
 * @param token - Token object.
 * @throws 401 if delete operation was not confirmed.
 * @throws 404 if user is not found.
 * @returns Response object.
 */
const deleteCurrentUser: ProtectedEndpointAction<'/api/user'> = async (
  req,
  _params,
  token
) => {
  //Check if delete operation was confirmed by user.
  const operationId = req.nextUrl.searchParams.get('operationId');
  if (!operationId)
    throw generateErrorResponse(401, 'Operation was not confirmed');

  const confirmation = await ConfirmationsModel.findById(operationId).lean();
  if (
    !confirmation
    || !confirmation.isConfirmed
    || confirmation.action !== 'delete'
  )
    throw generateErrorResponse(401, 'Operation was not confirmed');

  //Deletes credentials data.
  const credentials = await CredentialsModel.findByIdAndDelete(token.id).lean();
  if (!credentials) throw generateErrorResponse(404, 'User was not found');

  //Deletes cookies.
  const cookieStore = await cookies();
  cookieStore.delete('refreshToken');
  cookieStore.delete('accessToken');
  cookieStore.delete('operation');

  //Deletes rest user data and file of their avatar.
  const userInfo = await UsersModel.findByIdAndDelete(credentials.userId);
  await ServiceCredentialsModel.deleteMany({ userId: credentials.userId });
  await ConfirmationsModel.findByIdAndDelete(operationId);
  await GamesModel.deleteMany({ userId: credentials.userId });

  if (userInfo && userInfo.avatarUrl) {
    await unlink(path.join(AVATAR_DIRECTORY, userInfo.avatarUrl));
  }

  return new NextResponse('User was deleted successfully', {
    status: 200,
    statusText: 'User was deleted successfully'
  });
};

export const GET = protectedEndpoint(getCurrentUser);
export const POST = generalEndpoint(postNewUser);
export const PUT = protectedEndpoint(putCurrentUser);
export const DELETE = protectedEndpoint(deleteCurrentUser);
