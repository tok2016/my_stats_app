import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';

import UserAccess from '@ts/users/user-access';

import { CredentialsModel, UsersModel } from '@lib/models';
import { checkUserExistance, decodeToken, generateToken } from '@lib/auth';
import { CredentialsValidator } from '@lib/validationSchemas';

export async function GET(req: NextRequest) {
  const accessToken = req.cookies.get('accessToken');

  if (!accessToken) {
    return new NextResponse('Unauthorized', {
      status: 401,
      statusText: 'Unauthorized'
    });
  }

  const access = await decodeToken<UserAccess>(accessToken.value);
  const credentials = await CredentialsModel.findOne({
    username: access.username
  });

  if (!credentials) {
    return new NextResponse('User was not found', {
      status: 404,
      statusText: 'User was not found'
    });
  }

  const user = await UsersModel.findById(credentials.userId);

  if (!user) {
    return new NextResponse('User was not found', {
      status: 404,
      statusText: 'User was not found'
    });
  }

  return user;
}

export async function POST(req: NextRequest) {
  const newCredentials = await CredentialsValidator.safeParseAsync(
    await req.json()
  );

  if (!newCredentials.success) {
    return NextResponse.json(newCredentials.error.issues, {
      status: 400,
      statusText: 'Invalid data'
    });
  }

  const userExistance = await checkUserExistance(
    newCredentials.data.username,
    newCredentials.data.email
  );

  if (userExistance) {
    return new NextResponse(userExistance, {
      status: 400,
      statusText: userExistance
    });
  }

  if (!process.env.HASH_SALT) {
    return new NextResponse(null, {
      status: 500,
      statusText: 'Internal server error'
    });
  }

  const hashedPassword = await bcrypt.hash(
    newCredentials.data.password,
    parseInt(process.env.HASH_SALT)
  );

  const user = await UsersModel.create({
    isPublic: false,
    dashboards: []
  });

  const credentials = await CredentialsModel.create({
    ...newCredentials.data,
    password: hashedPassword,
    createdAt: new Date(),
    userId: user._id
  });

  if (credentials.validateSync()) {
    return new NextResponse(null, {
      status: 500,
      statusText: `Couldn't create new account`
    });
  }

  const userAccess: UserAccess = {
    access: await generateToken(credentials.username, credentials.password),
    refresh: await generateToken(
      credentials.username,
      credentials.password,
      true
    ),
    username: credentials.username
  };

  return NextResponse.json(userAccess, {
    status: 201,
    statusText: 'User account was created successfully'
  });
}

export async function PUT(req: NextRequest) {
  const requestBody = await req.json();
  const newCredentials = await CredentialsValidator.safeParseAsync(requestBody);

  if (!newCredentials.success) {
    return NextResponse.json(newCredentials.error.issues, {
      status: 400,
      statusText: 'Invalid data'
    });
  }

  const userAccess: UserAccess = {
    access: await generateToken(
      newCredentials.data.username,
      newCredentials.data.password
    ),
    refresh: await generateToken(
      newCredentials.data.username,
      newCredentials.data.password,
      true
    ),
    username: newCredentials.data.username
  };

  return NextResponse.json(userAccess, {
    status: 200,
    statusText: 'User account was created successfully'
  });
}
