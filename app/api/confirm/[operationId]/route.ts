import { NextRequest, NextResponse } from 'next/server';

import { ConfirmationsModel } from '@lib/models';
import { generateCode, responseWithError } from '@lib/utils';
import { generateConfirmationResponse } from '@lib/auth';
import { cookies } from 'next/headers';

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
    return responseWithError(404, 'Operation was not found');
  }

  //send email with new code
  console.log(newCode);

  return generateConfirmationResponse({
    ...updatedConfirmation,
    id: updatedConfirmation._id.toString(),
    isConfirmed: false
  });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ operationId: string }> }
) {
  const { operationId } = await params;
  await ConfirmationsModel.findByIdAndDelete(operationId);

  const cookiesStore = await cookies();
  cookiesStore.delete('operation');

  return new NextResponse('Confirmation operation was cancelled', {
    status: 200,
    statusText: 'Confirmation operation was cancelled'
  });
}
