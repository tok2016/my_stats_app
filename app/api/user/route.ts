import { NextRequest, NextResponse } from 'next/server';

import {
  extractToken,
  generateAccessError,
  getUserByUsername
} from '@lib/auth';
import { UserUpdateValidator } from '@lib/validationSchemas';
import { CredentialsModel, UsersModel } from '@lib/models';
import { uniteUserData } from '@lib/utils';

export async function GET(req: NextRequest) {
  const bearer = req.headers.get('Authorization');

  try {
    const token = await extractToken(bearer);
    const user = await getUserByUsername(token.id);

    return NextResponse.json(user, {
      status: 200,
      statusText: 'User was found'
    });
  } catch (err) {
    return generateAccessError(err);
  }
}

export async function PUT(req: NextRequest) {
  const bearer = req.headers.get('Authorization');

  try {
    const token = await extractToken(bearer);
    const userUpdate = await UserUpdateValidator.safeParseAsync(
      await req.json()
    );

    if (!userUpdate.success) {
      return NextResponse.json(userUpdate.error.issues, {
        status: 400,
        statusText: 'Invalid data'
      });
    }

    const credentials = userUpdate.data.email
      ? await CredentialsModel.findOneAndUpdate(
          { id: token.id },
          { email: userUpdate.data.email }
        )
      : await CredentialsModel.findById(token.id);

    if (!credentials) {
      return new NextResponse('User was not found', {
        status: 404,
        statusText: 'User was not found'
      });
    }

    delete userUpdate.data.email;
    const userInfo = await UsersModel.findOneAndUpdate(
      { id: credentials.userId },
      userUpdate.data
    );

    if (!userInfo) {
      return new NextResponse('User data was not found', {
        status: 404,
        statusText: 'User data was not found'
      });
    }

    return NextResponse.json(uniteUserData(credentials, userInfo), {
      status: 200,
      statusText: 'User data was updated successfully'
    });
  } catch (err) {
    return generateAccessError(err);
  }
}

export async function DELETE(req: NextRequest) {
  const bearer = req.headers.get('Authorization');

  try {
    const token = await extractToken(bearer);
    const credentials = await CredentialsModel.findByIdAndDelete(token.id);

    if (!credentials) {
      return new NextResponse('User was not found', {
        status: 404,
        statusText: 'User was not found'
      });
    }

    await CredentialsModel.findByIdAndDelete(credentials.userId);

    return new NextResponse('User was deleted successfully', {
      status: 200,
      statusText: 'User was deleted successfully'
    });
  } catch (err) {
    return generateAccessError(err);
  }
}
