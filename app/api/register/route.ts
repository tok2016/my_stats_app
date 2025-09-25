import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';

import { CredentialsValidator } from '@lib/validationSchemas';
import { checkUserExistance, generateAccessResponse } from '@lib/auth';
import { CredentialsModel, UsersModel } from '@lib/models';

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

  if (credentials.validateSync()) {
    return new NextResponse(null, {
      status: 500,
      statusText: `Couldn't create new account`
    });
  }

  return await generateAccessResponse(credentials.id, credentials.username);
}
