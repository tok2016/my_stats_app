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

const putConfirmationChange: ConfirmationEndpointAction<
  '/api/confirm/[operationId]'
> = async (_req, params) => {
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

export const PUT = confirmationEndpoint(putConfirmationChange);
export const DELETE = generalEndpoint(deleteConfirmation);
