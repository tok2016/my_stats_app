import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';

import {
  checkUserExistance,
  extractToken,
  generateAccessError,
  generateAccessResponse,
  getDashboards,
  getUserById
} from '@lib/auth';
import {
  CredentialsValidator,
  UserUpdateValidator
} from '@lib/validationSchemas';
import {
  CredentialsModel,
  DashboarsdModel,
  ServiceCredentialsModel,
  UsersModel
} from '@lib/models';
import { uniteUserData } from '@lib/utils';

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
    userId: user._id.toString()
  });

  return await generateAccessResponse(
    credentials.id,
    credentials.username,
    'User account was created successfully'
  );
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
      ? await CredentialsModel.findByIdAndUpdate(
          token.id,
          { email: userUpdate.data.email },
          { new: true }
        )
      : await CredentialsModel.findById(token.id);

    if (!credentials) {
      return new NextResponse('User was not found', {
        status: 404,
        statusText: 'User was not found'
      });
    }

    delete userUpdate.data.email;
    const userInfo = await UsersModel.findByIdAndUpdate(
      credentials.userId,
      userUpdate.data,
      { new: true }
    );

    if (!userInfo) {
      return new NextResponse('User data was not found', {
        status: 404,
        statusText: 'User data was not found'
      });
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

  try {
    const token = await extractToken(bearer);
    const credentials = await CredentialsModel.findByIdAndDelete(token.id);

    if (!credentials) {
      return new NextResponse('User was not found', {
        status: 404,
        statusText: 'User was not found'
      });
    }

    await UsersModel.findByIdAndDelete(credentials.userId);
    await ServiceCredentialsModel.deleteMany({ userId: credentials.userId });
    await DashboarsdModel.deleteMany({ userId: credentials.userId });

    return new NextResponse('User was deleted successfully', {
      status: 200,
      statusText: 'User was deleted successfully'
    });
  } catch (err) {
    return generateAccessError(err);
  }
}
