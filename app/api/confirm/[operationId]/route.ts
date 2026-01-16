import { NextRequest, NextResponse } from 'next/server';

import { ConfirmationsModel } from '@lib/models';
import { generateCode, generateErrorResponse } from '@lib/utils';
import { cookies } from 'next/headers';
import { ConfirmationRouteParams } from '@ts/users/confirmation';
import {
  confirmationEndpoint,
  generalEndpoint
} from '@lib/endpoint-generators';

const putConfirmationChange = async (
  _req: NextRequest,
  params?: ConfirmationRouteParams
) => {
  if (!params) throw generateErrorResponse(400, 'Operation id was not given');
  const { operationId } = await params;

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

const deleteConfirmation = async (
  _req: NextRequest,
  params?: ConfirmationRouteParams
) => {
  if (!params) throw generateErrorResponse(400, 'Operation id was not given');
  const { operationId } = await params;

  await ConfirmationsModel.findByIdAndDelete(operationId);

  const cookiesStore = await cookies();
  cookiesStore.delete('operation');

  return new NextResponse('Confirmation operation was cancelled', {
    status: 200,
    statusText: 'Confirmation operation was cancelled'
  });
};

export const PUT = confirmationEndpoint(putConfirmationChange);

export const DELETE =
  generalEndpoint<ConfirmationRouteParams>(deleteConfirmation);
