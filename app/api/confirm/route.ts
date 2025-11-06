import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';

import { ConfirmationCode, NewConfirmation } from '@ts/users/confirmation';

import {
  generateAccessError,
  generateConfirmationResponse,
  getCredentials
} from '@lib/auth';
import { ConfirmationsModel } from '@lib/models';
import {
  ConfirmationCodeValidator,
  NewConfirmationValidator,
  validateData
} from '@lib/validationSchemas';
import { CONFIRMATION_TTL, generateCode, responseWithError } from '@lib/utils';

export async function GET() {
  const cookiesStore = await cookies();
  const operationId = cookiesStore.get('operation')?.value;

  if (!operationId) {
    return responseWithError(401, 'Operation was not given');
  }

  const operation = await ConfirmationsModel.findById(operationId).lean();

  if (!operation) {
    return responseWithError(404, 'Operation was not found');
  }

  return generateConfirmationResponse({
    ...operation,
    id: operation._id.toString()
  });
}

export async function POST(req: NextRequest) {
  try {
    const cookiesStore = await cookies();
    const operationId = cookiesStore.get('operation')?.value;

    const newConfirmation = await validateData<NewConfirmation>(
      NewConfirmationValidator,
      await req.json()
    );

    const credentials = await getCredentials(newConfirmation.credential);

    if (operationId) {
      const currentOperation =
        await ConfirmationsModel.findById(operationId).lean();

      if (
        currentOperation
        && (currentOperation.credential === credentials.email
          || currentOperation.credential === credentials.username)
      ) {
        return generateConfirmationResponse({
          ...currentOperation,
          id: currentOperation._id.toString()
        });
      }
    }

    const userCodes = await ConfirmationsModel.find({
      credential: credentials.username
    }).lean();

    if (userCodes.length) {
      await ConfirmationsModel.deleteMany({ credential: credentials.username });
    }

    const code = generateCode();
    const operation = await ConfirmationsModel.create({
      credential: credentials.email,
      action: newConfirmation.action,
      code
    });

    //send email with code
    console.log(code);

    cookiesStore.set('operation', operation.id, {
      maxAge: CONFIRMATION_TTL,
      httpOnly: true
    });

    return generateConfirmationResponse({
      ...operation,
      id: operation._id.toString(),
      credential: operation.credential,
      action: operation.action,
      isConfirmed: false
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

    return generateConfirmationResponse({
      ...updatedOperation,
      id: updatedOperation._id.toString()
    });
  } catch (err) {
    return generateAccessError(err);
  }
}
