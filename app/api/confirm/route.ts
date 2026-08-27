import { cookies } from 'next/headers';

import { ConfirmationEndpointAction } from '@ts/requests';
import { ConfirmationCode, NewConfirmation } from '@ts/users/confirmation';

import { getCredentials } from '@lib/auth';
import { confirmationEndpoint } from '@lib/endpoint-generators';
import { ConfirmationsModel } from '@lib/models';
import {
  CONFIRMATION_TTL,
  generateCode,
  generateErrorResponse
} from '@lib/utils';
import {
  ConfirmationCodeValidator,
  NewConfirmationValidator,
  validateData
} from '@lib/validation-schemas';

const getConfirmation: ConfirmationEndpointAction<
  '/api/confirm'
> = async () => {
  const cookiesStore = await cookies();
  const operationId = cookiesStore.get('operation')?.value;
  if (!operationId) throw generateErrorResponse(401, 'Operation was not given');

  const operation = await ConfirmationsModel.findById(operationId).lean();
  if (!operation) {
    cookiesStore.delete('operation');
    throw generateErrorResponse(404, 'Operation was not found');
  }

  return {
    ...operation,
    id: operation._id.toString()
  };
};

const postConfirmation: ConfirmationEndpointAction<'/api/confirm'> = async (
  req
) => {
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
      return {
        ...currentOperation,
        id: currentOperation._id.toString()
      };
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

  return {
    ...operation,
    id: operation._id.toString(),
    credential: operation.credential,
    action: operation.action,
    isConfirmed: false
  };
};

const putConfirmation: ConfirmationEndpointAction<'/api/confirm'> = async (
  req
) => {
  const confirmationCode = await validateData<ConfirmationCode>(
    ConfirmationCodeValidator,
    await req.json()
  );

  const operation = await ConfirmationsModel.findById(
    confirmationCode.id
  ).lean();

  if (!operation)
    throw generateErrorResponse(404, 'Confirmation operation was not found');

  if (confirmationCode.code !== operation.code)
    throw generateErrorResponse(400, 'Incorrect confirmation code');

  const updatedOperation = await ConfirmationsModel.findByIdAndUpdate(
    confirmationCode.id,
    { isConfirmed: true },
    { new: true }
  ).lean();

  if (!updatedOperation) {
    throw generateErrorResponse(400, 'Operation was not found');
  }

  return {
    ...updatedOperation,
    id: updatedOperation._id.toString()
  };
};

export const GET = confirmationEndpoint(getConfirmation);
export const POST = confirmationEndpoint(postConfirmation);
export const PUT = confirmationEndpoint(putConfirmation);
