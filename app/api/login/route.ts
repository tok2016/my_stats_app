import { NextRequest } from 'next/server';
import bcrypt from 'bcrypt';

import { UserLogin } from '@ts/users/user';

import { UserLoginValidator, validateData } from '@lib/validationSchemas';
import { CredentialsModel } from '@lib/models';
import { generateAccessError, generateAccessResponse } from '@lib/auth';
import { responseWithError } from '@lib/utils';

export async function POST(req: NextRequest) {
  try {
    const userLogin = await validateData<UserLogin>(
      UserLoginValidator,
      await req.json()
    );

    const credentials = await CredentialsModel.findOne({
      $or: [{ username: userLogin.credential }, { email: userLogin.credential }]
    }).lean();

    if (!credentials) {
      return responseWithError(401, 'User was not found');
    }

    const arePasswordsSame = await bcrypt.compare(
      userLogin.password,
      credentials.password
    );

    if (!arePasswordsSame) {
      return responseWithError(400, 'Wrong password');
    }

    return await generateAccessResponse(
      credentials._id.toString(),
      credentials.username
    );
  } catch (err) {
    return generateAccessError(err);
  }
}
