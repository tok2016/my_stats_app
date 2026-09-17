import bcrypt from 'bcrypt';

import { ProtectedEndpointAction } from '@ts/requests';
import { PasswordUpdate } from '@ts/users/password';

import {
  generateAccessResponse,
  tryGetCredentialsById,
  tryHashPassword
} from '@lib/auth';
import { protectedEndpoint } from '@lib/endpoint-generators';
import { CredentialsModel } from '@lib/models';
import { generateErrorResponse } from '@lib/utils';
import { PasswordUpdateValidator, validateData } from '@lib/validation-schemas';

/**
 * Protected method. Changes password of authorized user. Requires old password for confirmation.
 * @param req - Request object with new and old passwords.
 * @param _params - Route params.
 * @param token - Token object.
 * @throws 400 if password updated data is invalid or stored passwords mismatch.
 * @throws 404 if user is not found.
 * @returns Refresh and access tokens.
 */
const postChangePassword: ProtectedEndpointAction<
  '/api/changePassword'
> = async (req, _params, token) => {
  //Validates passwords.
  const passwordUpdate = await validateData<PasswordUpdate>(
    PasswordUpdateValidator,
    await req.json()
  );

  //Compares stored and old passwords.
  const credentials = await tryGetCredentialsById(token.id);
  const arePasswordsSame = await bcrypt.compare(
    passwordUpdate.oldPassword,
    credentials.password
  );

  if (!arePasswordsSame) {
    throw generateErrorResponse(400, 'Wrong old password');
  }

  //Hashes new password.
  const hashedPassword = await tryHashPassword(passwordUpdate.password);
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
