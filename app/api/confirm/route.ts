import { NextRequest, NextResponse } from 'next/server';

import { ConfirmationInfo } from '@ts/users/confirmation';

import { generateAccessError, getCredentials } from '@lib/auth';
import { ConfirmationsModel } from '@lib/models';
import {
  ConfirmationCodeValidator,
  NewConfirmationValidator
} from '@lib/validationSchemas';
import { generateCode } from '@lib/utils';

export async function POST(req: NextRequest) {
  const newConfirmation = await NewConfirmationValidator.safeParseAsync(
    await req.json()
  );

  if (!newConfirmation.success) {
    return NextResponse.json(newConfirmation.error.issues, {
      status: 400,
      statusText: 'Invalid data'
    });
  }

  try {
    const credentials = await getCredentials(newConfirmation.data.credential);
    const userCodes = await ConfirmationsModel.find({
      credential: credentials.username
    });

    if (userCodes.length) {
      await ConfirmationsModel.deleteMany({ credential: credentials.username });
    }

    const code = generateCode();
    const operation = await ConfirmationsModel.create({
      credential: credentials.username,
      action: newConfirmation.data.action,
      code
    });

    //send email with code
    console.log(code);

    const operationInfo: ConfirmationInfo = {
      id: operation.id,
      credential: operation.credential,
      action: operation.action,
      isConfirmed: false
    };

    return NextResponse.json(operationInfo, {
      status: 202,
      statusText: 'Confirmation operation was accepted'
    });
  } catch (err) {
    return generateAccessError(err);
  }
}

export async function PUT(req: NextRequest) {
  const confirmationCode = await ConfirmationCodeValidator.safeParseAsync(
    await req.json()
  );

  if (!confirmationCode.success) {
    return NextResponse.json(confirmationCode.error.issues, {
      status: 400,
      statusText: 'Invalid data'
    });
  }

  const operation = await ConfirmationsModel.findById(confirmationCode.data.id);
  if (!operation) {
    return new NextResponse('Confirmation operation was not found', {
      status: 404,
      statusText: 'Confirmation operation was not found'
    });
  }

  if (confirmationCode.data.code !== operation.code) {
    return new NextResponse('Incorrect confirmation code', {
      status: 400,
      statusText: 'Incorrect confirmation code'
    });
  }

  const updatedOperation = await ConfirmationsModel.findByIdAndUpdate(
    confirmationCode.data.id,
    { isConfirmed: true },
    { new: true }
  );

  if (!updatedOperation) {
    return new NextResponse('Operation was not found', {
      status: 404,
      statusText: 'Operation was not found'
    });
  }

  const operationInfo: ConfirmationInfo = {
    id: updatedOperation.id,
    credential: updatedOperation.credential,
    action: updatedOperation.action,
    isConfirmed: updatedOperation.isConfirmed
  };

  return NextResponse.json(operationInfo, {
    status: 200,
    statusText: 'Operation was confirmed'
  });
}
