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
  getUserById,
  hashPassword
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

const getCurrentUser: ProtectedEndpointAction<'/api/user'> = async (
  _req,
  _params,
  token
) => {
  const user = await getUserById(token.id);

  return NextResponse.json(user, {
    status: 200,
    statusText: 'User was found'
  });
};

const postNewUser: GeneralEndpointAction<'/api/user'> = async (
  req: NextRequest
) => {
  const newCredentials = await validateData<NewCredentials>(
    CredentialsValidator,
    await req.json()
  );

  const userExistance = await checkUserExistance(
    newCredentials.username,
    newCredentials.email
  );

  if (userExistance) throw generateErrorResponse(400, userExistance);

  const hashedPassword = await hashPassword(newCredentials.password);
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

const putCurrentUser: ProtectedEndpointAction<'/api/user'> = async (
  req,
  _params,
  token
) => {
  const userUpdate = await validateData<UserUpdate>(
    UserUpdateValidator,
    await req.json()
  );

  const credentials = userUpdate.email
    ? await CredentialsModel.findByIdAndUpdate(
        token.id,
        { email: userUpdate.email },
        { new: true }
      ).lean()
    : await CredentialsModel.findById(token.id).lean();

  if (!credentials) throw generateErrorResponse(404, 'User was not found');

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

const deleteCurrentUser: ProtectedEndpointAction<'/api/user'> = async (
  req,
  _params,
  token
) => {
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

  const credentials = await CredentialsModel.findByIdAndDelete(token.id).lean();
  if (!credentials) throw generateErrorResponse(404, 'User was not found');

  const cookieStore = await cookies();
  cookieStore.delete('refreshToken');
  cookieStore.delete('accessToken');
  cookieStore.delete('operation');

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
