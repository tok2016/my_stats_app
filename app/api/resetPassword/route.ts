import { NextRequest, NextResponse } from 'next/server';

import { ConfirmationsModel, CredentialsModel } from '@lib/models';
import { NewPasswordValidatior } from '@lib/validationSchemas';
import { generateAccessResponse, hashPassword } from '@lib/auth';

export async function POST(req: NextRequest) {
  const newPassword = await NewPasswordValidatior.safeParseAsync(
    await req.json()
  );

  if (!newPassword.success) {
    return NextResponse.json(newPassword.error.issues, {
      status: 400,
      statusText: 'Invalid data'
    });
  }

  const confirmation = await ConfirmationsModel.findById(
    newPassword.data.operationId
  ).lean();

  if (
    !confirmation
    || !confirmation.isConfirmed
    || confirmation.action !== 'password'
  ) {
    return new NextResponse('Operation was not confirmed', {
      status: 401,
      statusText: 'Operation was not confirmed'
    });
  }

  const hashedPassword = await hashPassword(newPassword.data.password);
  const updatedCredentials = await CredentialsModel.findOneAndUpdate(
    {
      $or: [
        { username: newPassword.data.credential },
        { email: newPassword.data.credential }
      ]
    },
    { password: hashedPassword },
    { new: true }
  ).lean();

  if (!updatedCredentials) {
    return new NextResponse('User was not found', {
      status: 404,
      statusText: 'User was not found'
    });
  }

  await ConfirmationsModel.findByIdAndDelete(newPassword.data.operationId);

  return generateAccessResponse(
    updatedCredentials._id.toString(),
    updatedCredentials.username,
    'Password was reset successfully'
  );
}
