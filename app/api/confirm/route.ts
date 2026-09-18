import { cookies } from 'next/headers';

import { ConfirmationEndpointAction } from '@ts/requests';
import { ConfirmationCode, NewConfirmation } from '@ts/users/confirmation';

import { confirmationEndpoint } from '@lib/endpoint-generators';
import { ConfirmationsModel, CredentialsModel } from '@lib/models';
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

/**
 * Public method. Finds operation by id.
 * @throws 401 if operation id was not given.
 * @throws 404 if operation is not found.
 * @returns Operation data.
 */
const getConfirmation: ConfirmationEndpointAction<
  '/api/confirm'
> = async () => {
  //Finds operation.
  const cookiesStore = await cookies();
  const operationId = cookiesStore.get('operation')?.value;
  if (!operationId)
    throw generateErrorResponse(401, 'Operation ID was not given');

  const operation = await ConfirmationsModel.findById(operationId).lean();

  //If operation is not found, deleted operation id.
  if (!operation) {
    cookiesStore.delete('operation');
    throw generateErrorResponse(404, 'Operation was not found');
  }

  return {
    ...operation,
    id: operation._id.toString()
  };
};

/**
 * Public method. Creates new operation. If it already exists, returns it.
 * @param req - Request object with user's credentials and action type.
 * @throws 400 if credentials and action type are invalid.
 * @throws 404 if user is not found.
 * @returns Operation data.
 */
const postConfirmation: ConfirmationEndpointAction<'/api/confirm'> = async (
  req
) => {
  //Validates data for new operation.
  const newConfirmation = await validateData<NewConfirmation>(
    NewConfirmationValidator,
    await req.json()
  );

  const credentials = await CredentialsModel.findOne({
    $or: [
      { username: newConfirmation.credential },
      { email: newConfirmation.credential }
    ]
  }).lean();

  if (!credentials) throw generateErrorResponse(404, 'User was not found');

  //Checks if operation already exists and it has the same credentials.
  const cookiesStore = await cookies();
  const operationId = cookiesStore.get('operation')?.value;

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

  //Deletes previous operations of user.
  const userCodes = await ConfirmationsModel.find({
    credential: credentials.username
  }).lean();

  if (userCodes.length) {
    await ConfirmationsModel.deleteMany({ credential: credentials.username });
  }

  //Generates confirmation code and creates new unconfirmed operation.
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

/**
 * Public method. Confirms or rejects operation by code and id.
 * @param req - Request object with operation data and confirmation code.
 * @throws 400 if operation data is invalid or codes mismatch.
 * @throws 404 if operation is not found.
 * @returns Updated operation data.
 */
const confirm: ConfirmationEndpointAction<'/api/confirm'> = async (req) => {
  //Validates operation data and confirmation code.
  const confirmationCode = await validateData<ConfirmationCode>(
    ConfirmationCodeValidator,
    await req.json()
  );

  //Find operation by id.
  const operation = await ConfirmationsModel.findById(
    confirmationCode.id
  ).lean();

  if (!operation) throw generateErrorResponse(404, 'Operation was not found');

  //Compares codes. If they're the same, permits operation.
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
export const PUT = confirmationEndpoint(confirm);
