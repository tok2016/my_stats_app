import { NextRequest } from 'next/server';
import bcrypt from 'bcrypt';

import { PasswordUpdate } from '@ts/users/password';
import Token from '@ts/users/token';

import {
  generateAccessResponse,
  getCredentialsById,
  hashPassword
} from '@lib/auth';
import { PasswordUpdateValidator, validateData } from '@lib/validation-schemas';
import { CredentialsModel } from '@lib/models';
import { generateErrorResponse } from '@lib/utils';
import { protectedEndpoint } from '@lib/endpoint-generators';

const postChangePassword = async (token: Token, req: NextRequest) => {
  const credentials = await getCredentialsById(token.id);

  const passwordUpdate = await validateData<PasswordUpdate>(
    PasswordUpdateValidator,
    await req.json()
  );

  const arePasswordsSame = await bcrypt.compare(
    passwordUpdate.oldPassword,
    credentials.password
  );

  if (!arePasswordsSame) {
    throw generateErrorResponse(400, 'Wrong old password');
  }

  const hashedPassword = await hashPassword(passwordUpdate.password);
  await CredentialsModel.findByIdAndUpdate(
    token.id,
    { password: hashedPassword },
    { new: true }
  );

  return await generateAccessResponse(
    credentials.id,
    credentials.username,
    'Password was changed successfully'
  );
};

export const POST = protectedEndpoint(postChangePassword);
