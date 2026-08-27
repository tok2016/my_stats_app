import { cookies } from 'next/headers';

import { GeneralEndpointAction } from '@ts/requests';
import { NewPassword } from '@ts/users/password';

import { generateAccessResponse, hashPassword } from '@lib/auth';
import { generalEndpoint } from '@lib/endpoint-generators';
import { ConfirmationsModel, CredentialsModel } from '@lib/models';
import { generateErrorResponse } from '@lib/utils';
import { NewPasswordValidatior, validateData } from '@lib/validation-schemas';

const register: GeneralEndpointAction<'/api/resetPassword'> = async (req) => {
  const newPassword = await validateData<NewPassword>(
    NewPasswordValidatior,
    await req.json()
  );

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

  const hashedPassword = await hashPassword(newPassword.password);
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
    throw generateErrorResponse(401, 'User was not found');

  await ConfirmationsModel.findByIdAndDelete(newPassword.operationId);

  const cookieStore = await cookies();
  cookieStore.delete('operation');

  return generateAccessResponse(
    updatedCredentials._id.toString(),
    updatedCredentials.username,
    'Password was reset successfully'
  );
};

export const POST = generalEndpoint(register);
