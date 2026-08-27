import bcrypt from 'bcrypt';

import { ProtectedEndpointAction } from '@ts/requests';
import { PasswordUpdate } from '@ts/users/password';

import {
  generateAccessResponse,
  getCredentialsById,
  hashPassword
} from '@lib/auth';
import { protectedEndpoint } from '@lib/endpoint-generators';
import { CredentialsModel } from '@lib/models';
import { generateErrorResponse } from '@lib/utils';
import { PasswordUpdateValidator, validateData } from '@lib/validation-schemas';

const postChangePassword: ProtectedEndpointAction<
  '/api/changePassword'
> = async (req, _params, token) => {
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
