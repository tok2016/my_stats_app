import { NextRequest, NextResponse } from 'next/server';

import { ConfirmationsModel } from '@lib/models';
import { generateCode } from '@lib/utils';
import { ConfirmationInfo } from '@ts/users/confirmation';

export async function PUT(
  _req: NextRequest,
  { params }: { params: Promise<{ operationId: string }> }
) {
  const { operationId } = await params;

  const newCode = generateCode();
  const updatedConfirmation = await ConfirmationsModel.findByIdAndUpdate(
    operationId,
    { code: newCode }
  ).lean();

  if (!updatedConfirmation) {
    return new NextResponse('Operation was not found', {
      status: 404,
      statusText: 'Operation was not found'
    });
  }

  //send email with new code
  console.log(newCode);

  const confirmationInfo: ConfirmationInfo = {
    id: updatedConfirmation._id.toString(),
    credential: updatedConfirmation.credential,
    action: updatedConfirmation.action,
    isConfirmed: false
  };

  return NextResponse.json(confirmationInfo, {
    status: 200,
    statusText: 'Confirmation code was updated'
  });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ operationId: string }> }
) {
  const { operationId } = await params;
  await ConfirmationsModel.findByIdAndDelete(operationId);

  return new NextResponse('Confirmation operation was cancelled', {
    status: 200,
    statusText: 'Confirmation operation was cancelled'
  });
}
