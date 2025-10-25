import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

import {
  ConfirmationCode,
  ConfirmationInfo,
  NewConfirmation
} from '@ts/users/confirmation';

import { generateAccessError, getCredentials } from '@lib/auth';
import { ConfirmationsModel } from '@lib/models';
import {
  ConfirmationCodeValidator,
  NewConfirmationValidator,
  validateData
} from '@lib/validationSchemas';
import { generateCode, responseWithError } from '@lib/utils';

export async function GET() {
  const cookiesStore = await cookies();
  const operationId = cookiesStore.get('operation');

  if (!operationId) {
    return responseWithError(401, 'Operation was not given');
  }

  const operation = await ConfirmationsModel.findById(operationId);

  if (!operation) {
    return responseWithError(404, 'Operation was not found');
  }

  const operationInfo: ConfirmationInfo = {
    id: operation.id,
    credential: operation.credential,
    action: operation.action,
    isConfirmed: operation.isConfirmed
  };

  return NextResponse.json(operationInfo, {
    status: 200,
    statusText: 'Operation is found and valid'
  });
}

export async function POST(req: NextRequest) {
  try {
    const newConfirmation = await validateData<NewConfirmation>(
      NewConfirmationValidator,
      await req.json()
    );

    const credentials = await getCredentials(newConfirmation.credential);
    const userCodes = await ConfirmationsModel.find({
      credential: credentials.username
    }).lean();

    if (userCodes.length) {
      await ConfirmationsModel.deleteMany({ credential: credentials.username });
    }

    const code = generateCode();
    const operation = await ConfirmationsModel.create({
      credential: credentials.username,
      action: newConfirmation.action,
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
  try {
    const confirmationCode = await validateData<ConfirmationCode>(
      ConfirmationCodeValidator,
      await req.json()
    );

    const operation = await ConfirmationsModel.findById(
      confirmationCode.id
    ).lean();
    if (!operation) {
      return responseWithError(404, 'Confirmation operation was not found');
    }

    if (confirmationCode.code !== operation.code) {
      return responseWithError(400, 'Incorrect confirmation code');
    }

    const updatedOperation = await ConfirmationsModel.findByIdAndUpdate(
      confirmationCode.id,
      { isConfirmed: true },
      { new: true }
    ).lean();

    if (!updatedOperation) {
      return responseWithError(400, 'Operation was not found');
    }

    const operationInfo: ConfirmationInfo = {
      id: updatedOperation._id.toString(),
      credential: updatedOperation.credential,
      action: updatedOperation.action,
      isConfirmed: updatedOperation.isConfirmed
    };

    return NextResponse.json(operationInfo, {
      status: 200,
      statusText: 'Operation was confirmed'
    });
  } catch (err) {
    return generateAccessError(err);
  }
}
