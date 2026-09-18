import { cookies } from 'next/headers';

import { GeneralEndpointAction } from '@ts/requests';
import { NewPassword } from '@ts/users/password';

import { tryGenerateAccessResponse, tryHashPassword } from '@lib/auth';
import { generalEndpoint } from '@lib/endpoint-generators';
import { ConfirmationsModel, CredentialsModel } from '@lib/models';
import { generateErrorResponse } from '@lib/utils';
import { NewPasswordValidatior, validateData } from '@lib/validation-schemas';

/**
 * Public method. Changes password of user with given username or email if they confirm it.
 * @param req - Request object with new password and operation id.
 * @throws 400 if password data is invalid.
 * @throws 401 if reset operation was not confirmed.
 * @throws 404 if user is not found.
 * @returns Refresh and access tokens.
 */
const resetPassword: GeneralEndpointAction<'/api/resetPassword'> = async (
  req
) => {
  //Validates new password data.
  const newPassword = await validateData<NewPassword>(
    NewPasswordValidatior,
    await req.json()
  );

  //Checks if reset operation is confirmed.
  const confirmation = await ConfirmationsModel.findById(
    newPassword.operationId
  ).lean();

  if (
    !confirmation
    || !confirmation.isConfirmed
    || confirmation.action !== 'password'
  ) {
    throw generateErrorResponse(401, 'Operation was not confirmed');
  }

  //Hashes new password and stores it.
  const hashedPassword = await tryHashPassword(newPassword.password);
  const updatedCredentials = await CredentialsModel.findOneAndUpdate(
    {
      $or: [
        { username: newPassword.credential },
        { email: newPassword.credential }
      ]
    },
    { password: hashedPassword },
    { new: true }
  ).lean();

  if (!updatedCredentials)
    throw generateErrorResponse(404, 'User was not found');

  //Deletes confirmation operation.
  await ConfirmationsModel.findByIdAndDelete(newPassword.operationId);

  const cookieStore = await cookies();
  cookieStore.delete('operation');

  return tryGenerateAccessResponse(
    updatedCredentials._id.toString(),
    updatedCredentials.username,
    'Password was reset successfully'
  );
};

export const POST = generalEndpoint(resetPassword);
