import { NextRequest } from 'next/server';
import bcrypt from 'bcrypt';

import { UserLogin } from '@ts/users/user';

import { UserLoginValidator, validateData } from '@lib/validation-schemas';
import { CredentialsModel } from '@lib/models';
import { generateAccessResponse } from '@lib/auth';
import { generateErrorResponse } from '@lib/utils';
import { generalEndpoint } from '@lib/endpoint-generators';

const login = async (req: NextRequest) => {
  const userLogin = await validateData<UserLogin>(
    UserLoginValidator,
    await req.json()
  );

  const credentials = await CredentialsModel.findOne({
    $or: [{ username: userLogin.credential }, { email: userLogin.credential }]
  }).lean();

  if (!credentials) {
    throw generateErrorResponse(401, 'User was not found');
  }

  const arePasswordsSame = await bcrypt.compare(
    userLogin.password,
    credentials.password
  );

  if (!arePasswordsSame) {
    throw generateErrorResponse(400, 'Wrong password');
  }

  return await generateAccessResponse(
    credentials._id.toString(),
    credentials.username
  );
};

export const POST = generalEndpoint(login);
