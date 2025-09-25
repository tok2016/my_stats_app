import { NextRequest, NextResponse } from 'next/server';

import { Token } from '@ts/users/token';
import { User } from '@ts/users/user';

import { UsersModel } from '@lib/models';
import { decodeToken, getCredentialsByToken } from '@lib/auth';
import { UserUpdateValidator } from '@lib/validationSchemas';

export async function GET(req: NextRequest) {
  const accessToken = req.cookies.get('accessToken');

  if (!accessToken) {
    return new NextResponse('Unauthorized', {
      status: 401,
      statusText: 'Unauthorized'
    });
  }

  const token = await decodeToken<Token>(accessToken.value);
  try {
    const credentials = await getCredentialsByToken(token);
    const user = await UsersModel.findById(credentials.userId);

    if (!user) {
      return new NextResponse('User was not found', {
        status: 404,
        statusText: 'User was not found'
      });
    }

    const userData: User = {
      id: user.id,
      username: credentials.username,
      email: credentials.email,
      createdAt: credentials.createdAt,
      isPublic: user.isPublic,
      avatarUrl: user.avatarUrl,
      unblockDate: user.unblockDate,
      dashboards: user.dashboards,
      country: user.country,
      birthdate: user.birthdate
    };

    return NextResponse.json(userData, {
      status: 200,
      statusText: 'User was found'
    });
  } catch (err) {
    if (err instanceof Error) {
      return new NextResponse(err.message, {
        status: 401,
        statusText: err.message
      });
    }

    return new NextResponse(null, {
      status: 500,
      statusText: 'Internal server error'
    });
  }
}

export async function PUT(req: NextRequest) {
  const userUpdate = await UserUpdateValidator.safeParseAsync(await req.json());

  if (!userUpdate.success) {
    return NextResponse.json(userUpdate.error.issues, {
      status: 400,
      statusText: 'Invalid data'
    });
  }

  return NextResponse.json(
    {},
    {
      status: 200,
      statusText: 'User account was created successfully'
    }
  );
}
