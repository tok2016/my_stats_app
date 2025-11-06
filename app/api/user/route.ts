import { NextRequest, NextResponse } from 'next/server';
import { unlink } from 'fs/promises';
import path from 'path';

import {
  checkUserExistance,
  extractToken,
  generateAccessError,
  generateAccessResponse,
  getDashboards,
  getUserById,
  hashPassword
} from '@lib/auth';
import {
  CredentialsValidator,
  UserUpdateValidator,
  validateData
} from '@lib/validationSchemas';
import {
  ConfirmationsModel,
  CredentialsModel,
  DashboardsModel,
  ServiceCredentialsModel,
  UsersModel
} from '@lib/models';
import { AVATAR_DIRECTORY, responseWithError, uniteUserData } from '@lib/utils';
import { NewCredentials } from '@ts/users/credentials';
import { UserUpdate } from '@ts/users/user';

export async function GET(req: NextRequest) {
  const bearer = req.headers.get('Authorization');

  try {
    const token = await extractToken(bearer);
    const user = await getUserById(token.id);

    return NextResponse.json(user, {
      status: 200,
      statusText: 'User was found'
    });
  } catch (err) {
    return generateAccessError(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const newCredentials = await validateData<NewCredentials>(
      CredentialsValidator,
      await req.json()
    );

    const userExistance = await checkUserExistance(
      newCredentials.username,
      newCredentials.email
    );

    if (userExistance) {
      return responseWithError(400, userExistance);
    }

    const hashedPassword = await hashPassword(newCredentials.password);
    const user = await UsersModel.create({
      isPublic: false
    });

    const credentials = await CredentialsModel.create({
      ...newCredentials,
      password: hashedPassword,
      createdAt: new Date(),
      userId: user._id.toString()
    });

    return await generateAccessResponse(
      credentials.id,
      credentials.username,
      'User account was created successfully'
    );
  } catch (err) {
    return generateAccessError(err);
  }
}

export async function PUT(req: NextRequest) {
  const bearer = req.headers.get('Authorization');

  try {
    const token = await extractToken(bearer);
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

    if (!credentials) {
      return responseWithError(404, 'User was not found');
    }

    delete userUpdate.email;
    const userInfo = await UsersModel.findByIdAndUpdate(
      credentials.userId,
      userUpdate,
      { new: true }
    ).lean();

    if (!userInfo) {
      return responseWithError(404, 'User data was not found');
    }

    const dashboards = await getDashboards(credentials.userId);
    return NextResponse.json(uniteUserData(credentials, userInfo, dashboards), {
      status: 200,
      statusText: 'User data was updated successfully'
    });
  } catch (err) {
    return generateAccessError(err);
  }
}

export async function DELETE(req: NextRequest) {
  const bearer = req.headers.get('Authorization');
  const operationId = req.nextUrl.searchParams.get('operationId');

  if (!operationId) {
    return responseWithError(401, 'Operation was not confirmed');
  }

  const confirmation = await ConfirmationsModel.findById(operationId).lean();

  if (
    !confirmation
    || !confirmation.isConfirmed
    || confirmation.action !== 'delete'
  ) {
    return responseWithError(401, 'Operation was not confirmed');
  }

  try {
    const token = await extractToken(bearer);
    const credentials = await CredentialsModel.findByIdAndDelete(
      token.id
    ).lean();

    if (!credentials) {
      return responseWithError(404, 'User was not found');
    }

    const userInfo = await UsersModel.findByIdAndDelete(credentials.userId);
    await ServiceCredentialsModel.deleteMany({ userId: credentials.userId });
    await DashboardsModel.deleteMany({ userId: credentials.userId });
    await ConfirmationsModel.findByIdAndDelete(operationId);

    if (userInfo && userInfo.avatarUrl) {
      await unlink(path.join(AVATAR_DIRECTORY, userInfo.avatarUrl));
    }

    return new NextResponse('User was deleted successfully', {
      status: 200,
      statusText: 'User was deleted successfully'
    });
  } catch (err) {
    return generateAccessError(err);
  }
}
