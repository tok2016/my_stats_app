import { NextRequest } from 'next/server';
import bcrypt from 'bcrypt';

import { PasswordUpdate } from '@ts/users/password';

import {
  generateAccessError,
  generateAccessResponse,
  getCredentialsById,
  hashPassword
} from '@lib/auth';
import { PasswordUpdateValidator, validateData } from '@lib/validationSchemas';
import { CredentialsModel } from '@lib/models';
import { responseWithError } from '@lib/utils';
import { extractToken } from '@lib/token';

export async function POST(req: NextRequest) {
  const bearer = req.headers.get('Authorization');

  try {
    const token = await extractToken(bearer);
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
      return responseWithError(400, 'Wrong old password');
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
  } catch (err) {
    return generateAccessError(err);
  }
}
