import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import {
  ConfirmationEndpointAction,
  GeneralEndpointAction
} from '@ts/requests';

import {
  confirmationEndpoint,
  generalEndpoint
} from '@lib/endpoint-generators';
import { ConfirmationsModel } from '@lib/models';
import { generateCode, generateErrorResponse } from '@lib/utils';

/**
 * Public method. Generates and sends new confirmation code by operation id.
 * @param _req - Request object.
 * @param params - Route params with operation id.
 * @throws 400 if operation id is not given.
 * @throws 404 if operation is not found.
 * @returns Operation data.
 */
const updateConfirmationCode: ConfirmationEndpointAction<
  '/api/confirm/[operationId]'
> = async (_req, params) => {
  //Generates new code and updates operation of given id.
  const { operationId } = await params;
  if (!operationId)
    throw generateErrorResponse(400, 'Operation id was not given');

  const newCode = generateCode();
  const updatedConfirmation = await ConfirmationsModel.findByIdAndUpdate(
    operationId,
    { code: newCode }
  ).lean();

  if (!updatedConfirmation) {
    throw generateErrorResponse(404, 'Operation was not found');
  }

  //send email with new code
  console.log(newCode);

  return {
    ...updatedConfirmation,
    id: updatedConfirmation._id.toString(),
    isConfirmed: false
  };
};

/**
 * Public method. Cancels and deletes operation by id.
 * @param _req - Request object.
 * @param params - Route params with operation id.
 * @throws 400 if operation id is not given.
 * @returns Response object.
 */
const deleteConfirmation: GeneralEndpointAction<
  '/api/confirm/[operationId]'
> = async (_req, params) => {
  const { operationId } = await params;
  if (!operationId)
    throw generateErrorResponse(400, 'Operation id was not given');

  await ConfirmationsModel.findByIdAndDelete(operationId);

  const cookiesStore = await cookies();
  cookiesStore.delete('operation');

  return new NextResponse('Confirmation operation was cancelled', {
    status: 200,
    statusText: 'Confirmation operation was cancelled'
  });
};

export const PUT = confirmationEndpoint(updateConfirmationCode);
export const DELETE = generalEndpoint(deleteConfirmation);
