import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';

import { UserLoginValidator } from '@lib/validationSchemas';
import { CredentialsModel } from '@lib/models';
import { generateAccessResponse } from '@lib/auth';

export async function POST(req: NextRequest) {
  const userLogin = await UserLoginValidator.safeParseAsync(await req.json());

  if (!userLogin.success) {
    return NextResponse.json(userLogin.error.issues, {
      status: 400,
      statusText: 'Invalid data'
    });
  }

  const credentials = await CredentialsModel.findOne({
    $or: [
      { username: userLogin.data.credential },
      { email: userLogin.data.credential }
    ]
  }).lean();

  if (!credentials) {
    return new NextResponse('User was not found', {
      status: 404,
      statusText: 'User was not found'
    });
  }

  console.log(credentials);

  const arePasswordsSame = await bcrypt.compare(
    userLogin.data.password,
    credentials.password
  );

  if (!arePasswordsSame) {
    return new NextResponse('Wrong password', {
      status: 400,
      statusText: 'Wrong password'
    });
  }

  return await generateAccessResponse(
    credentials._id.toString(),
    credentials.username
  );
}
