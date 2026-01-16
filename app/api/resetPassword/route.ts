import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';

import { NewPassword } from '@ts/users/password';

import { ConfirmationsModel, CredentialsModel } from '@lib/models';
import { NewPasswordValidatior, validateData } from '@lib/validation-schemas';
import { generateAccessResponse, hashPassword } from '@lib/auth';
import { generateErrorResponse } from '@lib/utils';
import { generalEndpoint } from '@lib/endpoint-generators';

const register = async (req: NextRequest) => {
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
